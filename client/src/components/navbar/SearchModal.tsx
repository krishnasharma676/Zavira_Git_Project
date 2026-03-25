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
          className="fixed inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl z-[200] flex flex-col items-center pt-4 px-4 overflow-y-auto custom-scrollbar"
        >
          <button 
            onClick={() => {
              onClose();
              setSearchQuery('');
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-black dark:text-gray-600 dark:hover:text-white transition-colors p-2"
          >
            <X size={24} strokeWidth={1.5} />
          </button>

          <div className="w-full max-w-6xl flex flex-col items-center">
            <h2 className="text-lg font-black font-sans text-[#7A578D] mb-4 tracking-tighter uppercase flex items-center gap-2">
               <Search size={16} /> Search Our Site
            </h2>
            
            <div className="w-full max-w-lg relative mb-6">
              <input 
                type="text" 
                value={searchQuery}
                placeholder="Find unique pieces..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-[#7A578D]/20 dark:border-white/10 text-gray-900 dark:text-white text-sm rounded-xl py-2.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#7A578D]/20 transition-all shadow-sm font-bold"
                autoFocus
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A578D] hover:text-black">
                <Search size={18} strokeWidth={2.5} />
              </button>
            </div>

            {searchQuery && (
              <div className="w-full animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-white/5 pb-2">
                   <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
                     {isSearching ? 'Syncing Results...' : `Found ${searchResults.length} matches`}
                   </h3>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-x-3 gap-y-5">
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
                        <div className="w-full aspect-[3/4] rounded-lg overflow-hidden mb-1.5 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-white/10 shadow-sm">
                          <img 
                            src={product.images?.[0]?.imageUrl || 'https://via.placeholder.com/400'} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover/res:scale-110 transition-transform duration-700"
                          />
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-tight text-gray-900 dark:text-gray-100 line-clamp-1 leading-none mb-1">{product.name}</p>
                        <p className="text-[9px] font-black text-[#7A578D]">
                          <span>₹{(product.discountedPrice || product.basePrice).toLocaleString()}</span>
                        </p>
                      </Link>
                     ))
                   ) : !isSearching && (
                     <div className="col-span-full py-20 text-center">
                       <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest italic font-sans animate-pulse">NO_DATA_MATCHED</p>
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
