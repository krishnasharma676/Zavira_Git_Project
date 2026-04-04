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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[90%] max-w-[340px] bg-white dark:bg-[#0A0A0A] z-[201] shadow-2xl flex flex-col font-sans border-r border-[#7A578D]/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
              <div className="flex items-center gap-3">
                <h2 className="text-[12px] font-black uppercase tracking-[0.25em] text-gray-900 dark:text-white">
                  Filters
                </h2>
                {(selectedCategories.length > 0 || selectedColors.length > 0 || selectedSize || priceRange < 100000) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7A578D] animate-pulse" />
                )}
              </div>
              <button onClick={onClose} className="p-1.5 bg-white dark:bg-[#1A1A1A] rounded-full text-gray-400 hover:text-black dark:hover:text-white hover:shadow-md transition-all">
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 custom-scrollbar">
              
              {/* CATEGORIES */}
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Collections</h3>
                  {selectedCategories.length > 0 && (
                    <span className="text-[8px] font-bold text-[#7A578D]">{selectedCategories.length} picked</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <label key={cat.id} className="flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer group transition-all hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/10" onClick={() => toggleCategory(cat.id)}>
                        <span className={`text-[10px] font-bold tracking-widest transition-colors ${isSelected ? 'text-[#7A578D] dark:text-[#9D7DAB]' : 'text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white'}`}>
                          {cat.name}
                        </span>
                        <div className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#7A578D] border-[#7A578D]' : 'border-gray-200 dark:border-gray-700 group-hover:border-[#7A578D]/50'}`}>
                          {isSelected && <Check size={10} className="text-white" />}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* PRICE SLIDER */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Price Limit</h3>
                  <span className="text-[9px] font-bold text-[#7A578D] bg-[#7A578D]/10 px-2 py-0.5 rounded-md">
                    Up to Rs. {priceRange.toLocaleString()}
                  </span>
                </div>
                <div className="px-1">
                  <input 
                    type="range" 
                    min="1000" 
                    max="100000" 
                    step="500" 
                    value={priceRange} 
                    onChange={(e) => setPriceRange(parseInt(e.target.value))} 
                    className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full appearance-none cursor-pointer accent-[#7A578D] hover:accent-[#5C3D6D] transition-all" 
                  />
                </div>
              </div>

              {/* COLORS */}
              {filterColors.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Colors</h3>
                    {selectedColors.length > 0 && (
                      <button onClick={() => setSelectedColors([])} className="text-[8px] font-bold text-[#7A578D] hover:underline">Clear</button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {filterColors.map((color) => {
                      const isSelected = selectedColors.includes(color.id);
                      return (
                        <button 
                          key={color.id} 
                          onClick={() => toggleColor(color.id)} 
                          className={`flex flex-col items-center gap-1.5 p-1.5 rounded-md border transition-all ${isSelected ? 'bg-gray-50 border-[#7A578D]/30 dark:bg-white/5 dark:border-[#7A578D]/50 shadow-sm' : 'border-transparent hover:bg-gray-50 dark:hover:bg-white/5'}`}
                          title={color.name}
                        >
                          <div 
                            className={`w-5 h-5 rounded-full border transition-all relative shadow-inner ${isSelected ? 'border-[#7A578D] scale-110' : 'border-white dark:border-[#222]'}`} 
                            style={{ backgroundColor: color.hexCode }}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Check size={10} className={color.hexCode?.toLowerCase() === '#ffffff' ? 'text-black drop-shadow-md' : 'text-white drop-shadow-md'} />
                              </div>
                            )}
                          </div>
                          <span className={`text-[7px] font-black text-center uppercase tracking-tighter w-full truncate ${isSelected ? 'text-[#7A578D] dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {color.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SIZES */}
              {availableSizes.size > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Sizes</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(availableSizes).sort().map((sz) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button 
                          key={sz} 
                          onClick={() => setSelectedSize(isSelected ? '' : sz)} 
                          className={`px-3 py-1.5 flex items-center justify-center rounded border text-[9px] font-black tracking-widest transition-all ${
                            isSelected 
                              ? 'bg-[#7A578D] border-[#7A578D] text-white shadow-sm' 
                              : 'bg-white dark:bg-[#121212] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#7A578D]/40'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* ACTION FOOTER */}
            <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0A0A0A] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex gap-2">
              <button 
                onClick={clearFilters} 
                className="flex-1 py-3 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 rounded text-[9px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={applyFilters} 
                className="flex-[2] bg-[#7A578D] text-white py-3 rounded shadow-md shadow-[#7A578D]/20 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-[0.98]"
              >
                Show Results
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
