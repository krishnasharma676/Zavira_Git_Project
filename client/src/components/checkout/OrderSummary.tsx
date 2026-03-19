import { Truck, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface OrderSummaryProps {
  items: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const OrderSummary = ({ items, subtotal, shipping, tax, total }: OrderSummaryProps) => {
  return (
    <div className="lg:border-l lg:border-gray-100 dark:lg:border-white/5 lg:pl-16 space-y-10">
      <h2 className="text-[13px] uppercase tracking-[0.3em] font-black italic border-b border-gray-100 dark:border-white/10 pb-4">Order Summary</h2>
      
      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map(item => (
          <div key={item.id} className="flex gap-6 items-center group">
            <div className="relative shrink-0">
              <img src={item.image} className="w-20 h-20 object-cover bg-gray-50 dark:bg-white/5 rounded-2xl transition-transform group-hover:scale-105" alt="" />
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#7A578D] text-white text-[10px] flex items-center justify-center rounded-full font-black shadow-lg shadow-[#7A578D]/30">
                {item.quantity}
              </span>
            </div>
            <div className="flex-grow">
              <h4 className="text-[11px] uppercase tracking-widest font-black text-gray-900 dark:text-white line-clamp-1">{item.name}</h4>
              <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">Reference #{item.id.slice(-6).toUpperCase()}</p>
              <p className="text-[12px] font-black text-[#7A578D] mt-1">{formatCurrency(item.price)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-10 border-t border-gray-100 dark:border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (3%)</span>
          <span className="text-gray-900 dark:text-white">{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between items-center bg-[#7A578D]/5 p-3 rounded-xl">
          <span className={shipping === 0 ? "text-[#7A578D]" : "text-gray-500"}>Shipping {shipping === 0 ? "Free" : "Fee"}</span>
          <span className={shipping === 0 ? "text-[#7A578D] italic font-black" : "text-gray-900 dark:text-white"}>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
        </div>
      </div>

      <div className="flex justify-between items-end pt-6 border-t border-black/5 dark:border-white/5">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-black tracking-[0.4em] text-[#7A578D]">Total Amount</span>
          <p className="text-4xl font-sans font-black italic text-gray-900 dark:text-white leading-none tracking-tighter">{formatCurrency(total)}</p>
        </div>
        <p className="text-[9px] text-gray-400 font-bold text-right uppercase tracking-widest italic leading-tight">All taxes <br/>included.</p>
      </div>


      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="flex items-center space-x-3 text-gray-400 bg-gray-50/50 dark:bg-white/[0.02] p-4 rounded-xl border border-gray-100 dark:border-white/10">
          <Truck size={20} className="text-[#7A578D] shrink-0" />
          <span className="text-[8px] uppercase tracking-widest font-black leading-tight">Secure <br/>Delivery</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-400 bg-gray-50/50 dark:bg-white/[0.02] p-4 rounded-xl border border-gray-100 dark:border-white/10">
          <ShieldCheck size={20} className="text-[#7A578D] shrink-0" />
          <span className="text-[8px] uppercase tracking-widest font-black leading-tight">Lifetime <br/>Guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
