import { Truck, ShieldCheck, Heart } from 'lucide-react';

const OrderStats = () => {
  const stats = [
    { icon: Truck, label: 'Standard Delivery', value: '3-5 Business Days' },
    { icon: ShieldCheck, label: 'Secure Guarantee', value: 'Insured Shipping' },
    { icon: Heart, label: 'Zaviraa Care', value: 'Gift Wrapped' }
  ];

  return (
    <div className="grid grid-cols-3 gap-3 pt-2">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/10 p-4 rounded-3xl text-center space-y-2 hover:border-[#7A578D]/30 transition-all shadow-sm">
          <div className="w-8 h-8 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center mx-auto text-[#7A578D]">
             <stat.icon size={16} />
          </div>
          <div className="space-y-0.5">
            <p className="text-[7px] font-black uppercase tracking-[0.1em] text-gray-400">{stat.label}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-900 dark:text-white truncate">{stat.value.split(' ')[0]} {stat.value.split(' ')[1]}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStats;
