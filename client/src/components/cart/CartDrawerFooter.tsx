import { motion } from 'framer-motion';
import { ChevronRight, Lock, Sparkles } from 'lucide-react';
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

  return (
    <div className="p-8 border-t border-gray-50 dark:border-white/5 bg-white dark:bg-[#0A0A0A] space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Subtotal</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Global Logistics</span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${subtotal >= freeShippingThreshold ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
            {subtotal >= freeShippingThreshold ? 'Complimentary' : formatCurrency(49)}
          </span>
        </div>
        {subtotal < freeShippingThreshold && (
          <div className="pt-2">
            <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                className="h-full bg-[#C9A0C8]"
               />
            </div>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-2 text-center">
               Add <span className="text-[#C9A0C8]">{formatCurrency(freeShippingThreshold - subtotal)}</span> for free logistics
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end border-t border-gray-50 dark:border-white/5 pt-4">
           <div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-1">Payable Amount</span>
              <span className="text-2xl font-sans italic text-gray-900 dark:text-white">{formatCurrency(total)}</span>
           </div>
           <div className="flex flex-col items-end">
              <div className="flex items-center space-x-1 text-[8px] font-black uppercase text-green-500 mb-1 tracking-widest">
                 <Lock size={10} />
                 <span>Secure Port</span>
              </div>
              <div className="flex items-center space-x-1 text-[8px] font-black uppercase text-gray-400 tracking-widest">
                 <Sparkles size={10} className="text-[#C9A0C8]" />
                 <span>Premium Service</span>
              </div>
           </div>
        </div>

        <button 
          onClick={handleCheckout}
          disabled={itemsCount === 0}
          className="w-full bg-[#C9A0C8] hover:bg-black dark:hover:bg-white dark:hover:text-black text-white py-5 rounded-3xl font-black uppercase text-[12px] tracking-[0.2em] transition-all shadow-xl shadow-red-500/10 active:scale-95 disabled:opacity-50 disabled:grayscale group flex items-center justify-center space-x-3"
        >
          <span>Authorize Checkout</span>
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default CartDrawerFooter;
