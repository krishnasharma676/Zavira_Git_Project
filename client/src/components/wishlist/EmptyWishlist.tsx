import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyWishlist = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9] dark:bg-[#0D0D0D] px-6 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      > 
        <div className="w-24 h-24 bg-white dark:bg-white/5 rounded-[2rem] shadow-xl shadow-black/5 flex items-center justify-center mb-8 mx-auto border border-gray-100 dark:border-white/5">
           <Heart size={32} className="text-[#7A578D] opacity-20" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7A578D] mb-4">Archive Empty</p>
        <h1 className="text-3xl md:text-4xl font-sans font-black text-gray-900 dark:text-white uppercase tracking-tight italic mb-6">Aura Neutral_</h1>
        <p className="text-gray-400 dark:text-gray-500 text-center mb-10 max-w-xs mx-auto text-[11px] font-bold uppercase tracking-widest leading-relaxed">
          Your personal vault currently holds no artifacts. Explore our collections to curate your legacy.
        </p>
        <Link 
          to="/shop" 
          className="luxury-button rounded-full"
        >
          VIEW MORE
        </Link>
      </motion.div>
    </div>
  );
};

export default EmptyWishlist;
