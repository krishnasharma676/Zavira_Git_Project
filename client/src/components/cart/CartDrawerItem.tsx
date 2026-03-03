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
      className="group bg-white dark:bg-[#121212] p-4 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex space-x-4"
    >
      <div className="w-20 h-24 bg-gray-50 dark:bg-black rounded-2xl overflow-hidden shrink-0">
        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
      </div>

      <div className="flex-grow min-w-0">
         <div className="flex justify-between items-start mb-2">
            <h3 className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-white line-clamp-2 leading-tight pr-4">{item.name}</h3>
            <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
         </div>
         
         <div className="flex items-center space-x-2 mb-4">
            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-sm uppercase tracking-widest">Serial: {item.id.slice(0,6)}</span>
         </div>

         <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-xl">
              <button 
                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <Minus size={10} />
              </button>
              <span className="w-8 text-center text-[11px] font-bold text-gray-900 dark:text-white">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <Plus size={10} />
              </button>
            </div>
            <div className="text-right">
               {item.discountedPrice && <p className="text-[10px] text-gray-300 dark:text-gray-600 line-through">{formatCurrency(item.price * 1.5)}</p>}
               <p className="text-sm font-black text-[#C9A0C8]">{formatCurrency((item.price || 0) * (item.quantity || 0))}</p>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default CartDrawerItem;
