import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, PlusCircle } from 'lucide-react';
import { useCart } from '../store/useCart';
import { useCartDrawer } from '../store/useCartDrawer';
import { useUIStore } from '../store/useUIStore';
import CartDrawerItem from './cart/CartDrawerItem';
import CartDrawerFooter from './cart/CartDrawerFooter';
import api from '../api/axios';
import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/format';

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, addItem } = useCart();
  const { isOpen, closeDrawer } = useCartDrawer();
  const { openCheckoutModal } = useUIStore();
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
  const freeShippingThreshold = 1000;

  useEffect(() => {
    if (isOpen) {
      api.get('/products', { params: { limit: 6 } })
        .then(res => setSuggestions(res.data.data.products))
        .catch(err => console.error('Failed to fetch cart suggestions:', err));
    }
  }, [isOpen]);
  
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
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-[480px] bg-white dark:bg-[#0A0A0A] z-[110] shadow-[0_0_100px_rgba(0,0,0,0.1)] flex flex-col border-l border-gray-100 dark:border-white/5"
          >
            {/* Header */}
            <div className="px-8 py-8 flex justify-between items-center border-b border-gray-50 dark:border-white/5">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <ShoppingBag size={18} className="text-[#C9A0C8]" />
                  <h2 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 dark:text-white">Shopping Cart</h2>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{items.length} {items.length === 1 ? 'item' : 'items'} in cart</p>
              </div>
              <button 
                onClick={closeDrawer}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-full text-gray-400 hover:text-black dark:hover:text-white transition-all hover:scale-110"
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto no-scrollbar px-5 py-4 space-y-6 bg-gray-50/50 dark:bg-transparent font-sans">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-60">
                   <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag size={24} className="text-gray-300" />
                   </div>
                   <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Cart is Empty</p>
                   <button onClick={closeDrawer} className="mt-6 text-[10px] font-black uppercase tracking-widest text-[#C9A0C8] hover:underline underline-offset-8 decoration-2">Continue Shopping</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartDrawerItem 
                      key={item.id}
                      item={item}
                      removeItem={removeItem}
                      updateQuantity={updateQuantity}
                    />
                  ))}
                </div>
              )}

              {/* You May Also Like Section */}
              {suggestions.length > 0 && (
                <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="h-[1px] flex-1 bg-gray-100 dark:bg-white/5"></div>
                      <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Recommended for you</h3>
                      <div className="h-[1px] flex-1 bg-gray-100 dark:bg-white/5"></div>
                   </div>

                   <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2 snap-x">
                      {suggestions.map((prod) => (
                        <div key={prod.id} className="min-w-[150px] snap-start bg-white dark:bg-white/5 p-2 rounded-2xl border border-gray-50 dark:border-white/5 flex flex-col">
                           <div className="flex gap-2 mb-3">
                             <div className="w-10 h-10 bg-gray-50 dark:bg-black rounded-lg overflow-hidden shrink-0">
                                <img src={prod.images?.[0]?.imageUrl} className="w-full h-full object-cover" alt="" />
                             </div>
                             <div className="min-w-0">
                                <h4 className="text-[8px] font-black uppercase tracking-tight text-gray-900 dark:text-white line-clamp-1 mb-0.5">{prod.name}</h4>
                                <p className="text-[9px] font-bold text-[#7A578D]">{formatCurrency(prod.discountedPrice || prod.basePrice)}</p>
                             </div>
                           </div>
                           <button 
                             onClick={() => {
                               addItem({
                                 id: prod.id,
                                 name: prod.name,
                                 price: prod.discountedPrice || prod.basePrice,
                                 image: prod.images?.[0]?.imageUrl,
                                 quantity: 1,
                                 stock: prod.inventory?.[0]?.quantity || 1
                               });
                             }}
                             className="w-full bg-[#7A578D] hover:bg-black text-white py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
                           >
                             <PlusCircle size={10} /> ADD
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <CartDrawerFooter 
              subtotal={subtotal}
              freeShippingThreshold={freeShippingThreshold}
              handleCheckout={handleCheckout}
              itemsCount={items.length}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
