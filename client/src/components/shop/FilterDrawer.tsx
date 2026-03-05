import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: number;
  setPriceRange: (val: number) => void;
  products: any[];
  stockStatus: string;
  setStockStatus: (val: string) => void;
  selectedAttrs: any;
  setSelectedAttrs: (val: any) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

const FilterDrawer = ({
  isOpen,
  onClose,
  priceRange,
  setPriceRange,
  products,
  stockStatus,
  setStockStatus,
  selectedAttrs,
  setSelectedAttrs,
  applyFilters,
  clearFilters
}: FilterDrawerProps) => {

  // Extract dynamic attribute groups from current products
  const attributeGroups: any = {};
  products.forEach(product => {
    if (product.attributes) {
      Object.entries(product.attributes).forEach(([key, value]: [string, any]) => {
        if (!attributeGroups[key]) attributeGroups[key] = new Set();
        attributeGroups[key].add(value);
      });
    }
  });

  const handleAttrToggle = (key: string, value: string) => {
    const updated = { ...selectedAttrs };
    if (updated[key] === value) {
      delete updated[key];
    } else {
      updated[key] = value;
    }
    setSelectedAttrs(updated);
  };

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
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-white/5 font-sans">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Refine Selection</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-[#7A578D] transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10 custom-scrollbar font-sans">
              
              {/* Availability */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-2">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Availability</h3>
                  <Minus size={12} className="text-[#7A578D]" />
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'In Stock', value: 'inStock' },
                    { label: 'Out of Stock', value: 'outOfStock' }
                  ].map((item) => (
                    <label 
                      key={item.value} 
                      className="flex items-center space-x-3 cursor-pointer group"
                      onClick={() => setStockStatus(stockStatus === item.value ? '' : item.value)}
                    >
                      <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${
                        stockStatus === item.value 
                        ? 'bg-[#7A578D] border-[#7A578D]' 
                        : 'border-gray-200 dark:border-white/10 group-hover:border-[#7A578D]'
                      }`}>
                        {stockStatus === item.value && <Check size={10} className="text-white" />}
                      </div>
                      <span className={`text-[10px] font-bold transition-colors uppercase tracking-widest ${
                        stockStatus === item.value ? 'text-[#7A578D]' : 'text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white'
                      }`}>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-2">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Price Range</h3>
                  <Minus size={12} className="text-[#7A578D]" />
                </div>
                <div className="space-y-4">
                   <input 
                     type="range" 
                     min="0" 
                     max="50000" 
                     step="1000"
                     value={priceRange}
                     onChange={(e) => setPriceRange(parseInt(e.target.value))}
                     className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7A578D]"
                   />
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Max Price:</span>
                      <span className="text-[11px] font-black text-[#7A578D] uppercase tracking-widest ml-1">Rs. {priceRange.toLocaleString()}</span>
                   </div>
                </div>
              </div>

              {/* Dynamic Groups (Color, Material, etc.) */}
              {Object.entries(attributeGroups).map(([groupKey, values]: [string, any]) => (
                <div key={groupKey} className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-2 text-[#7A578D]">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{groupKey}</h3>
                    <Minus size={12} />
                  </div>
                  <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {Array.from(values).sort().map((val: any) => (
                      <label 
                        key={val} 
                        className="flex items-center space-x-3 cursor-pointer group"
                        onClick={() => handleAttrToggle(groupKey, val)}
                      >
                        <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${
                          selectedAttrs[groupKey] === val 
                          ? 'bg-[#7A578D] border-[#7A578D]' 
                          : 'border-gray-200 dark:border-white/10 group-hover:border-[#7A578D]'
                        }`}>
                          {selectedAttrs[groupKey] === val && <Check size={10} className="text-white" />}
                        </div>
                        <span className={`text-[10px] font-bold transition-colors uppercase tracking-widest ${
                          selectedAttrs[groupKey] === val ? 'text-[#7A578D]' : 'text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white'
                        }`}>{val}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {/* Featured Highlights (Simplified) */}
              {products.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
                   <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 italic">Trending Picks</h3>
                   <div className="grid grid-cols-2 gap-3">
                      {products.filter(p => !p.inventory || p.inventory.stock > 0).slice(0, 2).map(prod => (
                         <Link key={prod.id} to={`/product/${prod.slug}`} className="block group">
                            <div className="aspect-square bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden mb-2">
                               <img src={prod.images?.[0]?.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                            </div>
                            <p className="text-[8px] font-black uppercase tracking-tighter truncate text-gray-800 dark:text-white">{prod.name}</p>
                         </Link>
                      ))}
                   </div>
                </div>
              )}

              <div className="space-y-3 pt-6 sticky bottom-0 bg-white dark:bg-[#121212] pb-4">
                <button 
                  onClick={applyFilters}
                  className="luxury-button w-full rounded-xl py-4 shadow-xl shadow-purple-500/10"
                >
                  View Selection
                </button>

                <button 
                  onClick={clearFilters}
                  className="w-full text-gray-400 hover:text-gray-900 dark:hover:text-white text-[9px] font-black uppercase tracking-widest pt-2 underline underline-offset-4"
                >
                  Reset All
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
