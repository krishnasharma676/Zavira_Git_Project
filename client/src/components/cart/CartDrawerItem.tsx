import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShieldCheck } from 'lucide-react';
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-white dark:bg-[#1A1A1A] p-2.5 rounded-xl border border-gray-100 dark:border-white/5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.1)] transition-all duration-500 flex items-center space-x-3 gap-1"
    >
      {/* Product Image */}
      <div className="relative w-14 h-14 bg-gray-50 dark:bg-black rounded-lg overflow-hidden shrink-0 border border-gray-50 dark:border-white/5">
        <img 
          src={item.image} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          alt={item.name} 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0 flex flex-col justify-between py-0.5">
         <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
               <h3 className="text-[9px] font-black uppercase tracking-tight text-gray-900 dark:text-white line-clamp-1 leading-tight mb-0.5 decoration-[#7A578D]/20 group-hover:underline underline-offset-2">
                  {item.name}
               </h3>
               <div className="flex items-center space-x-1.5">
                   <span className="text-[7px] font-black text-gray-400 dark:text-gray-500 bg-gray-100/50 dark:bg-white/5 px-1 py-0.5 rounded uppercase tracking-[0.15em]">
                     SKU: {item.id.slice(0,6)}
                   </span>
                   {item.selectedSize && (
                     <span className="text-[7px] font-black text-[#7A578D] bg-[#7A578D]/5 px-1.5 py-0.5 rounded uppercase">Size: {item.selectedSize}</span>
                   )}
                </div>
                {item.variantId && (
                   <div className="mt-1 flex items-center gap-1.5 opacity-80">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7A578D]" />
                      <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Color Variant Selected</span>
                   </div>
                )}
             </div>
             <button 
               onClick={() => removeItem(item.cartItemId || item.id)} 
               className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all duration-300"
             >
               <Trash2 size={11}/>
             </button>
          </div>
          
          <div className="flex items-center justify-between mt-1.5">
             {/* Quantity Selector */}
             <div className="flex items-center bg-gray-50 dark:bg-white/5 p-0.5 rounded-lg border border-gray-100/80 dark:border-white/5">
               <button 
                 onClick={() => updateQuantity(item.cartItemId || item.id, Math.max(1, item.quantity - 1))}
                 className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-[#7A578D] hover:bg-white dark:hover:bg-black rounded-md transition-all shadow-sm active:scale-90"
               >
                 <Minus size={8} />
               </button>
               <span className="w-6 text-center text-[9px] font-black text-gray-900 dark:text-white font-sans">{item.quantity}</span>
               <button 
                 onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity + 1)}
                 className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-[#7A578D] hover:bg-white dark:hover:bg-black rounded-md transition-all shadow-sm active:scale-90"
               >
                 <Plus size={8} />
               </button>
             </div>

            {/* Price */}
            <div className="text-right">
               <p className="text-[10px] font-black text-[#7A578D] bg-[#7A578D]/5 px-2 py-0.5 rounded-full">
                {formatCurrency((item.price || 0) * (item.quantity || 0))}
               </p>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default CartDrawerItem;
