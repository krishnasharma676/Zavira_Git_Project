import { ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const LuxuryBadges = () => {
  return (
    <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100 dark:border-white/5 mb-6">
      <div className="flex flex-col items-center text-center space-y-1.5">
        <ShieldCheck size={18} className="text-[#7A578D]" />
        <span className="text-[9px] uppercase tracking-widest font-black text-gray-400">Authentic <br/> Item</span>
      </div>
      <div className="flex flex-col items-center text-center space-y-1.5">
        <Truck size={18} className="text-[#7A578D]" />
        <span className="text-[9px] uppercase tracking-widest font-black text-gray-400">Fast <br/> Shipping</span>
      </div>
      <div className="flex flex-col items-center text-center space-y-1.5">
        <RefreshCw size={18} className="text-[#7A578D]" />
        <span className="text-[9px] uppercase tracking-widest font-black text-gray-400">Easy <br/> Return</span>
      </div>
    </div>
  );
};

export default LuxuryBadges;
