import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Gift, 
  ShoppingBag, 
  User, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import { useCheckout } from '../hooks/useCheckout';

const CheckoutPage = () => {
  const {
    items,
    user,
    logout,
    navigate,
    addItem,
    isSummaryOpen,
    setIsSummaryOpen,
    suggestions,
    isAccountOpen,
    setIsAccountOpen,
    isSubmitting,
    formData,
    handleInputChange,
    handleCompleteOrder,
    total,
    savings
  } = useCheckout();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag size={48} className="text-gray-200 mb-6" />
        <h2 className="text-2xl font-sans font-black uppercase mb-4">Your Bag is Empty</h2>
        <p className="text-gray-400 text-sm mb-8 uppercase tracking-widest leading-relaxed">Add some masterpieces before <br/>proceeding to checkout.</p>
        <button onClick={() => navigate('/shop')} className="luxury-button !px-10">Start Selection</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] pb-20 font-sans text-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-4 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-black transition-colors">
          <ArrowLeft size={20} />
        </button>
        <Link to="/" className="text-3xl font-serif tracking-tighter font-black text-[#7A578D]">ZAVIRAA</Link>
        <div className="w-10"></div> {/* Spacer for symmetry */}
      </header>

      {/* Promo Banner */}
      <div className="bg-[#fca5a5] text-white py-2 px-6 text-center text-[10px] font-black uppercase tracking-widest leading-tight">
        Extra 15% Off on Prepaid Orders | COD available on orders above ₹199
      </div>

      <main className="max-w-[540px] mx-auto mt-4 px-4 space-y-4">
        
        {/* Order Summary Accordion */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <button 
            onClick={() => setIsSummaryOpen(!isSummaryOpen)}
            className="w-full px-6 py-5 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-black uppercase tracking-tight text-gray-900">Order Summary</span>
              <span className="text-[11px] font-bold text-gray-400 italic">({items.length} {items.length === 1 ? 'Item' : 'Items'})</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-sm font-black text-gray-900">{formatCurrency(total)}</span>
               {isSummaryOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" /> }
            </div>
          </button>

          <AnimatePresence>
            {isSummaryOpen && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-gray-50"
              >
                <div className="px-6 py-6 space-y-6">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-grow pt-1">
                        <h4 className="text-[10px] font-black uppercase tracking-tight text-gray-900 line-clamp-1">{item.name}</h4>
                        <div className="flex gap-2 mt-1 items-center">
                          {item.selectedSize && <span className="text-[7px] font-black bg-gray-100 px-1 rounded uppercase">Size: {item.selectedSize}</span>}
                          {item.colorCode && (
                            <div className="flex items-center gap-1 bg-gray-100 px-1 rounded h-[14px]">
                               <div style={{ backgroundColor: item.colorCode }} className="w-1.5 h-1.5 rounded-full border border-gray-200" />
                            </div>
                          )}
                        </div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                        <p className="text-[11px] font-black text-[#7A578D] mt-1">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 p-3 bg-gray-100/50 rounded-2xl flex items-center justify-between cursor-pointer border border-gray-100">
                    <div className="flex items-center gap-2">
                       <Gift size={16} className="text-[#7A578D]" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D]">Make It a Gift! ₹99.00</span>
                    </div>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-[#f0fdf4] py-2 px-6 text-center text-[10px] font-black text-[#16a34a] uppercase tracking-widest border-t border-[#dcfce7]">
             Yay! You've saved {formatCurrency(savings)} so far 🥳
          </div>
        </div>


        {/* Items you may like (Suggestions) */}
        {suggestions.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
             <h3 className="text-[12px] font-black uppercase tracking-tight mb-6">Items you may like</h3>
             <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x pb-4">
                {suggestions.map(prod => (
                  <div key={prod.id} className="min-w-[200px] snap-start p-3 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col">
                     <div className="flex gap-3 mb-4 flex-1">
                        <img src={prod.images?.[0]?.imageUrl} className="w-14 h-14 object-cover rounded-xl border border-gray-100" alt="" />
                        <div className="min-w-0">
                           <h4 className="text-[9px] font-black text-gray-900 uppercase tracking-tight line-clamp-2 leading-tight mb-1">{prod.name}</h4>
                           <p className="text-[10px] font-black text-[#7A578D]">{formatCurrency(prod.discountedPrice || prod.basePrice)}</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => addItem({
                         id: prod.id,
                         name: prod.name,
                         price: prod.discountedPrice || prod.basePrice,
                         image: prod.images?.[0]?.imageUrl,
                         stock: prod.inventory?.stock || 0,
                         quantity: 1
                       })}
                       className="w-full bg-white dark:bg-[#0A0A0A] border border-[#7A578D] text-[#7A578D] hover:bg-[#7A578D] hover:text-white py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                     >
                        Add
                     </button>
                  </div>
                ))}
             </div>
             {/* Simple progress bar as seen in image */}
             <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div className="w-1/3 h-full bg-[#7A578D]"></div>
             </div>
          </div>
        )}

        {/* Shipping Address Form */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-8">
            <h3 className="text-xl font-black uppercase tracking-tight">Add shipping address</h3>
            
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Pincode*</label>
                  <input 
                    name="pincode" value={formData.pincode} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D] transition-all disabled:opacity-50"
                    placeholder="Enter Pincode"
                    disabled={isSubmitting}
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input 
                      name="firstName" value={formData.firstName} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D] transition-all disabled:opacity-50"
                      placeholder="First name*"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <input 
                      name="lastName" value={formData.lastName} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D] transition-all disabled:opacity-50"
                      placeholder="Last name*"
                      disabled={isSubmitting}
                    />
                  </div>
               </div>

               <div>
                  <input 
                    name="address" value={formData.address} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D] transition-all disabled:opacity-50"
                    placeholder="Flat, house number, floor, building*"
                    disabled={isSubmitting}
                  />
               </div>

               <div>
                  <input 
                    name="area" value={formData.area} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D] transition-all disabled:opacity-50"
                    placeholder="Area, street, sector, village*"
                    disabled={isSubmitting}
                  />
               </div>

               <button disabled={isSubmitting} className="text-[11px] font-black tracking-widest text-[#7A578D] uppercase flex items-center gap-1.5 ml-1 disabled:opacity-50">+ Landmark area</button>

               <div className="grid grid-cols-2 gap-4">
                  <input 
                    name="city" value={formData.city} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D] transition-all disabled:opacity-50"
                    placeholder="City*"
                    disabled={isSubmitting}
                  />
                  <input 
                    name="state" value={formData.state} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D] transition-all disabled:opacity-50"
                    placeholder="State*"
                    disabled={isSubmitting}
                  />
               </div>

               <div>
                  <input 
                    name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#7A578D] transition-all disabled:opacity-50"
                    placeholder="E-mail (optional)"
                    disabled={isSubmitting}
                  />
                  <p className="text-[10px] text-gray-400 font-bold italic mt-2 ml-1 italic">Order delivery details will be sent here</p>
               </div>

               <div className="pt-4 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">Address type</span>
                  <div className="flex gap-6 items-center flex-wrap">
                     {['Home', 'Office', 'Others'].map(type => (
                       <label key={type} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="radio" name="type" value={type} checked={formData.type === type} onChange={handleInputChange}
                            className="w-4 h-4 accent-[#7A578D]"
                          />
                          <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${formData.type === type ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>{type}</span>
                       </label>
                     ))}
                  </div>
               </div>
            </div>

            <button 
              onClick={handleCompleteOrder}
              disabled={isSubmitting}
              className="luxury-button w-full !py-5 rounded-2xl disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
               {isSubmitting ? 'Finalizing Order...' : 'Add address'}
            </button>
        </div>

        {/* Account Summary Accordion */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <button 
            onClick={() => setIsAccountOpen(!isAccountOpen)}
            className="w-full px-8 py-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-400" />
              <span className="text-[12px] font-black uppercase tracking-tight text-gray-900">Account</span>
            </div>
            {isAccountOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" /> }
          </button>

          <AnimatePresence>
            {isAccountOpen && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-gray-50"
              >
                <div className="px-8 py-8 space-y-8">
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                         <User size={18} />
                      </div>
                      <div className="flex-1">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Logged in as</p>
                         <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                            <span className="text-[12px] font-black text-gray-900">{user?.name || 'Protocol Guest'}</span>
                            <button className="text-[10px] font-black uppercase text-[#7A578D]">Edit</button>
                         </div>
                         <button onClick={() => logout()} className="text-[10px] font-black uppercase text-gray-400 mt-2 underline decoration-gray-200">Logout</button>
                      </div>
                   </div>

                   <div className="flex items-start gap-4 pt-4 border-t border-gray-50">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                         <ShieldCheck size={18} />
                      </div>
                      <div className="flex-1">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Account & Security</p>
                         <div className="space-y-4">
                            <Link to="/terms" className="flex items-center justify-between text-[11px] font-black uppercase tracking-tight text-gray-700 hover:text-[#7A578D] transition-colors">
                               <span>Terms & conditions</span>
                               <ChevronRight size={14} />
                            </Link>
                            <Link to="/privacy" className="flex items-center justify-between text-[11px] font-black uppercase tracking-tight text-gray-700 hover:text-[#7A578D] transition-colors">
                               <span>Privacy policy</span>
                               <ChevronRight size={14} />
                            </Link>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-400 pb-10">
           <Link to="/terms" className="hover:text-gray-900">T&C</Link>
           <span>|</span>
           <Link to="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
           <span>|</span>
           <span className="flex items-center gap-1.5 opacity-60">
              Powered by <span className="font-black italic text-gray-600">Zavira Logistics</span>
           </span>
        </div>
      </main>

      {/* Sticky Bottom Order Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.03)] font-sans">
         <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D]">Shipping: <span className="text-green-600">Free</span></span>
            <div>
               <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Total Amount</span>
               <span className="text-xl font-black text-gray-900">{formatCurrency(total)}</span>
            </div>
         </div>
         <button 
           onClick={handleCompleteOrder}
           disabled={isSubmitting}
           className="bg-[#7A578D] text-white px-10 py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#7A578D]/20 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
         >
            {isSubmitting ? 'Processing...' : 'Buy Now'} <ChevronRight size={18} />
         </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
