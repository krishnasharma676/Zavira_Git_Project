import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { useCart } from '../store/useCart';
import { useCartDrawer } from '../store/useCartDrawer';
import { useUIStore } from '../store/useUIStore';
import CartDrawerItem from './cart/CartDrawerItem';
import { useCatalogStore } from '../store/useCatalogStore';
import { formatCurrency } from '../utils/format';

const CartDrawer = () => {
  const { items, removeItem, updateQuantity } = useCart();
  const { isOpen, closeDrawer } = useCartDrawer();
  const { openCheckoutModal } = useUIStore();
  const { settings } = useCatalogStore();

  const flatRate = Number(settings?.shipping_flat_rate) || 49;
  const threshold = settings?.free_shipping_threshold ? Number(settings.free_shipping_threshold) : 1000;
  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
  const shippingFee = subtotal >= threshold ? 0 : flatRate;
  const totalAmount = subtotal + shippingFee;
  
  const handleCheckout = () => {
    closeDrawer();
    openCheckoutModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-[4px]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 350 }}
            className="fixed inset-y-0 right-0 w-full lg:w-[70%] max-w-[1100px] bg-white dark:bg-[#0A0A0A] z-[210] shadow-2xl flex flex-col border-l border-gray-100 dark:border-white/5"
          >
            {/* Premium Wide Header */}
            <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5 bg-white backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-5">
                 <div className="w-12 h-12 bg-[#7A578D]/10 rounded-lg flex items-center justify-center">
                    <ShoppingBag size={22} className="text-[#7A578D]" />
                 </div>
                 <div>
                    <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 dark:text-white leading-none mb-1.5 font-sans">MY BAG</h2>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       {items.length} ITEMS
                    </p>
                 </div>
              </div>
              <button 
                onClick={closeDrawer}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-gray-500 hover:bg-black hover:text-white transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Content Area - Split Layout if Wide */}
            {items.length === 0 ? (
               <div className="flex-grow flex flex-col items-center justify-center px-6">
                  <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-[40px] flex items-center justify-center mb-8 relative">
                     <ShoppingBag size={40} className="text-gray-200" />
                     <div className="absolute inset-0 border-2 border-dashed border-gray-100 dark:border-white/10 rounded-[40px] animate-[spin_30s_linear_infinite]" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-gray-900 dark:text-white mb-3">Your cart is empty</h3>
                  <p className="text-sm text-gray-400 mb-10 text-center max-w-[280px]">There is nothing in your bag. Let's add some items.</p>
                  <button 
                    onClick={closeDrawer} 
                    className="group bg-[#7A578D] text-white px-10 py-4 rounded-sm text-[13px] font-bold uppercase tracking-widest hover:bg-[#6a4a7b] transition-all flex items-center gap-3"
                  >
                    ADD ITEMS FROM WISHLIST <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            ) : (
                <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
                    {/* Left Column: Product List */}
                    <div className="flex-grow overflow-y-auto no-scrollbar p-6 lg:p-10 lg:border-r border-gray-100 dark:border-white/5">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {/* Free Shipping Progress Indicator (Myntra vibe) */}
                            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 p-5 rounded-sm mb-10 shadow-sm overflow-hidden relative">
                                <div className="flex items-center gap-3 justify-center mb-4 relative z-10">
                                    <ShieldCheck size={18} className="text-emerald-500" />
                                    <span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest leading-none">
                                        {subtotal >= threshold ? "Yay! You unlocked free shipping!" : `Add items worth ${formatCurrency(threshold - subtotal)} more for free shipping`}
                                    </span>
                                </div>
                                
                                {/* Visual Progress Bar */}
                                <div className="w-full h-1.5 bg-gray-200/50 dark:bg-white/5 rounded-full overflow-hidden relative z-10">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((subtotal / threshold) * 100, 100)}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="h-full bg-emerald-500 rounded-full" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {items.map((item) => (
                                    <CartDrawerItem 
                                        key={item.cartItemId || item.id}
                                        item={item}
                                        removeItem={removeItem}
                                        updateQuantity={updateQuantity}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Price Details Sidebar */}
                    <div className="w-full lg:w-[400px] h-fit lg:sticky lg:top-0 bg-gray-50/50 dark:bg-white/[0.01] p-6 lg:p-10 space-y-8">
                        <div className="space-y-5 pt-0">
                            <h4 className="text-[13px] font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">PRICE DETAILS ({items.length} ITEM{(items.length > 1) ? 'S' : ''})</h4>
                            
                            <div className="space-y-3.5 text-[14px]">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Total</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Shipping Fee</span>
                                    <span className={shippingFee === 0 ? 'text-emerald-500 font-bold uppercase text-[12px]' : ''}>
                                        {shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-5 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
                                <span className="text-[16px] font-bold text-gray-900 dark:text-white uppercase tracking-widest font-sans">Final Price</span>
                                <span className="text-xl font-bold text-gray-900 dark:text-white font-sans">{formatCurrency(subtotal + shippingFee)}</span>
                            </div>

                            <button 
                              onClick={handleCheckout}
                              className="w-full bg-[#7A578D] hover:bg-[#6a4a7b] text-white py-5 rounded-sm text-[14px] font-bold uppercase tracking-widest shadow-xl shadow-purple-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-8"
                            >
                                BUY NOW <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
