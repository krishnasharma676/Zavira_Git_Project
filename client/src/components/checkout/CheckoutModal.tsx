import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  X,
  Truck,
  CreditCard,
  Coins,
  MapPin
} from 'lucide-react';
import { useCart } from '../../store/useCart';
import { useAuth } from '../../store/useAuth';
import { useUIStore } from '../../store/useUIStore';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import { V, KB, validateAll, inputCls } from '../../utils/validators';

const CheckoutModal = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isCheckoutModalOpen, closeCheckoutModal, openAuthModal } = useUIStore();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
  const [selectedPayment, setSelectedPayment] = useState<string>('ONLINE');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    pincode: '',
    firstName: '',
    lastName: '',
    address: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    email: user?.email || '',
    type: 'Home',
    phone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const flatRate = Number(settings?.shipping_flat_rate) || 50;
  const codCharge = Number(settings?.cod_charge) || 39;
  const globalTaxRate = Number(settings?.tax_percentage) || 3;

  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
  const tax = items.reduce((acc, item) => {
    const rate = item.taxRate ?? globalTaxRate;
    const itemTotal = (item.price || 0) * (item.quantity || 0);
    return acc + (itemTotal * rate) / (100 + rate);
  }, 0);
  
  const shipping = subtotal >= (Number(settings?.free_shipping_threshold) || 1000) ? 0 : flatRate;
  const codBuffer = selectedPayment === 'COD' ? codCharge : 0;
  const total = subtotal + shipping + codBuffer;

  // ─── Pincode Auto-lookup Effect ──────────────────────────────────────────
  useEffect(() => {
    if (formData.pincode.length === 6) {
      const lookupPincode = async () => {
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
          const data = await res.json();
          if (data[0].Status === 'Success') {
            const info = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: info.District,
              state: info.State
            }));
            setErrors(prev => ({ ...prev, city: '', state: '' }));
            toast.success(`Location detected: ${info.District}`, { icon: '📍', duration: 2000 });
          }
        } catch (e) {}
      };
      lookupPincode();
    }
  }, [formData.pincode]);

  useEffect(() => {
    if (isCheckoutModalOpen) {
      if (!user) {
        closeCheckoutModal();
        openAuthModal('login');
        return;
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      if (!isSuccess) {
        setStep(1);
        setLoading(false);
      }
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCheckoutModalOpen, user]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data.data);
      } catch (e) {}
    };
    fetchSettings();
  }, []);

  const RULES = {
    pincode:   V.pincode,
    phone:     V.phone,
    firstName: V.firstName,
    lastName:  V.lastName,
    address:   V.address,
    area:      V.area,
    city:      V.city,
    state:     V.state,
    landmark:  (v: string) => v ? '' : 'Landmark is recommended'
  };

  const validate = (name: string, value: string) => {
    const fn = (RULES as any)[name];
    return fn ? fn(value) : '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'pincode' && (!KB.numericOnly(value) || value.length > 6)) return;
    if (name === 'phone'   && (!KB.numericOnly(value) || value.length > 10)) return;
    if ((name === 'firstName' || name === 'lastName' || name === 'city' || name === 'state') && !KB.noDigits(value)) return;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const isFormValid = () => {
    const essential = ['pincode', 'phone', 'firstName', 'address', 'area', 'city', 'state'];
    return essential.every(k => (formData as any)[k] && !validate(k, (formData as any)[k]));
  };

  const handleNextStep = () => {
    const errs = validateAll(formData as any, RULES);
    delete errs.landmark; 
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the highlighted fields');
      return;
    }
    setStep(2);
  };

  const handleCompleteOrder = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data: addressRes } = await api.post('/addresses', {
        name: `${formData.firstName} ${formData.lastName}`,
        type: formData.type.toUpperCase(),
        street: formData.address,
        area: formData.area,
        landmark: formData.landmark || null,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone,
        isDefault: true
      });

      const paymentMethod = selectedPayment === 'COD' ? 'COD' : 'ONLINE';

      const { data: orderRes } = await api.post('/orders/checkout', {
        addressId: addressRes.data.id,
        paymentMethod,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          variantId: item.variantId,
          selectedSize: item.selectedSize
        }))
      });

      const order = orderRes.data;

      if (paymentMethod === 'ONLINE' && order.razorpay_order_id) {
        const options = {
          key: settings?.razorpay_key_id || 'rzp_test_SNoSdJkfqQc34y',
          amount: Math.round(total * 100),
          currency: "INR",
          name: "ZAVIRAA",
          description: "Luxury Purchase",
          image: "/zavira-logo.png",
          order_id: order.razorpay_order_id,
          handler: async (response: any) => {
            setLoading(true);
            try {
              const { data: verifyRes } = await api.post(`/orders/verify-payment/${order.id}`, {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              });
              if (verifyRes.success) onSuccess(order);
            } catch (err: any) {
              setPaymentError(err.response?.data?.message || 'Verification Failed');
            } finally { setLoading(false); }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: user?.email || formData.email,
            contact: formData.phone
          },
          theme: { color: "#7A578D" },
          modal: { ondismiss: () => { setLoading(false); toast.error('Payment cancelled'); } }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        onSuccess(order);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  const onSuccess = (order: any) => {
    setOrderInfo(order);
    setIsSuccess(true);
    setStep(3);
    clearCart();
    setTimeout(() => {
      closeCheckoutModal();
      setIsSuccess(false);
      setStep(1);
      navigate('/');
    }, 4000);
  };

  const PaymentOption = ({ id, label, icon: Icon, note, subIcons }: any) => (
    <div 
      onClick={() => setSelectedPayment(id)}
      className={`p-4 rounded-none border-2 transition-all duration-300 cursor-pointer flex items-center justify-between group ${
        selectedPayment === id 
          ? 'border-[#7A578D] bg-gray-50' 
          : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      <div className="flex items-center gap-4 w-full">
        <div className={`w-12 h-12 rounded-none shrink-0 flex items-center justify-center transition-colors ${selectedPayment === id ? 'bg-[#7A578D] text-white' : 'bg-gray-50 text-gray-400'}`}>
           <Icon size={20} />
        </div>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between pr-4">
           <div>
              <p className={`text-[12px] font-black uppercase tracking-widest ${selectedPayment === id ? 'text-[#7A578D]' : 'text-gray-900'}`}>{label}</p>
              {note && <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{note}</p>}
           </div>
           {subIcons && <div className="flex items-center gap-1.5 mt-2 sm:mt-0">{subIcons}</div>}
        </div>
      </div>
      <div className={`w-5 h-5 rounded-none border-2 shrink-0 flex items-center justify-center transition-all ${selectedPayment === id ? 'border-[#7A578D] bg-[#7A578D]' : 'border-gray-200'}`}>
         {selectedPayment === id && <div className="w-2 h-2 bg-white" />}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isCheckoutModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 font-sans"
          onClick={closeCheckoutModal}
        >
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[1000px] max-h-[92vh] rounded-none overflow-hidden flex flex-col shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] relative"
          >
          
          {/* Header */}
          <header className={`bg-white border-b border-gray-100 flex items-center justify-between px-6 py-4 sticky top-0 z-[210] ${isSuccess ? 'opacity-0' : 'opacity-100'}`}>
            <button onClick={() => step === 2 ? setStep(1) : closeCheckoutModal()} className="p-2 -ml-2 text-gray-400 hover:text-black transition-colors"><ArrowLeft size={18} /></button>
            <div className="flex flex-col items-center">
                <span className="text-2xl font-serif tracking-tighter font-black text-[#7A578D] uppercase">ZAVIRAA</span>
                <div className="flex gap-1.5 mt-1.5">
                   {[1, 2, 3].map(s => (
                     <div key={s} className={`h-1.5 rounded-none transition-all duration-500 ${step >= s ? 'w-6 bg-[#7A578D]' : 'w-2 bg-gray-100'}`} />
                   ))}
                </div>
            </div>
            <button onClick={closeCheckoutModal} className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors"><X size={20} /></button>
          </header>

          <div className="flex-grow overflow-y-auto no-scrollbar px-6 lg:px-12 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-[#7A578D] text-white py-3 px-6 rounded-none flex justify-between items-center shadow-none border border-[#7A578D]">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-none bg-white text-[#7A578D] flex items-center justify-center font-black text-[12px]">{step}</div>
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">{step === 1 ? 'Shipping Destination' : 'Secure Payment'}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <ShieldCheck size={14}/>
                      <span className="text-[10px] font-black uppercase tracking-widest italic opacity-80">Encrypted</span>
                   </div>
                </div>

                {step === 1 ? (
                  <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 relative">
                           <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Pincode *</label>
                           <input
                             name="pincode" value={formData.pincode} onChange={handleInputChange}
                             placeholder="Enter Pincode *" inputMode="numeric" maxLength={6}
                             className={inputCls(errors.pincode)}
                           />
                           <MapPin size={14} className="absolute right-4 bottom-3.5 text-[#7A578D] opacity-30" />
                           {errors.pincode && <p className="text-[9px] text-red-500 font-bold mt-1">{errors.pincode}</p>}
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Phone *</label>
                           <input
                             name="phone" value={formData.phone} onChange={handleInputChange}
                             placeholder="Enter Phone Number *" inputMode="numeric" maxLength={10}
                             className={inputCls(errors.phone)}
                           />
                           {errors.phone && <p className="text-[9px] text-red-500 font-bold mt-1">{errors.phone}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Enter First Name *" className={inputCls(errors.firstName)} />
                        <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Enter Last Name" className={inputCls(errors.lastName)} />
                      </div>

                      <div className="space-y-4">
                        <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter House No, Floor, Building *" className={inputCls(errors.address)} />
                        <div className="grid grid-cols-2 gap-4">
                           <input name="area" value={formData.area} onChange={handleInputChange} placeholder="Enter Area, Colony, Street *" className={inputCls(errors.area)} />
                           <input name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="Enter Landmark (Optional)" className={inputCls(errors.landmark)} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <input name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter City *" className={inputCls(errors.city)} />
                        <input name="state" value={formData.state} onChange={handleInputChange} placeholder="Enter State *" className={inputCls(errors.state)} />
                        <div className="flex gap-1 bg-gray-50 p-1 rounded-none border border-gray-100">
                           {['Home', 'Office'].map(type => (
                             <button key={type} type="button" onClick={() => setFormData({...formData, type})} className={`flex-1 py-2 px-2 text-[10px] font-black uppercase tracking-wider transition-all ${formData.type === type ? 'bg-black text-white' : 'text-gray-400'}`}>
                               {type}
                             </button>
                           ))}
                        </div>
                      </div>

                      <button onClick={handleNextStep} disabled={!isFormValid()} className="bg-black hover:bg-[#7A578D] disabled:bg-gray-100 disabled:text-gray-400 text-white w-full py-5 rounded-none text-[12px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4">
                         <span>Go to Payment</span>
                         <ArrowRight size={16} />
                      </button>
                  </div>
                ) : step === 2 ? (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="bg-gray-50 rounded-none p-5 border border-gray-100 flex justify-between items-start">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-[#7A578D] tracking-widest mb-2">Delivery Summary</p>
                          <p className="text-[13px] font-black text-gray-900 uppercase">{formData.firstName} {formData.lastName}</p>
                          <p className="text-[11px] font-bold text-gray-500 uppercase leading-relaxed max-w-[300px]">
                            {formData.address}, {formData.area}, {formData.city}, {formData.state} - {formData.pincode}
                            {formData.landmark && <span className="block italic text-gray-400 mt-1">Landmark: {formData.landmark}</span>}
                          </p>
                       </div>
                       <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase text-[#7A578D] border-b-2 border-[#7A578D]/20 hover:border-[#7A578D] transition-all">Edit</button>
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 border-l-4 border-[#7A578D] pl-3">Payment Methods</h3>
                       <div className="grid grid-cols-1 gap-3">
                          <PaymentOption id="ONLINE" label="Pay Securely Now" icon={CreditCard} note="Cards, UPI, Netbanking" />
                          <PaymentOption id="COD" label="Cash on Delivery" icon={Coins} note={`Extra ${formatCurrency(codCharge)} handling fee`} />
                       </div>
                    </div>
                  </motion.div>
                ) : null}
              </div>

              <div className="lg:col-span-4">
                <div className="bg-white border border-gray-100 p-8 rounded-none shadow-none sticky top-24">
                  <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                    <h3 className="text-[14px] font-black uppercase tracking-widest text-gray-900">Summary</h3>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{items.length} Items</div>
                  </div>
                  
                  <div className="space-y-6 max-h-[300px] overflow-y-auto no-scrollbar mb-8 pr-2">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-20 bg-gray-50 rounded-none overflow-hidden shrink-0 border border-gray-100">
                          <img src={item.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-grow py-1 flex flex-col justify-between">
                           <h4 className="text-[10px] font-black uppercase tracking-tight text-gray-900 line-clamp-2 leading-relaxed">{item.name}</h4>
                           <div className="flex justify-between items-center">
                              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</span>
                              <span className="text-[11px] font-black text-gray-900">{formatCurrency(item.price)}</span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                       <span>Shipping</span>
                       <span className={shipping === 0 ? 'text-green-600 font-black' : 'text-gray-900'}>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                    </div>
                    {selectedPayment === 'COD' && (
                       <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>COD Fee</span>
                        <span className="text-gray-900">{formatCurrency(codCharge)}</span>
                      </div>
                    )}
                    <div className="pt-4 border-t-2 border-black flex justify-between items-center">
                      <span className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-900">Total</span>
                      <span className="text-2xl font-black text-[#7A578D] tracking-tighter">{formatCurrency(total)}</span>
                    </div>
                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em] text-right">Includes all taxes</p>
                  </div>

                  {step < 3 && (
                    <button 
                      onClick={step === 1 ? handleNextStep : handleCompleteOrder}
                      className="w-full mt-8 bg-[#7A578D] text-white py-5 rounded-none text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-black flex items-center justify-center gap-3 border border-[#7A578D] hover:border-black"
                    >
                      <span>{step === 1 ? 'Next: Shipping' : 'Confirm & Pay'}</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          <div className="p-6 bg-white flex items-center justify-between border-t border-gray-100">
             <div className="hidden sm:block">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Payable Now</p>
                <p className="text-2xl font-black text-gray-900">{formatCurrency(total)}</p>
             </div>
             <div className="flex gap-4">
                <div className="flex flex-col items-end opacity-20 px-4 border-r border-gray-200">
                   <ShieldCheck size={18} />
                   <p className="text-[7px] font-black uppercase tracking-widest mt-1">256-bit SSL</p>
                </div>
                <div className="pt-1">
                   <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300">Luxury Collection</p>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-200">Zaviraa Heritage</p>
                </div>
             </div>
          </div>
          
          <AnimatePresence>
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="fixed inset-0 bg-[#0A0A0A] z-[300] flex flex-col items-center justify-center text-center overflow-hidden font-sans"
              >
                {/* Immersive Cinematic Background */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                      rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-[#7A578D]/20 rounded-full blur-[150px]"
                  />
                  <motion.div 
                    animate={{ 
                      scale: [1.2, 1, 1.2],
                      opacity: [0.2, 0.4, 0.2],
                      rotate: [0, -90, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-purple-900/20 rounded-full blur-[150px]"
                  />
                  {/* Grain Texture Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </div>
 
                <motion.div 
                  initial={{ opacity: 0, y: 40, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 w-full max-w-4xl px-8 flex flex-col items-center"
                >
                  {/* Minimal Prestige Logo */}
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mb-16"
                  >
                    <img src="/zavira-logo.png" alt="Zaviraa" className="h-10 md:h-12 w-auto object-contain brightness-0 invert opacity-80" />
                  </motion.div>
 
                  {/* Verified Icon with Animated Ring */}
                  <div className="relative mb-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", damping: 12 }}
                      className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-[#7A578D] shadow-[0_0_60px_rgba(122,87,141,0.4)]"
                    >
                      <CheckCircle2 size={48} strokeWidth={1.5} />
                    </motion.div>
                    <motion.div 
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-2 border-white/50"
                    />
                  </div>
                  
                  {/* Monumental Typography */}
                  <div className="space-y-4 mb-20">
                    <motion.h2 
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ delay: 0.6, duration: 1 }}
                      className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none"
                    >
                      ORDER<br/>CONFIRMED
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      transition={{ delay: 1, duration: 1 }}
                      className="text-[12px] md:text-[14px] font-black uppercase tracking-[0.6em] text-[#C9A0C8]"
                    >
                      {orderInfo?.orderNumber 
                        ? `Reference: ZV-${orderInfo.orderNumber.split('-').pop()}` 
                        : "Your luxury acquisition is secured"}
                    </motion.p>
                  </div>
 
                  {/* Sophisticated Progress / CTA Area */}
                  <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                         <span>Allocating Inventory</span>
                         <span className="text-[#C9A0C8] animate-pulse">Processing...</span>
                      </div>
                      <div className="h-0.5 w-full bg-white/10 overflow-hidden rounded-full">
                         <motion.div 
                            initial={{ width: 0 }} animate={{ width: "100%" }} 
                            transition={{ duration: 3.5, ease: "linear" }} 
                            className="h-full bg-white" 
                         />
                      </div>
                    </div>
                    
                    <motion.div 
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                       className="flex items-center justify-center gap-3 py-4 px-8 border border-white/10 rounded-full bg-white/5 backdrop-blur-md"
                    >
                       <ShieldCheck size={16} className="text-[#C9A0C8]" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Secured with 256-bit protocols</span>
                    </motion.div>
                  </div>
                </motion.div>
 
                {/* Branding Footer Details */}
                <div className="absolute bottom-12 left-0 right-0 px-12 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
                   <span>© {new Date().getFullYear()} ZAVIRAA HERITAGE</span>
                   <span>HANDCRAFTED IN BHARAT</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {/* Removed local Processing loader - handled by GlobalLoader */}
          </AnimatePresence>
          
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
