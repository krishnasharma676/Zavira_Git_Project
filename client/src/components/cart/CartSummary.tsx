import { ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/format';

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const CartSummary = ({ subtotal, tax, shipping, total }: CartSummaryProps) => {
  const navigate = useNavigate();

  return (
    <div className="lg:col-span-4 lg:sticky lg:top-[170px] h-fit">
      <div className="bg-gray-50 dark:bg-[#121212] p-8 lg:p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
        <h2 className="text-xl font-sans uppercase tracking-tight font-black mb-8 pb-4 border-b border-gray-200 dark:border-white/10">Allocation Summary</h2>
        
        <div className="space-y-6 mb-10">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Vault Subtotal</span>
            <span className="text-sm font-bold">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-[#C9A0C8]">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Logistics & Handling</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{shipping === 0 ? 'Complimentary' : formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Customs & GST (3%)</span>
            <span className="text-sm font-bold">{formatCurrency(tax)}</span>
          </div>
        </div>

        <div className="pt-8 border-t border-dashed border-gray-300 dark:border-white/10 mb-10">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white">Total Commitment</span>
            <span className="text-3xl font-sans italic text-[#C9A0C8]">{formatCurrency(total)}</span>
          </div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">Prices Inclusive of Duties</p>
        </div>


        <button 
          onClick={() => navigate('/checkout')}
          className="luxury-button w-full rounded-2xl flex items-center justify-center space-x-4 group"
        >
          <span>AUTHORIZE CHECKOUT</span>
          <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
        </button>

        <div className="mt-8 space-y-4">
           <div className="flex items-center space-x-3 text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
              <ShieldCheck size={14} className="text-green-500" />
              <span>256-bit Secure Encryption</span>
           </div>
           <div className="flex items-center space-x-3 text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
              <Clock size={14} className="text-[#C9A0C8]" />
              <span>Dispatch within 48 hours</span>
           </div>
        </div>
      </div>

      <div className="mt-6 p-6 bg-[#EAD0DB] dark:bg-white/5 rounded-3xl border border-white dark:border-white/5 text-center">
        <p className="text-[9px] font-black uppercase tracking-widest text-[#C9A0C8] mb-2 leading-relaxed">
           Complimentary gift wrapping & <br/>Personalized message available
        </p>
        <Link to="/shop" className="text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors underline underline-offset-4">Continue Selection</Link>
      </div>
    </div>
  );
};

export default CartSummary;
