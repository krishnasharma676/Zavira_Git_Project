import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: number;
  setPriceRange: (val: number) => void;
  products: any[];
  applyFilters: () => void;
  clearFilters: () => void;
}

const FilterDrawer = ({
  isOpen,
  onClose,
  priceRange,
  setPriceRange,
  products,
  applyFilters,
  clearFilters
}: FilterDrawerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white dark:bg-[#121212] z-[201] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Refine Selection</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-[#7A578D] transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10 custom-scrollbar">
              
              {/* Availability */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-2">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Availability</h3>
                  <Minus size={12} className="text-[#7A578D]" />
                </div>
                <div className="space-y-3">
                  {['In stock', 'Out of stock'].map((label) => (
                    <label key={label} className="flex items-center space-x-3 cursor-pointer group">
                      <div className="w-4 h-4 border border-gray-200 dark:border-white/10 rounded flex items-center justify-center group-hover:border-[#7A578D] transition-colors">
                        <div className="w-2 h-2 bg-[#7A578D] rounded-sm opacity-0 group-hover:opacity-20 transition-opacity" />
                      </div>
                      <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors uppercase tracking-widest">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-2">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Price</h3>
                  <Minus size={12} className="text-[#7A578D]" />
                </div>
                <div className="space-y-4">
                   <input 
                     type="range" 
                     min="0" 
                     max="20000" 
                     step="500"
                     value={priceRange}
                     onChange={(e) => setPriceRange(parseInt(e.target.value))}
                     className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7A578D]"
                   />
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price:</span>
                      <span className="text-[11px] font-black text-[#7A578D] uppercase tracking-widest ml-1">Rs. 0.00 - Rs. {priceRange.toLocaleString()}.00</span>
                   </div>
                </div>
              </div>

              {/* Color */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-2">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Color</h3>
                  <Minus size={12} className="text-[#7A578D]" />
                </div>
                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                  {['Baby Blue', 'Baby Pink', 'Beige', 'beige brown', 'Black', 'coral', 'Cream', 'creamy beige'].map((color) => (
                    <label key={color} className="flex items-center space-x-3 cursor-pointer group">
                      <div className="w-4 h-4 border border-gray-200 dark:border-white/10 rounded flex items-center justify-center group-hover:border-[#7A578D] transition-colors">
                        <div className="w-2 h-2 bg-[#7A578D] rounded-sm opacity-0 group-hover:opacity-20 transition-opacity" />
                      </div>
                      <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors uppercase tracking-widest">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured Product */}
              {products.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Featured Product</h3>
                    <Minus size={12} className="text-[#7A578D]" />
                  </div>
                  <div className="space-y-4">
                    {products.slice(0, 2).map((prod) => (
                      <Link key={prod.id} to={`/product/${prod.slug}`} className="flex gap-4 group">
                        <div className="w-16 h-16 shrink-0 bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden">
                          <img src={prod.images?.[0]?.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="text-[10px] font-black uppercase tracking-tight text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#7A578D] transition-colors">{prod.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[11px] font-black text-[#7A578D]">Rs. {(prod.discountedPrice || prod.basePrice).toLocaleString()}.00</span>
                            {prod.discountedPrice && (
                              <span className="text-[9px] text-gray-300 line-through">Rs. {prod.basePrice.toLocaleString()}.00</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-6">
                <button 
                  onClick={applyFilters}
                  className="luxury-button w-full rounded-xl"
                >
                  Apply Filters
                </button>

                <button 
                  onClick={clearFilters}
                  className="w-full text-gray-400 hover:text-gray-900 dark:hover:text-white text-[9px] font-black uppercase tracking-widest pt-2 underline underline-offset-4"
                >
                  Clear All Filters
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
