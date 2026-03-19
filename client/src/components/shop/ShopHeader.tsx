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
    <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-white/5 mb-6 gap-2">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 px-4 py-2 rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95"
        >
          <Filter size={12} />
          <span>Filters</span>
        </button>

        {category && (
          <div className="flex items-center bg-[#7A578D]/5 dark:bg-white/5 px-3 py-2 rounded-xl border border-[#7A578D]/10 gap-2">
            <span className="text-[9px] font-black uppercase text-[#7A578D]/80 tracking-widest">{category}</span>
            <button onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.delete('category');
              setSearchParams(next);
            }} className="text-[#7A578D]/40 hover:text-red-500 transition-colors">
              <X size={10} />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <div className="relative group/sort">
          <button className="flex items-center space-x-2 bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white hover:border-[#7A578D]/30 transition-all">
            <span className="text-gray-400 font-bold lowercase italic text-[9px] mr-1 hidden sm:inline">Sort:</span>
            <span>{sortOptions.find(o => o.val === sortBy && o.order === sortOrder)?.label?.replace('Price: ', '').replace('Alphabetical: ', '') || 'Newest'}</span>
            <ChevronDown size={12} className="text-[#7A578D]" />
          </button>

          <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/5 rounded-2xl shadow-2xl py-2 opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all z-[100] scale-95 origin-top-right group-hover/sort:scale-100">
            {sortOptions.map(opt => (
              <button 
                key={opt.label} 
                onClick={() => updateSort(opt)}
                className={`w-full text-left px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-[9px] font-black uppercase tracking-widest ${sortBy === opt.val && sortOrder === opt.order ? 'text-[#7A578D] bg-[#7A578D]/5' : 'text-gray-400 hover:text-gray-900'}`}
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
