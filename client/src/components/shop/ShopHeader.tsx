import { Filter, X, ChevronDown } from 'lucide-react';

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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 border-b border-gray-100 dark:border-white/5 mb-10 gap-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center space-x-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 px-6 py-3 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm active:scale-95"
        >
          <Filter size={14} />
          <span>Filters</span>
        </button>

        {category && (
          <div className="flex items-center bg-[#7A578D]/10 dark:bg-white/5 px-4 py-2.5 rounded-full border border-[#7A578D]/20 gap-3">
            <span className="text-[9px] font-black uppercase text-[#7A578D] tracking-widest">{category}</span>
            <button onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.delete('category');
              setSearchParams(next);
            }} className="text-[#7A578D] hover:text-red-500 transition-colors">
              <X size={12} />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hidden lg:inline">Order By</span>
        <div className="relative group/sort">
          <button className="flex items-center space-x-4 bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white hover:border-[#7A578D]/30 transition-all shadow-sm">
            <span>{sortOptions.find(o => o.val === sortBy && o.order === sortOrder)?.label || 'Newest'}</span>
            <ChevronDown size={14} className="text-[#7A578D]" />
          </button>

          <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/5 rounded-2xl shadow-2xl py-3 opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all z-[100] scale-95 origin-top-right group-hover/sort:scale-100">
            {sortOptions.map(opt => (
              <button 
                key={opt.label} 
                onClick={() => updateSort(opt)}
                className={`w-full text-left px-6 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-[10px] font-black uppercase tracking-widest ${sortBy === opt.val && sortOrder === opt.order ? 'text-[#7A578D] bg-[#7A578D]/5' : 'text-gray-500'}`}
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
