import { Filter, X } from 'lucide-react';

interface ShopHeaderProps {
  category: string;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
  setIsFilterOpen: (isOpen: boolean) => void;
  sortBy: string;
  sortOrder: string;
  updateSort: (option: any) => void;
  sortOptions: any[];
}

const ShopHeader = ({ 
  category, 
  searchParams, 
  setSearchParams, 
  setIsFilterOpen, 
  sortBy, 
  sortOrder, 
  updateSort, 
  sortOptions 
}: ShopHeaderProps) => {
  return (
    <div className="flex justify-between items-center py-2 mb-4 border-b border-gray-100 dark:border-white/5">
      {/* Category Pills on the left side to keep it balanced */}
      <div className="flex items-center gap-2">
        {category && (
          <div className="flex items-center bg-[#FF3E6C]/5 px-3 py-1.5 rounded-full border border-[#FF3E6C]/20 gap-2 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-[#FF3E6C] tracking-wider">{category}</span>
            <button onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.delete('category');
              setSearchParams(next);
            }} className="text-[#FF3E6C] hover:scale-110 transition-transform">
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pr-1">
        {/* SMALL Circular Filter Button */}
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="w-9 h-9 flex items-center justify-center bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-full shadow-sm hover:border-[#FF3E6C] hover:text-[#FF3E6C] transition-all active:scale-90 group"
          title="Filters"
        >
          <Filter size={16} className="group-hover:scale-110 transition-transform text-gray-700 dark:text-gray-300 group-hover:text-[#FF3E6C]" />
        </button>

        {/* SMALL Circular Sort Button */}
        <div className="relative group/sort">
          <button className="w-9 h-9 flex items-center justify-center bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-full shadow-sm hover:border-[#FF3E6C] hover:text-[#FF3E6C] transition-all active:scale-90 group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform text-gray-700 dark:text-gray-300 group-hover:text-[#FF3E6C]">
              <path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4"/>
            </svg>
          </button>

          <div className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/10 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all z-[100] translate-y-2 group-hover/sort:translate-y-0 origin-top-right">
            <div className="px-5 py-2 mb-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sort By</span>
            </div>
            {sortOptions.map(opt => (
              <button 
                key={opt.label} 
                onClick={() => updateSort(opt)}
                className={`w-full text-left px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-[11px] font-bold ${sortBy === opt.val && sortOrder === opt.order ? 'text-[#FF3E6C] bg-[#FF3E6C]/5' : 'text-gray-700 dark:text-gray-300'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
