import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0A0A0A] px-6 pt-[170px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag size={40} className="text-gray-300 dark:text-gray-600" />
        </div>
        <h1 className="text-4xl font-sans uppercase tracking-widest mb-6 text-gray-900 dark:text-white leading-tight">Your Cart <br/>is Empty</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium mb-12 max-w-sm mx-auto leading-relaxed text-sm">
          Discover timeless pieces and begin building your exclusive jewelry collection.
        </p>
        <Link to="/shop" className="luxury-button rounded-full">
          VIEW MORE
        </Link>
      </motion.div>
    </div>
  );
};

export default EmptyCart;
