import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { useCart } from '../store/useCart';
import { useCartDrawer } from '../store/useCartDrawer';
import { useUIStore } from '../store/useUIStore';
import CartDrawerItem from './cart/CartDrawerItem';
import CartDrawerFooter from './cart/CartDrawerFooter';

const CartDrawer = () => {
  const { items, removeItem, updateQuantity } = useCart();
  const { isOpen, closeDrawer } = useCartDrawer();
  const { openCheckoutModal } = useUIStore();

  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
  
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
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-[4px]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 350 }}
            className="fixed inset-y-0 right-0 w-full max-w-[420px] bg-white dark:bg-[#0A0A0A] z-[110] shadow-[-20px_0_50px_rgba(0,0,0,0.2)] flex flex-col border-l border-gray-100 dark:border-white/5"
          >
            {/* Premium Header */}
            <div className="px-6 py-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-[#7A578D]/10 rounded-xl flex items-center justify-center relative">
                    <ShoppingBag size={18} className="text-[#7A578D]" />
                    {items.length > 0 && (
                       <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#7A578D] text-white text-[8px] font-black rounded-full flex items-center justify-center">
                          {items.length}
                       </span>
                    )}
                 </div>
                 <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white leading-none mb-1">Your Selection</h2>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                       <Star size={8} className="text-amber-400" /> Premium Curated Collection
                    </p>
                 </div>
              </div>
              <button 
                onClick={closeDrawer}
                className="group w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-full text-gray-400 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-500"
              >
                <X size={14} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            {/* List Content */}
            <div className="flex-grow overflow-y-auto no-scrollbar px-4 py-4 space-y-6 scroll-smooth">
              {items.length === 0 ? (
                <div className="h-[60%] flex flex-col items-center justify-center">
                   <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 relative">
                      <ShoppingBag size={32} className="text-gray-200" />
                      <div className="absolute inset-0 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl animate-[spin_20s_linear_infinite]" />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Cart is currently empty</p>
                   <button 
                    onClick={closeDrawer} 
                    className="mt-8 group flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#7A578D] border-b-2 border-transparent hover:border-[#7A578D] pb-1 transition-all"
                   >
                     Browse Collection <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              ) : (
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
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <CartDrawerFooter 
                subtotal={subtotal}
                freeShippingThreshold={1000} // Keep as default prop if needed by child
                handleCheckout={handleCheckout}
                itemsCount={items.length}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
