import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import zaviraLogo from '../../assets/zavira-logo.png';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  isActive: (path: string) => boolean;
}

const MobileMenu = ({ isOpen, onClose, categories, isActive }: MobileMenuProps) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100]"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-[#121212] z-[110] p-8 flex flex-col transition-colors duration-300 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
              <Link to="/" onClick={onClose}>
                <img src={zaviraLogo} alt="Zavira Logo" className="h-10 w-auto object-contain" />
              </Link>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] text-gray-800 dark:text-gray-200 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col space-y-6 uppercase tracking-widest text-[11px] font-bold text-gray-800 dark:text-gray-200">
              <Link to="/shop" onClick={onClose} className={isActive('/shop') ? 'text-[#7A578D]' : ''}>Store</Link>
              
              {/* Dynamic Categories Accordion */}
              <div className="pt-2">
                <button 
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center justify-between w-full text-[10px] text-gray-400 font-black uppercase tracking-widest hover:text-[#7A578D] transition-colors"
                >
                  <span>Categories</span>
                  <motion.div
                    animate={{ rotate: isCategoriesOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col space-y-4 pl-4 pt-4 pb-2 border-l border-gray-50 dark:border-gray-800 ml-1">
                        {categories.length > 0 ? categories.map((cat) => (
                          <Link 
                            key={cat.id} 
                            to={`/shop?category=${cat.slug}`} 
                            onClick={onClose} 
                            className={`text-[10px] font-black lowercase tracking-widest hover:text-[#7A578D] transition-colors ${isActive(`/shop?category=${cat.slug}`) ? 'text-[#7A578D]' : ''}`}
                          >
                            {cat.name}
                          </Link>
                        )) : (
                          <>
                            <Link to="/shop?category=rings" onClick={onClose} className="text-[10px] font-black lowercase tracking-widest">Rings</Link>
                            <Link to="/shop?category=necklaces" onClick={onClose} className="text-[10px] font-black lowercase tracking-widest">Necklaces</Link>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/hot-deals" onClick={onClose} className={isActive('/hot-deals') ? 'text-[#7A578D]' : ''}>Hot Deals 🔥</Link>
              <Link to="/about" onClick={onClose} className={isActive('/about') ? 'text-[#7A578D]' : ''}>About Us</Link>
              <Link to="/contact" onClick={onClose} className={isActive('/contact') ? 'text-[#7A578D]' : ''}>Contact</Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
