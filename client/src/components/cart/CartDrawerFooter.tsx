import { motion } from 'framer-motion';
import { ArrowRight, Truck, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface CartDrawerFooterProps {
  subtotal: number;
  freeShippingThreshold: number;
  flatRate: number;
  handleCheckout: () => void;
  itemsCount: number;
}

const CartDrawerFooter = ({ subtotal, freeShippingThreshold, flatRate, handleCheckout, itemsCount }: CartDrawerFooterProps) => {
  const shipping = subtotal >= freeShippingThreshold ? 0 : flatRate;
  const total = subtotal + shipping;
  const amountToFree = freeShippingThreshold - subtotal;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0A0A0A] shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)]">

      {/* Free Shipping Progress */}
      {amountToFree > 0 ? (
        <div className="mb-6 space-y-2 group">
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
               Add <span className="text-[#7A578D] font-black">{formatCurrency(amountToFree)}</span> for <span className="text-gray-900 dark:text-white">Free Delivery</span>
            </span>
            <span className="text-[9px] font-black text-[#7A578D] opacity-40 italic">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-50 dark:bg-white/5 overflow-hidden border border-gray-100 dark:border-white/10 rounded-none relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="absolute inset-y-0 left-0 bg-[#7A578D] shadow-[0_0_10px_rgba(122,87,141,0.3)]"
            />
          </div>
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/10 transition-all animate-in fade-in zoom-in duration-500">
          <Sparkles size={12} className="text-green-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-600">You've unlocked Free Shipping!</span>
        </div>
      )}

      <div className="pt-2">
        <div className="flex justify-between items-end mb-6 px-1">
           <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Total payable</span>
              <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{formatCurrency(total)}</span>
                 <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">INC. TAXES</span>
              </div>
           </div>
           
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Shipping</span>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-none border ${
                shipping === 0 
                ? 'bg-green-50 border-green-100 text-green-600' 
                : 'bg-gray-50 border-gray-100 dark:bg-white/5 dark:border-white/10 text-gray-900 dark:text-white'
              }`}>
                <Truck size={10} className={shipping === 0 ? 'text-green-500' : 'text-[#7A578D]'} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                  {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                </span>
              </div>
           </div>
        </div>

        <button 
          onClick={handleCheckout}
          disabled={itemsCount === 0}
          className="w-full relative overflow-hidden bg-[#7A578D] hover:bg-[#684a77] text-white py-4 rounded-none font-black uppercase text-[11px] tracking-[0.3em] transition-all duration-300 shadow-[0_8px_25px_-8px_rgba(122,87,141,0.3)] active:scale-[0.98] disabled:opacity-50 group flex items-center justify-center gap-3"
        >
          <span className="relative z-10">Proceed to Checkout</span>
          <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default CartDrawerFooter;
