import { motion } from 'framer-motion';
import { ArrowRight, Lock, Sparkles, CheckCircle2, Truck } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface CartDrawerFooterProps {
  subtotal: number;
  freeShippingThreshold: number;
  handleCheckout: () => void;
  itemsCount: number;
}

const CartDrawerFooter = ({ subtotal, freeShippingThreshold, handleCheckout, itemsCount }: CartDrawerFooterProps) => {
  const shipping = subtotal >= freeShippingThreshold ? 0 : 49;
  const total = subtotal + shipping;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0A0A0A] space-y-5 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)]">
      {/* Shipping Progress */}
      <div className="bg-gray-50/50 dark:bg-white/5 p-3 rounded-2xl border border-gray-100 dark:border-white/5">
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
               <Truck size={14} className={subtotal >= freeShippingThreshold ? "text-green-500" : "text-[#7A578D]"} />
               <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  {subtotal >= freeShippingThreshold ? "Unlocked Free Shipping" : "Shipping Policy"}
               </span>
            </div>
            <span className="text-[9px] font-black uppercase text-[#7A578D]">
               Threshold: {formatCurrency(freeShippingThreshold)}
            </span>
        </div>
        
        <div className="relative w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
           <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${subtotal >= freeShippingThreshold ? 'bg-green-500' : 'bg-[#7A578D]'} relative`}
           >
              <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
           </motion.div>
        </div>
        
        {subtotal < freeShippingThreshold ? (
          <p className="text-[8px] font-bold uppercase tracking-tight text-gray-500 mt-2 flex items-center justify-center gap-1">
             Add <span className="text-[#7A578D] font-black">{formatCurrency(freeShippingThreshold - subtotal)}</span> more for <span className="text-green-600 underline">FREE delivery</span>
          </p>
        ) : (
          <p className="text-[8px] font-bold uppercase tracking-tight text-green-600 mt-2 flex items-center justify-center gap-1">
             <CheckCircle2 size={10} /> Your order qualifies for free premium shipping
          </p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 px-1">
         <div className="space-y-1">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 block">Subtotal</span>
            <span className="text-sm font-black text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
         </div>
         <div className="space-y-1 text-right">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 block">Shipping</span>
            <span className={`text-sm font-black ${subtotal >= freeShippingThreshold ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
               {subtotal >= freeShippingThreshold ? 'FREE' : formatCurrency(49)}
            </span>
         </div>
      </div>

      <div className="pt-2">
        <div className="flex justify-between items-end mb-4 px-1">
           <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Total payable</span>
              <div className="flex items-baseline gap-1">
                 <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{formatCurrency(total)}</span>
                 <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">INC. TAXES</span>
              </div>
           </div>
           <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center space-x-1 text-[7px] font-black uppercase text-green-600 bg-green-50 dark:bg-green-500/10 px-1.5 py-0.5 rounded tracking-widest">
                 <Lock size={8} />
                  <span>Secure Pay</span>
              </div>
              <div className="flex items-center space-x-1 text-[7px] font-black uppercase text-[#7A578D] bg-[#7A578D]/5 px-1.5 py-0.5 rounded tracking-widest">
                 <Sparkles size={8} />
                  <span>Premium Care</span>
              </div>
           </div>
        </div>

        <button 
          onClick={handleCheckout}
          disabled={itemsCount === 0}
          className="w-full relative overflow-hidden bg-[#7A578D] hover:bg-[#684a77] text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-300 shadow-[0_8px_25px_-8px_rgba(122,87,141,0.5)] active:scale-[0.98] disabled:opacity-50 group flex items-center justify-center gap-3 mt-2"
        >
          <span className="relative z-10">Proceed to Checkout</span>
          <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default CartDrawerFooter;
