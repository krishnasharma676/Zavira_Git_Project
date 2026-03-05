import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  User, 
  ChevronRight,
  X,
  Truck,
  CreditCard,
  Building,
  Wallet,
  Coins,
  QrCode,
  Mail,
  Phone
} from 'lucide-react';
import { useCart } from '../../store/useCart';
import { useAuth } from '../../store/useAuth';
import { useUIStore } from '../../store/useUIStore';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/format';
import { motion, AnimatePresence } from 'framer-motion';

const CheckoutModal = () => {
  const { items, clearCart, addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isCheckoutModalOpen, closeCheckoutModal, openAuthModal } = useUIStore();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [couponCode] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('UPI');
  
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

  const COD_CHARGE = 39;
  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
  const tax = subtotal * 0.03;
  const shipping = subtotal >= 1000 ? 0 : 49;
  const codBuffer = selectedPayment === 'COD' ? COD_CHARGE : 0;
  const total = subtotal + tax + shipping + codBuffer;

  useEffect(() => {
    if (isCheckoutModalOpen) {
      if (!user) {
        closeCheckoutModal();
        openAuthModal('login');
        return;
      }
      api.get('/products', { params: { limit: 4 } })
        .then(res => setSuggestions(res.data.data.products))
        .catch(() => {});
      
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCheckoutModalOpen, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (!formData.pincode || !formData.address || !formData.firstName) {
      toast.error('Please fill in required shipping fields');
      return;
    }
    setStep(2);
  };

  const handleCompleteOrder = async () => {
    try {
      const { data: addressRes } = await api.post('/addresses', {
        name: `${formData.firstName} ${formData.lastName}`,
        type: formData.type.toUpperCase(),
        street: `${formData.address}, ${formData.area}`,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone || '9999999999',
        isDefault: true
      });

      const response = await api.post('/orders/checkout', {
        addressId: addressRes.data.id,
        paymentMethod: selectedPayment === 'COD' ? 'COD' : 'ONLINE',
        couponCode,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      });
      
      toast.success('Order placed successfully!');
      clearCart();
      closeCheckoutModal();
      navigate(`/order-success/${response.data.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  if (items.length === 0 && isCheckoutModalOpen) {
    return (
       <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-6"
        >
          <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] text-center">
            <ShoppingBag size={48} className="text-gray-200 mx-auto mb-6" />
            <h2 className="text-2xl font-sans font-black uppercase mb-4">Your Bag is Empty</h2>
            <button onClick={closeCheckoutModal} className="luxury-button w-full mt-4">Close</button>
          </div>
        </motion.div>
       </AnimatePresence>
    );
  }

  const PaymentOption = ({ id, label, icon: Icon, note }: any) => (
    <div 
      onClick={() => setSelectedPayment(id)}
      className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
        selectedPayment === id 
          ? 'border-[#7A578D] bg-[#7A578D]/5 shadow-sm' 
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedPayment === id ? 'bg-[#7A578D] text-white' : 'bg-gray-50 text-gray-400'}`}>
           <Icon size={18} />
        </div>
        <div>
           <p className="text-[11px] font-black uppercase tracking-widest text-gray-900">{label}</p>
           {note && <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">{note}</p>}
        </div>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === id ? 'border-[#7A578D]' : 'border-gray-200'}`}>
         {selectedPayment === id && <div className="w-2.5 h-2.5 bg-[#7A578D] rounded-full" />}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isCheckoutModalOpen && (
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 bg-[#FDFBF9] z-[200] overflow-y-auto no-scrollbar pb-32 font-sans text-gray-900"
        >
          {/* Header */}
          <header className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-4 sticky top-0 z-[210]">
            <button onClick={() => step === 2 ? setStep(1) : closeCheckoutModal()} className="p-2 -ml-2 text-gray-400 hover:text-black transition-colors">
              <ArrowLeft size={20} />
            </button>
            <Link to="/" onClick={closeCheckoutModal} className="text-2xl font-serif tracking-tighter font-black text-[#7A578D]">ZAVIRAA</Link>
            <button onClick={closeCheckoutModal} className="p-2 text-gray-400 hover:text-black transition-colors">
              <X size={20} />
            </button>
          </header>

          <div className="max-w-7xl mx-auto mt-4 px-4 lg:px-8 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Forms and Steps */}
              <div className="lg:col-span-8 space-y-4">
                {/* Step 2 Header (Jewelsmars style) - Only on Mobile when at top */}
                {step === 2 && (
                  <div className="bg-[#fca5a5] text-white py-2 px-6 text-center text-[10px] font-black uppercase tracking-widest leading-tight rounded-2xl">
                    SECURE CHECKOUT | STEP 2 OF 2
                  </div>
                )}

                {step === 1 ? (
                  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-8">
                      <h3 className="text-xl font-black uppercase tracking-tight">Add shipping address</h3>
                      <div className="space-y-4">
                        <input name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode*" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D]" />
                        <div className="grid grid-cols-2 gap-4">
                          <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name*" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D]" />
                          <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name*" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D]" />
                        </div>
                        <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Flat, house number, floor, building*" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D]" />
                        <input name="area" value={formData.area} onChange={handleInputChange} placeholder="Area, street, sector, village*" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D]" />
                        <div className="grid grid-cols-2 gap-4">
                          <input name="city" value={formData.city} onChange={handleInputChange} placeholder="City*" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D]" />
                          <input name="state" value={formData.state} onChange={handleInputChange} placeholder="State*" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D]" />
                        </div>
                        <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number*" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D]" />
                      </div>
                      <button onClick={handleNextStep} className="bg-[#7A578D] text-white w-full py-5 rounded-3xl text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#7A578D]/20 active:scale-95 transition-all">Continue to Payment</button>
                  </div>
                ) : (
                  // Step 2: Payment UI
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    {/* Delivery Details Summary */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                       <div className="flex justify-between items-center mb-4">
                          <h3 className="text-[12px] font-black uppercase tracking-tight text-gray-900">Delivery details</h3>
                          <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase text-[#7A578D] hover:underline">Change</button>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[13px] font-black text-gray-800">{formData.firstName} {formData.lastName}</p>
                          <p className="text-[11px] font-bold text-gray-400 uppercase leading-relaxed tracking-tight">
                            {formData.address}, {formData.area}, {formData.city}, {formData.state} - {formData.pincode}
                          </p>
                          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-1.5">
                               <Phone size={12} className="text-gray-300" />
                               <span className="text-[10px] font-black text-gray-400">{formData.phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                               <Mail size={12} className="text-gray-300" />
                               <span className="text-[10px] font-black text-gray-400 lowercase">{formData.email || 'no email provided'}</span>
                            </div>
                          </div>
                       </div>
                    </div>

                    {/* Delivery Estimate */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
                       <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#7A578D]">
                          <Truck size={24} />
                       </div>
                       <div>
                          <p className="text-[11px] font-black uppercase tracking-tight text-gray-900">Quick Delivery: <span className="text-gray-400">Within 48 Hours</span></p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Shipping Charges: {formatCurrency(shipping)}</p>
                       </div>
                    </div>

                    {/* Payment Options Header */}
                    <div className="pt-4 px-2">
                       <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-900">Pay via</h3>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Fast and secure encrypted transactions</p>
                    </div>

                    {/* Payment Options List */}
                    <div className="space-y-3">
                       <PaymentOption id="UPI" label="UPI Payment" icon={QrCode} note="Pay via any UPI App" />
                       
                       {/* QR Section if UPI is selected */}
                       {selectedPayment === 'UPI' && (
                         <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-white rounded-3xl border border-[#7A578D]/20 p-8 flex flex-col items-center text-center">
                            <div className="p-4 bg-gray-50 rounded-[2rem] border border-gray-100 mb-4 shadow-inner">
                               <div className="w-32 h-32 bg-white flex items-center justify-center border-4 border-gray-100 rounded-xl overflow-hidden">
                                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ZAVIRAA-PAYMENT" className="w-full h-full p-2 grayscale opacity-80" alt="Mock QR" />
                               </div>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-1">Scan the QR code & pay</p>
                            <p className="text-[9px] font-bold text-[#7A578D] uppercase tracking-widest">QR Code is valid for 10:00 mins</p>
                            
                            <div className="w-full flex items-center gap-4 my-6">
                               <div className="h-[1px] flex-1 bg-gray-100"></div>
                               <span className="text-[9px] font-black text-gray-300 uppercase">OR</span>
                               <div className="h-[1px] flex-1 bg-gray-100"></div>
                            </div>

                            <div className="w-full max-w-xs space-y-3">
                               <input placeholder="Enter UPI ID (example@okaxis)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[10px] font-bold focus:outline-none focus:border-[#7A578D]" />
                               <button className="w-full text-[10px] font-black text-[#7A578D] uppercase tracking-widest hover:underline">Verify & Pay</button>
                            </div>
                         </motion.div>
                       )}

                       <PaymentOption id="CARD" label="Credit/Debit Card" icon={CreditCard} />
                       <PaymentOption id="NETBANKING" label="Net Banking" icon={Building} />
                       <PaymentOption id="WALLET" label="Wallets" icon={Wallet} />
                       <PaymentOption 
                         id="COD" 
                         label="Cash on Delivery" 
                         icon={Coins} 
                         note={`Inc. ${formatCurrency(COD_CHARGE)} COD charges`} 
                       />
                    </div>
                  </motion.div>
                )}

                {/* Account Accordion - Desktop Left Column */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hidden lg:block">
                  <button onClick={() => setIsAccountOpen(!isAccountOpen)} className="w-full px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-gray-400" /><span className="text-[12px] font-black uppercase tracking-tight text-gray-900">Account Management</span>
                    </div>
                    {isAccountOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" /> }
                  </button>
                  <AnimatePresence>
                    {isAccountOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-50 p-6">
                         <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center mb-4">
                            <span className="text-[11px] font-black text-gray-900">{user?.name}</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">{user?.email}</span>
                         </div>
                         <div className="flex gap-4">
                            <Link to="/terms" onClick={closeCheckoutModal} className="text-[9px] font-black uppercase text-gray-400">T&C</Link>
                            <Link to="/privacy" onClick={closeCheckoutModal} className="text-[9px] font-black uppercase text-gray-400">Privacy</Link>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column: Sidebar (Sticky on Desktop) */}
              <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
                {/* Order Summary Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-[13px] font-black uppercase tracking-tight text-gray-900">Order Summary</h3>
                    <span className="text-[11px] font-bold text-[#7A578D]">{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
                  </div>
                  
                  <div className="px-6 py-6 space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <img src={item.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-grow pt-1">
                          <h4 className="text-[10px] font-black uppercase tracking-tight text-gray-900 line-clamp-1">{item.name}</h4>
                          <div className="flex justify-between items-center mt-1">
                             <span className="text-[9px] text-gray-400 font-bold uppercase">Qty: {item.quantity}</span>
                             <span className="text-[11px] font-black text-gray-900">{formatCurrency(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-6 py-6 bg-gray-50/50 space-y-3 border-t border-gray-100">
                    <div className="flex justify-between text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                      <span>Tax (3%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                    </div>
                    {selectedPayment === 'COD' && (
                       <div className="flex justify-between text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                         <span>COD Charges</span>
                         <span>{formatCurrency(COD_CHARGE)}</span>
                       </div>
                    )}
                    <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-baseline">
                      <span className="text-[12px] font-black uppercase tracking-widest text-gray-900">Total</span>
                      <span className="text-2xl font-black text-[#7A578D]">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations carousel (Only show if suggestions exist) */}
                {suggestions.length > 0 && (
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-[11px] font-black uppercase tracking-tight mb-4 text-gray-400 italic">Recommended</h3>
                    <div className="space-y-4">
                        {suggestions.slice(0, 3).map(prod => (
                          <div key={prod.id} className="flex items-center gap-3">
                              <img src={prod.images?.[0]?.imageUrl} className="w-12 h-12 object-cover rounded-xl border border-gray-50" alt="" />
                              <div className="flex-grow min-w-0">
                                <h4 className="text-[9px] font-black text-gray-900 uppercase truncate">{prod.name}</h4>
                                <p className="text-[10px] font-black text-[#7A578D]">{formatCurrency(prod.discountedPrice || prod.basePrice)}</p>
                              </div>
                              <button 
                                onClick={() => addItem({
                                  id: prod.id, name: prod.name, price: prod.discountedPrice || prod.basePrice,
                                  image: prod.images?.[0]?.imageUrl, quantity: 1, stock: 10
                                })}
                                className="bg-[#7A578D]/5 text-[#7A578D] px-3 py-1.5 rounded-lg text-[9px] font-black uppercase"
                              >Add</button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Account Footer Links - (Only on Mobile) */}
                <div className="lg:hidden bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <button onClick={() => setIsAccountOpen(!isAccountOpen)} className="w-full px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-400" /><span className="text-[11px] font-black uppercase tracking-tight text-gray-900">Account</span>
                    </div>
                    {isAccountOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" /> }
                  </button>
                </div>
              </div>
            </div>

            {/* Global Footer */}
            <div className="mt-12 flex flex-col items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-300">
               <div className="flex items-center gap-4">
                 <span className="opacity-60 italic">Zavira Logistics</span>
                 <span>|</span>
                 <span className="flex items-center gap-2">
                    Powered By 
                    <img src="https://logowik.com/content/uploads/images/shiprocket4661.jpg" className="h-2.5 grayscale opacity-50" alt="" />
                 </span>
               </div>
               <div className="flex items-center gap-4 opacity-40">
                  <Link to="/terms" onClick={closeCheckoutModal}>T&C</Link>
                  <Link to="/privacy" onClick={closeCheckoutModal}>Privacy Policy</Link>
               </div>
            </div>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between z-[220] shadow-[0_-10px_30px_rgba(0,0,0,0.03)] font-sans">
             <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D]">Total Payable</span>
                <div>
                   <span className="text-xl font-black text-gray-900">{formatCurrency(total)}</span>
                </div>
             </div>
             <button 
               onClick={step === 1 ? handleNextStep : handleCompleteOrder}
               className="bg-[#7A578D] text-white px-10 py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#7A578D]/20 active:scale-95 transition-all flex items-center gap-3"
             >
                {step === 1 ? 'Next Step' : 'Confirm Order'} <ChevronRight size={18} />
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
