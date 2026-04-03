import { motion } from 'framer-motion';
import { Trash2, Link as LinkIcon, ChevronDown, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/format';

interface CartDrawerItemProps {
  item: any;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

const CartDrawerItem = ({ item, removeItem, updateQuantity }: CartDrawerItemProps) => {
  // Use a fallback for brand/sold by since we might not have it in the cart object yet
  const soldBy = "ZAVIRAA INDUSTRIES";
  const brand = "ZAVIRAA";
  const returnDays = "14 days";

  // Calculate discount if possible (this assumes price in cart is already discounted)
  // If we don't have basePrice in the item object, we'll just show the single price.
  const basePrice = item.basePrice || item.price;
  const discount = basePrice > item.price ? Math.round(((basePrice - item.price) / basePrice) * 100) : 0;

  return (
    <div className="relative bg-white dark:bg-[#1A1A1A] p-4 rounded-sm border border-gray-100 dark:border-white/5 flex gap-5 mb-4 group transition-shadow hover:shadow-md">
      {/* Checkbox (Myntra Style) */}
      <div className="absolute top-4 left-4 z-10 w-4 h-4 bg-[#7A578D] rounded-sm flex items-center justify-center cursor-pointer">
        <div className="w-1.5 h-1.5 bg-white rounded-full" />
      </div>

      {/* Product Image */}
      <Link to={`/product/${item.slug}`} className="w-[110px] h-[145px] bg-gray-50 dark:bg-black rounded-sm overflow-hidden shrink-0 border border-gray-100 dark:border-white/5">
        <img 
          src={item.image} 
          className="w-full h-full object-cover transition-transform duration-700" 
          alt={item.name} 
        />
      </Link>
 
      {/* Content Area */}
      <div className="flex-grow flex flex-col justify-between py-0.5">
         <div className="flex justify-between items-start">
            <div className="space-y-0.5">
               <h4 className="text-[14px] font-bold text-gray-900 dark:text-white leading-tight uppercase tracking-tight">{brand}</h4>
               <p className="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-1">{item.name}</p>
               <p className="text-[11px] text-gray-400">Sold by: <span className="uppercase">{soldBy}</span></p>

               {/* Size and Qty Selectors */}
               <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-sm border border-gray-100 dark:border-white/10 text-[12px] font-bold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
                    Size: {item.selectedSize || 'N/A'} <ChevronDown size={12} />
                  </div>
                  {item.colorCode && (
                     <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-1.5 py-1 rounded-sm border border-gray-100 dark:border-white/10 shadow-sm">
                        <div 
                           style={{ backgroundColor: item.colorCode }} 
                           className="w-3.5 h-3.5 rounded-full border border-gray-200" 
                        />
                     </div>
                  )}
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-sm border border-gray-100 dark:border-white/10 text-[12px] font-bold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
                    Qty: {item.quantity} <ChevronDown size={12} />
                  </div>
               </div>

               {/* Price Block */}
               <div className="flex items-center gap-2 mt-4">
                  <span className="text-[14px] font-bold text-gray-900 dark:text-white">{formatCurrency(item.price)}</span>
                  {basePrice > item.price && (
                    <>
                      <span className="text-[12px] text-gray-400 line-through">{formatCurrency(basePrice)}</span>
                      <span className="text-[12px] font-bold text-[#FF3F6C]">{discount}% OFF</span>
                    </>
                  )}
               </div>

               {/* Return Policy Line */}
               <div className="flex items-center gap-1.5 mt-2.5 text-[#03A685] dark:text-[#2ECAAB] font-bold text-[11px]">
                  <RotateCcw size={12} strokeWidth={3} />
                  <span className="uppercase tracking-wide">{returnDays} return available</span>
               </div>
            </div>

            {/* Remove X */}
            <button 
              onClick={() => removeItem(item.cartItemId || item.id)} 
              className="text-gray-400 hover:text-[#7A578D] p-1 transition-colors"
            >
              <Trash2 size={18} strokeWidth={1.5} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default CartDrawerItem;
