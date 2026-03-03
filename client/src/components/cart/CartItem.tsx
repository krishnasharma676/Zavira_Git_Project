import { motion } from 'framer-motion';
import { Trash2, Minus, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface CartItemProps {
  item: any;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

const CartItem = ({ item, removeItem, updateQuantity }: CartItemProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-start gap-8 group pb-10 border-b border-gray-50 dark:border-white/5"
    >
      <div className="w-full sm:w-48 aspect-[3/4] bg-gray-50 dark:bg-black overflow-hidden rounded-[2rem] shadow-sm group-hover:shadow-xl transition-all duration-700">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
      </div>
      
      <div className="flex-grow pt-2">
         <div className="flex justify-between items-start mb-4">
            <div>
               <h3 className="text-lg font-sans font-black uppercase tracking-tight mb-2 group-hover:text-[#C9A0C8] transition-colors">{item.name}</h3>
               <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ref: {item.id.slice(0, 8)}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#C9A0C8] px-2 py-0.5 bg-red-50 dark:bg-red-500/10 rounded">In Stock</span>
               </div>
            </div>
            <button 
              onClick={() => removeItem(item.id)}
              className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            >
              <Trash2 size={18} />
            </button>
         </div>

         <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center bg-gray-50 dark:bg-white/5 p-1 rounded-2xl border border-gray-100 dark:border-white/5">
              <button 
                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-colors hover:bg-white dark:hover:bg-white/10 rounded-xl"
              >
                <Minus size={14} />
              </button>
              <span className="w-12 text-center text-sm font-black text-gray-900 dark:text-white">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-colors hover:bg-white dark:hover:bg-white/10 rounded-xl"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <div className="text-right">
               <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-black mb-1 italic">Total Value</p>
               <p className="text-2xl font-sans italic text-[#C9A0C8]">
                 {formatCurrency((item.price || 0) * (item.quantity || 0))}
               </p>
            </div>
         </div>
      </div>
    </motion.div>
  );
};


export default CartItem;
