import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../api/axios';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: number;
  setPriceRange: (val: number) => void;
  products: any[];
  categories: any[];
  stockStatus: string;
  setStockStatus: (val: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (val: string[]) => void;
  selectedColors: string[];
  setSelectedColors: (val: string[]) => void;
  selectedSize: string;
  setSelectedSize: (val: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

const FilterDrawer = ({
  isOpen,
  onClose,
  priceRange,
  setPriceRange,
  products,
  categories,
  stockStatus,
  setStockStatus,
  selectedCategories,
  setSelectedCategories,
  selectedColors,
  setSelectedColors,
  selectedSize,
  setSelectedSize,
  applyFilters,
  clearFilters
}: FilterDrawerProps) => {

  const [dbColors, setDbColors] = useState<any[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>('category');
  
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const { data } = await api.get('/colors');
        if (data && data.data) {
          setDbColors(data.data);
        }
      } catch (err) {
        console.error('Color fetch failed');
      }
    };
    
    if (isOpen) {
      fetchColors();
    }
  }, [isOpen]);

  // Use a map to track unique color names and their metadata from the DB/Products
  const availableColorsMap = new Map<string, { hexCode: string; originalName: string }>();
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
        
        const rawName = v.color?.name || v.color;
        if (rawName && typeof rawName === 'string') {
          const nameTrimmed = rawName.trim();
          const nameKey = nameTrimmed.toUpperCase().replace(/\s+/g, ''); // Compact key for strict deduplication
          
          if (!availableColorsMap.has(nameKey)) {
            // Find hex from DB if possible
            const dbMatch = dbColors.find(dbc => dbc.name.trim().toUpperCase().replace(/\s+/g, '') === nameKey);
            const hex = dbMatch?.hexCode || v.colorCode || '#CCCCCC';
            availableColorsMap.set(nameKey, { hexCode: hex, originalName: nameTrimmed });
          }
        }
      });
    }
  });

  const filterColors = Array.from(availableColorsMap.values())
    .map(c => ({ id: c.originalName, name: c.originalName, hexCode: c.hexCode }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const toggleColor = (colorId: string) => {
    if (selectedColors.includes(colorId)) {
      setSelectedColors(selectedColors.filter(id => id !== colorId));
    } else {
      setSelectedColors([...selectedColors, colorId]);
    }
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
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-white dark:bg-[#121212] z-[201] shadow-2xl flex flex-col font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white">Filters</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-zavira-purple transition-all">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar uppercase">
              
              {/* Category */}
              <div className="border-b border-gray-50 dark:border-white/5">
                <button onClick={() => toggleSection('category')} className="w-full py-4 flex justify-between items-center">
                  <h3 className="text-[10px] font-black tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                    Category {selectedCategories.length > 0 && <span className="w-4 h-4 rounded-full bg-zavira-purple text-white text-[8px] flex items-center justify-center">{selectedCategories.length}</span>}
                  </h3>
                  {expandedSection === 'category' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <AnimatePresence>
                  {expandedSection === 'category' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-4 space-y-3 px-1">
                      {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center space-x-3 cursor-pointer group" onClick={() => toggleCategory(cat.id)}>
                          <div className={`w-3.5 h-3.5 border rounded-none flex items-center justify-center transition-all ${selectedCategories.includes(cat.id) ? 'bg-zavira-purple border-zavira-purple' : 'border-gray-200 dark:border-white/10'}`}>
                            {selectedCategories.includes(cat.id) && <Check size={10} className="text-white" />}
                          </div>
                          <span className={`text-[10px] font-bold tracking-widest ${selectedCategories.includes(cat.id) ? 'text-zavira-purple' : 'text-gray-500'}`}>{cat.name}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Colors */}
              <div className="border-b border-gray-50 dark:border-white/5">
                <button onClick={() => toggleSection('color')} className="w-full py-4 flex justify-between items-center group">
                  <h3 className="text-[10px] font-black tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                    Colors {selectedColors.length > 0 && <span className="w-4 h-4 rounded-full bg-zavira-purple text-white text-[8px] flex items-center justify-center">{selectedColors.length}</span>}
                  </h3>
                  {expandedSection === 'color' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <AnimatePresence>
                  {expandedSection === 'color' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-6 grid grid-cols-4 gap-4 px-2">
                      {filterColors.length > 0 ? filterColors.map((color) => (
                        <button key={color.id} onClick={() => toggleColor(color.id)} className="flex flex-col items-center gap-1.5 transition-all p-1.5 rounded-sm" title={color.name}>
                          <div className={`w-6 h-6 rounded-full border-2 transition-all relative ${selectedColors.includes(color.id) ? 'border-zavira-purple scale-110 shadow-lg' : 'border-white dark:border-white/10'}`} style={{ backgroundColor: color.hexCode }}>
                            {selectedColors.includes(color.id) && <div className="absolute inset-0 flex items-center justify-center"><Check size={10} className={color.hexCode?.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'} /></div>}
                          </div>
                          <span className={`text-[7px] font-black uppercase tracking-tighter truncate max-w-full ${selectedColors.includes(color.id) ? 'text-zavira-purple' : 'text-gray-400'}`}>{color.name}</span>
                        </button>
                      )) : <div className="col-span-4 text-[8px] text-gray-400 italic py-2">No colors</div>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Price */}
              <div className="pt-4 border-b border-gray-50 dark:border-white/5 pb-8 overflow-hidden px-1">
                <h3 className="text-[10px] font-black tracking-widest text-gray-900 dark:text-white mb-6 uppercase">Price</h3>
                <div className="space-y-6">
                  <input type="range" min="0" max="100000" step="1000" value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} className="w-full h-1 bg-gray-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-zavira-purple" />
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-3">
                     <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Max Price</span>
                     <span className="text-[10px] font-black text-zavira-purple tracking-widest">Rs. {priceRange.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Sizes */}
              {availableSizes.size > 0 && (
                <div className="border-b border-gray-50 dark:border-white/5">
                  <button onClick={() => toggleSection('size')} className="w-full py-4 flex justify-between items-center">
                    <h3 className="text-[10px] font-black tracking-widest text-gray-900 dark:text-white">Sizes</h3>
                    {expandedSection === 'size' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <AnimatePresence>
                    {expandedSection === 'size' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-6 flex flex-wrap gap-2 px-2">
                        {Array.from(availableSizes).sort().map((sz) => (
                          <button key={sz} onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)} className={`min-w-[40px] h-9 flex items-center justify-center border-2 text-[9px] font-black transition-all ${selectedSize === sz ? 'bg-zavira-purple border-zavira-purple text-white' : 'border-gray-50 dark:border-white/5 text-gray-500'}`}>{sz}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 pb-4">
                <button onClick={applyFilters} className="w-full bg-zavira-purple text-white py-4 shadow-xl shadow-purple-500/10 text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95">Apply</button>
                <button onClick={clearFilters} className="w-full text-gray-400 hover:text-gray-900 dark:hover:text-white text-[8px] font-black tracking-[0.3em] pt-1 uppercase">Clear All</button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
