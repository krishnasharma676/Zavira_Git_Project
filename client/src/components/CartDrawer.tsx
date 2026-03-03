import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../store/useCart';
import { useCartDrawer } from '../store/useCartDrawer';
import { useNavigate } from 'react-router-dom';
import CartDrawerItem from './cart/CartDrawerItem';
import CartDrawerFooter from './cart/CartDrawerFooter';

const CartDrawer = () => {
  const { items, removeItem, updateQuantity } = useCart();
  const { isOpen, closeDrawer } = useCartDrawer();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
  const freeShippingThreshold = 1000;
  
  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
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
                  <h2 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 dark:text-white">Your Vault</h2>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{items.length} {items.length === 1 ? 'item' : 'items'} stored</p>
              </div>
              <button 
                onClick={closeDrawer}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-full text-gray-400 hover:text-black dark:hover:text-white transition-all hover:scale-110"
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto no-scrollbar px-6 py-6 space-y-4 bg-gray-50/50 dark:bg-transparent">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-60">
                   <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag size={24} className="text-gray-300" />
                   </div>
                   <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Vault is Empty</p>
                   <button onClick={closeDrawer} className="mt-6 text-[10px] font-black uppercase tracking-widest text-[#C9A0C8] hover:underline underline-offset-8 decoration-2">Find a masterpiece</button>
                </div>
              ) : (
                items.map((item) => (
                  <CartDrawerItem 
                    key={item.id}
                    item={item}
                    removeItem={removeItem}
                    updateQuantity={updateQuantity}
                  />
                ))
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
