import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Download, Share2 } from 'lucide-react';

const OrderActions = () => {
  return (
    <div className="pt-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
         <Link to="/profile" className="bg-[#7A578D] text-white w-full sm:w-auto px-10 py-3.5 rounded-xl flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#7A578D]/20 hover:scale-[1.02] transition-all">
            <span>View My Orders</span>
            <ArrowRight size={14} />
         </Link>
         <Link to="/shop" className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white w-full sm:w-auto px-10 py-3.5 rounded-xl flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
            <span>Continue Shopping</span>
            <ShoppingBag size={14} />
         </Link>
      </div>

      <div className="flex items-center justify-center space-x-6">
         <button className="flex items-center space-x-1.5 text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-[#7A578D] transition-colors border-b border-transparent hover:border-[#7A578D] pb-0.5">
            <Download size={14} />
            <span>Invoice</span>
         </button>
         <button className="flex items-center space-x-1.5 text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-[#7A578D] transition-colors border-b border-transparent hover:border-[#7A578D] pb-0.5">
            <Share2 size={14} />
            <span>Share</span>
         </button>
      </div>
    </div>
  );
};

export default OrderActions;
