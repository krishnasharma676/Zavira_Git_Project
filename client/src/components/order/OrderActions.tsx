import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Download, Share2 } from 'lucide-react';

const OrderActions = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
         <Link to="/profile" className="luxury-button w-full sm:w-auto px-10 rounded-2xl flex items-center justify-center space-x-2">
            <span>ACCESS PORTAL</span>
            <ArrowRight size={14} />
         </Link>
         <Link to="/shop" className="luxury-button-secondary w-full sm:w-auto px-10 rounded-2xl flex items-center justify-center space-x-2 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] py-4">
            <span>RESUME EXPLORATION</span>
            <Plus size={14} />
         </Link>
      </div>

      <div className="flex items-center justify-center space-x-6 pt-8">
         <button className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-[#7A578D] transition-colors">
            <Download size={14} />
            <span>Manifest.pdf</span>
         </button>
         <button className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-[#7A578D] transition-colors">
            <Share2 size={14} />
            <span>Transmit Status</span>
         </button>
      </div>
    </>
  );
};

export default OrderActions;
