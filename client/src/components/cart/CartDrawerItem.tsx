import { motion } from 'framer-motion';
import { Trash2, Minus, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface CartDrawerItemProps {
  item: any;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

const CartDrawerItem = ({ item, removeItem, updateQuantity }: CartDrawerItemProps) => {
  return (
    <motion.div 
      layout
      key={item.id}
      className="group bg-white dark:bg-[#121212] p-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex space-x-3"
    >
      <div className="w-16 h-20 bg-gray-50 dark:bg-black rounded-xl overflow-hidden shrink-0">
        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
      </div>

      <div className="flex-grow min-w-0 flex flex-col">
         <div className="flex justify-between items-start mb-1">
            <h3 className="text-[10px] font-black uppercase tracking-tight text-gray-900 dark:text-white line-clamp-1 leading-tight pr-4">{item.name}</h3>
            <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={12}/></button>
         </div>
         
         <div className="flex items-center space-x-2 mb-2">
            <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded-sm uppercase tracking-widest">SKU: {item.id.slice(0,6)}</span>
         </div>
 
         <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center bg-gray-50 dark:bg-white/5 px-1.5 py-0.5 rounded-lg border border-gray-100 dark:border-white/5">
              <button 
                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <Minus size={8} />
              </button>
              <span className="w-6 text-center text-[10px] font-black text-gray-900 dark:text-white">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <Plus size={8} />
              </button>
            </div>
            <div className="text-right">
               <p className="text-[11px] font-black text-[#7A578D]">{formatCurrency((item.price || 0) * (item.quantity || 0))}</p>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default CartDrawerItem;
