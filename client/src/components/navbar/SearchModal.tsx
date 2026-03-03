import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  searchResults: any[];
}

const SearchModal = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  isSearching,
  searchResults
}: SearchModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '-10%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-10%' }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-white dark:bg-[#121212] z-[200] flex flex-col items-center pt-16 px-4 overflow-y-auto"
        >
          <button 
            onClick={() => {
              onClose();
              setSearchQuery('');
            }}
            className="absolute top-6 right-6 lg:top-8 lg:right-10 text-gray-300 hover:text-black dark:text-gray-600 dark:hover:text-white transition-colors"
          >
            <X size={28} strokeWidth={1} />
          </button>

          <div className="w-full max-w-5xl flex flex-col items-center mt-4">
            <h2 className="text-2xl lg:text-3xl font-black font-sans text-gray-900 dark:text-white mb-6 tracking-tight">Search Our Site</h2>
            
            <div className="w-full max-w-2xl relative mb-12">
              <input 
                type="text" 
                value={searchQuery}
                placeholder="Search for jewelry, collections..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#1A1A1A] border border-[#C9A0C8] dark:border-[#7A578D] text-gray-900 dark:text-white text-base rounded-full py-3.5 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-[#C9A0C8]/20 transition-all shadow-sm font-medium"
                autoFocus
              />
              <button className="absolute right-5 top-1/2 -translate-y-1/2 text-[#C9A0C8] hover:text-[#7A578D]">
                <Search size={22} strokeWidth={2} />
              </button>
            </div>

            {searchQuery && (
              <div className="w-full px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-white/5 pb-4">
                   <h3 className="text-lg font-sans font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                     {isSearching ? 'Searching...' : `Results for "${searchQuery}"`}
                   </h3>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} found</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                   {searchResults.length > 0 ? (
                     searchResults.map((product) => (
                      <Link 
                        key={product.id} 
                        to={`/product/${product.slug}`}
                        onClick={() => {
                          onClose();
                          setSearchQuery('');
                        }}
                        className="group/res flex flex-col items-center text-center cursor-pointer"
                      >
                        <div className="w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-white/5">
                          <img 
                            src={product.images?.[0]?.imageUrl || 'https://via.placeholder.com/400'} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover/res:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white line-clamp-1">{product.name}</p>
                        <p className="text-[10px] font-bold text-[#7A578D] mt-1 space-x-1">
                          <span>₹{product.discountedPrice || product.basePrice}</span>
                        </p>
                      </Link>
                     ))
                   ) : !isSearching && (
                     <div className="col-span-full py-12 text-center">
                       <p className="text-gray-400 text-sm font-medium italic font-sans">We couldn't find any jewelry matching "{searchQuery}"</p>
                     </div>
                   )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
