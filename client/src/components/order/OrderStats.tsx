import { Truck, ShieldCheck, Package } from 'lucide-react';

const OrderStats = () => {
  const stats = [
    { icon: Truck, label: 'Estimated Transit', value: '3-5 Solar Days' },
    { icon: ShieldCheck, label: 'Security Vault', value: 'Insured Alpha' },
    { icon: Package, label: 'Packaging', value: 'Vault Shielded' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
      {stats.map((stat, index) => (
        <div key={index} className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/10 p-6 rounded-3xl text-center space-y-3 hover:border-[#7A578D]/30 transition-all">
          <stat.icon size={24} className="mx-auto text-[#7A578D]" />
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
          <p className="text-[11px] font-black uppercase tracking-widest">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderStats;
