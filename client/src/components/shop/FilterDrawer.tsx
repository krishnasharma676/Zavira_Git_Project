import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/axios';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: number;
  setPriceRange: (val: number) => void;
  products: any[];
  stockStatus: string;
  setStockStatus: (val: string) => void;
  selectedColor: string;
  setSelectedColor: (val: string) => void;
  selectedSize: string;
  setSelectedSize: (val: string) => void;
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
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  selectedAttrs,
  setSelectedAttrs,
  applyFilters,
  clearFilters
}: FilterDrawerProps) => {

  const [savedColors, setSavedColors] = useState<any[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      api.get('/colors')
        .then(res => setSavedColors(res.data.data))
        .catch(err => console.error('Failed to fetch filter colors:', err));
    }
  }, [isOpen]);

  // Extract dynamic sizes from products for the size filter
  const availableSizes = new Set<string>();
  products.forEach(p => {
    if (p.sizes && typeof p.sizes === 'string') {
      p.sizes.split(',').forEach((s: string) => availableSizes.add(s.trim()));
    }
    if (p.variants) {
      p.variants.forEach((v: any) => {
        if (v.sizes) {
          v.sizes.forEach((sz: any) => availableSizes.add(sz.size));
        }
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

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10 custom-scrollbar font-sans uppercase">
              
              {/* Availability */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-2">
                  <h3 className="text-[11px] font-black tracking-widest text-gray-900 dark:text-white">Availability</h3>
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
                      <span className={`text-[10px] font-bold transition-colors tracking-widest ${
                        stockStatus === item.value ? 'text-[#7A578D]' : 'text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white'
                      }`}>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-2">
                  <h3 className="text-[11px] font-black tracking-widest text-gray-900 dark:text-white">Price Range</h3>
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
                      <span className="text-[10px] font-bold text-gray-400 tracking-widest">Max Price:</span>
                      <span className="text-[11px] font-black text-[#7A578D] tracking-widest ml-1">Rs. {priceRange.toLocaleString()}</span>
                   </div>
                </div>
              </div>

              {/* Color Swatches Filter */}
              {savedColors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-2">
                    <h3 className="text-[11px] font-black tracking-widest text-gray-900 dark:text-white">Color Palette</h3>
                    <Minus size={12} className="text-[#7A578D]" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {savedColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(selectedColor === color.id ? '' : color.id)}
                        className={`group relative flex flex-col items-center gap-1.5 transition-all p-1 rounded-xl ${
                          selectedColor === color.id ? 'bg-[#7A578D]/5' : ''
                        }`}
                        title={color.name}
                      >
                        <div 
                           className={`w-7 h-7 rounded-full border-2 shadow-sm transition-all ${
                             selectedColor === color.id ? 'border-[#7A578D] scale-110 shadow-lg shadow-purple-500/20' : 'border-white dark:border-white/10 hover:scale-105'
                           }`}
                           style={{ backgroundColor: color.hexCode }}
                        >
                          {selectedColor === color.id && (
                            <div className="w-full h-full flex items-center justify-center">
                               <Check size={12} className={color.hexCode === '#FFFFFF' ? 'text-black' : 'text-white'} />
                            </div>
                          )}
                        </div>
                        <span className={`text-[7px] font-black uppercase tracking-tighter max-w-[40px] truncate ${
                           selectedColor === color.id ? 'text-[#7A578D]' : 'text-gray-400'
                        }`}>
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Filter */}
              {availableSizes.size > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-50 dark:border-white/5 pb-2">
                    <h3 className="text-[11px] font-black tracking-widest text-gray-900 dark:text-white">Size Guide</h3>
                    <Minus size={12} className="text-[#7A578D]" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(availableSizes).sort().map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                        className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl border-2 text-[10px] font-black transition-all ${
                          selectedSize === sz
                            ? 'bg-[#7A578D] border-[#7A578D] text-white shadow-lg shadow-purple-500/20 scale-105'
                            : 'border-gray-50 dark:border-white/5 text-gray-600 hover:border-[#7A578D]/30'
                        }`}
                      >
                        {sz}
                      </button>
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
                  className="w-full text-gray-400 hover:text-gray-900 dark:hover:text-white text-[9px] font-black tracking-widest pt-2 underline underline-offset-4"
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
