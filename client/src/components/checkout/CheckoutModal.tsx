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
  Coins
} from 'lucide-react';
import { useCart } from '../../store/useCart';
import { useAuth } from '../../store/useAuth';
import { useUIStore } from '../../store/useUIStore';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/format';
import { motion, AnimatePresence } from 'framer-motion';

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
    city: '',
    state: '',
    email: user?.email || '',
    type: 'Home',
    phone: ''
  });

  const freeThreshold = Number(settings?.shipping_free_threshold) || 1000;
  const flatRate = Number(settings?.shipping_flat_rate) || 50;
  const codCharge = Number(settings?.cod_charge) || 39;
  const globalTaxRate = Number(settings?.tax_percentage) || 3;

  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
  const tax = items.reduce((acc, item) => {
    const rate = item.taxRate ?? globalTaxRate;
    const itemTotal = (item.price || 0) * (item.quantity || 0);
    return acc + (itemTotal * rate) / (100 + rate);
  }, 0);
  const shipping = subtotal >= freeThreshold ? 0 : flatRate;
  const codBuffer = selectedPayment === 'COD' ? codCharge : 0;
  const total = subtotal + shipping + codBuffer;

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
      // Reset state when closed
      if (!isSuccess) {
        setStep(1);
        setLoading(false);
        setPaymentError(null);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (!formData.pincode || !formData.address || !formData.firstName || !formData.phone) {
      toast.error('Please fill in required shipping fields');
      return;
    }
    setStep(2);
  };

  const handleCompleteOrder = async () => {
    if (loading) return;
    setLoading(true);
    setPaymentError(null);
    try {
      // 1. Save/Update Address
      const { data: addressRes } = await api.post('/addresses', {
        name: `${formData.firstName} ${formData.lastName}`,
        type: formData.type.toUpperCase(),
        street: formData.address,
        area: formData.area,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone,
        isDefault: true
      });

      const paymentMethod = selectedPayment === 'COD' ? 'COD' : 'ONLINE';

      // 2. Create Order
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
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SNoSdJkfqQc34y',
          amount: Math.round(total * 100),
          currency: "INR",
          name: "ZAVIRAA",
          description: "Luxury Purchase",
          image: "/zavira-logo.png",
          order_id: order.razorpay_order_id,
          handler: async (response: any) => {
            try {
              setLoading(true);
              const { data: verifyRes } = await api.post(`/orders/verify-payment/${order.id}`, {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              });
              
              if (verifyRes.success) {
                onSuccess(order);
              }
            } catch (err: any) {
              setPaymentError(err.response?.data?.message || 'Verification Failed');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: user?.email || formData.email,
            contact: formData.phone
          },
          theme: { color: "#7A578D" },
          modal: {
            ondismiss: () => {
              setLoading(false);
              toast.error('Payment cancelled');
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setPaymentError(resp.error.description || 'Payment Failed');
        });
        rzp.open();
      } else {
        // COD path
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
  };

  const PaymentOption = ({ id, label, icon: Icon, note }: any) => (
    <div 
      onClick={() => setSelectedPayment(id)}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
        selectedPayment === id 
          ? 'border-[#7A578D] bg-[#7A578D]/5 shadow-sm' 
          : 'border-gray-50 hover:border-gray-100 dark:border-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedPayment === id ? 'bg-[#7A578D] text-white' : 'bg-gray-50 text-gray-400'}`}>
           <Icon size={14} />
        </div>
        <div>
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">{label}</p>
           {note && <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">{note}</p>}
        </div>
      </div>
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPayment === id ? 'border-[#7A578D]' : 'border-gray-200'}`}>
         {selectedPayment === id && <div className="w-2 h-2 bg-[#7A578D] rounded-full" />}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isCheckoutModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 font-sans text-gray-900"
          onClick={closeCheckoutModal}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[1000px] max-h-[90vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl relative"
          >
          {/* Success Overlay */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="fixed inset-0 bg-white z-[300] flex flex-col items-center justify-center text-center p-6"
              >
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8"
                >
                  <CheckCircle2 size={48} />
                </motion.div>
                <h2 className="text-3xl font-sans font-black uppercase tracking-tight mb-2">Order Confirmed!</h2>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-8">Your luxury pieces are being prepared</p>
                <div className="w-64 h-1 bg-gray-100 rounded-full overflow-hidden">
                   <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3.5, ease: 'linear' }}
                      className="h-full bg-[#7A578D]"
                   />
                </div>
                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Setting up your delivery...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loader Overlay */}
          <AnimatePresence>
            {loading && !isSuccess && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[250] flex flex-col items-center justify-center"
              >
                <Loader2 size={40} className="text-[#7A578D] animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7A578D]">Processing...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <header className={`bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-5 py-2.5 sticky top-0 z-[210] transition-opacity ${isSuccess ? 'opacity-0' : 'opacity-100'}`}>
            <button onClick={() => step === 2 ? setStep(1) : closeCheckoutModal()} className="p-1.5 -ml-1 text-gray-400 hover:text-black transition-colors">
              <ArrowLeft size={16} />
            </button>
            <div className="flex flex-col items-center">
                <span className="text-xl font-serif tracking-tighter font-black text-[#7A578D]">ZAVIRAA</span>
                <div className="flex gap-1 mt-1">
                   {[1, 2, 3].map(s => (
                     <div key={s} className={`h-1 rounded-full transition-all duration-500 ${step >= s ? 'w-4 bg-[#7A578D]' : 'w-1.5 bg-gray-100'}`} />
                   ))}
                </div>
            </div>
            <button onClick={closeCheckoutModal} className="p-2 text-gray-400 hover:text-black transition-colors">
              <X size={20} />
            </button>
          </header>

          <div className="flex-grow overflow-y-auto no-scrollbar px-6 lg:px-10 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              <div className="lg:col-span-8 space-y-6">
                {/* Step Banner */}
                <div className="bg-[#7A578D] text-white py-2 px-6 rounded-xl flex justify-between items-center shadow-lg shadow-[#7A578D]/20">
                   <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-black text-[10px]">{step}</div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{step === 1 ? 'Shipping Address' : 'Payment Method'}</span>
                   </div>
                   <div className="flex items-center gap-1 opacity-60">
                      <ShieldCheck size={12}/>
                      <span className="text-[9px] font-bold uppercase tracking-widest">SECURE</span>
                   </div>
                </div>

                {step === 1 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Pincode*</label>
                           <input name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="110001" className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#7A578D] transition-all" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Phone Number*</label>
                           <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="9876543210" className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#7A578D] transition-all" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name*" className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#7A578D] transition-all" />
                        <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#7A578D] transition-all" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="address" value={formData.address} onChange={handleInputChange} placeholder="House no, Floor, Building*" className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#7A578D] transition-all" />
                        <input name="area" value={formData.area} onChange={handleInputChange} placeholder="Area, Street, Sector*" className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#7A578D] transition-all" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <input name="city" value={formData.city} onChange={handleInputChange} placeholder="City*" className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#7A578D] transition-all" />
                        <input name="state" value={formData.state} onChange={handleInputChange} placeholder="State*" className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#7A578D] transition-all" />
                        <div className="flex gap-1 bg-gray-50/50 p-1 rounded-xl border border-gray-100 h-full">
                           {['Home', 'Office'].map(type => (
                             <button 
                               key={type}
                               type="button"
                               onClick={() => setFormData({...formData, type})}
                               className={`flex-1 py-1 px-2 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${formData.type === type ? 'bg-[#7A578D] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                             >
                               {type}
                             </button>
                           ))}
                        </div>
                      </div>

                      <button onClick={handleNextStep} className="bg-[#7A578D] hover:bg-[#684a77] text-white w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#7A578D]/10 active:scale-[0.99] transition-all group">
                         <span>Go to Payment</span>
                         <ArrowRight size={14} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                  </div>
                ) : step === 2 ? (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    {/* Delivery Summary */}
                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 space-y-3">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <span>Ship To</span>
                          <button onClick={() => setStep(1)} className="text-[#7A578D]">Change</button>
                       </div>
                       <div className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                          {formData.firstName} {formData.lastName} • {formData.phone}
                          <br />
                          {formData.address}, {formData.city}, {formData.state} - {formData.pincode}
                       </div>
                    </div>

                    <div className="space-y-3">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-900 ml-1">Payment Options</h3>
                       <div className="grid grid-cols-1 gap-2.5">
                          <PaymentOption 
                            id="ONLINE" 
                            label="Pay Now" 
                            icon={CreditCard} 
                            note="Safe & Secure Payments"
                          />
                          <PaymentOption 
                            id="COD" 
                            label="Cash on Delivery" 
                            icon={Coins} 
                            note={`+ ${formatCurrency(codCharge)} COD fee`} 
                          />
                       </div>
                    </div>

                    <div className="bg-[#7A578D]/5 border border-[#7A578D]/10 p-4 rounded-2xl flex items-center gap-3">
                        <ShieldCheck size={20} className="text-[#7A578D]" />
                        <div>
                           <p className="text-[9px] font-black uppercase tracking-tight leading-none mb-0.5">Secure Transaction</p>
                           <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Your payment details are never stored</p>
                        </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 space-y-6">
                      <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                         <CheckCircle2 size={40} />
                      </div>
                      <div className="space-y-2">
                         <h2 className="text-3xl font-black uppercase tracking-tight">Thank You!</h2>
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7A578D]">Order #{orderInfo?.orderNumber?.split('-').pop()}</p>
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                         Your order is confirmed and will be delivered within 3-5 business days.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 max-w-md mx-auto text-left">
                         <button onClick={closeCheckoutModal} className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-900 transition-all">
                            Keep Shopping
                         </button>
                         <button onClick={() => { closeCheckoutModal(); navigate('/profile'); }} className="w-full border-2 border-gray-100 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:bg-gray-50">
                            Check Status
                         </button>
                      </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden sticky top-24">
                  <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-900">Order Summary</h3>
                    <div className="px-3 py-1 bg-[#7A578D]/5 text-[#7A578D] rounded-full text-[9px] font-black">{items.length}</div>
                  </div>
                  
                  <div className="px-8 py-6 space-y-4 max-h-[350px] overflow-y-auto no-scrollbar">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="w-16 h-20 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100 transition-transform group-hover:scale-105">
                          <img src={item.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-grow pt-2">
                          <h4 className="text-[10px] font-black uppercase tracking-tight text-gray-900 line-clamp-2 leading-relaxed">{item.name}</h4>
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                             <span className="text-[9px] text-gray-300 font-bold uppercase">QTY: {item.quantity}</span>
                             <span className="text-xs font-black text-[#7A578D]">{formatCurrency(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-6 py-5 bg-gray-50/50 space-y-2.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                      <span>Subtotal</span>
                      <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                      <span>GST (Included)</span>
                      <span className="text-gray-900">{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                      <span>Delivery Info</span>
                      <span className={shipping === 0 ? 'text-green-600 font-black' : 'text-gray-900'}>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                    </div>
                    {selectedPayment === 'COD' && (
                       <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                        <span>COD Charges</span>
                        <span className="text-gray-900">{formatCurrency(codCharge)}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center text-gray-900">
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">Total</span>
                      <span className="text-lg font-black">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
             <div className="hidden sm:block">
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Total Amount</p>
                <p className="text-xl font-black">{formatCurrency(total)}</p>
             </div>
             <div className="flex-grow sm:flex-grow-0 flex gap-4">
                {step < 3 && (
                  <button 
                    onClick={step === 1 ? handleNextStep : handleCompleteOrder}
                    disabled={loading}
                    className="bg-[#7A578D] text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#7A578D]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50"
                  >
                     {loading ? (
                        <Loader2 className="animate-spin" size={16} />
                     ) : (
                        <>
                           <span>{step === 1 ? 'Go to Payment' : 'Complete Purchase'}</span>
                           <ArrowRight size={16} />
                        </>
                     )}
                  </button>
                )}
             </div>
          </div>
          
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
