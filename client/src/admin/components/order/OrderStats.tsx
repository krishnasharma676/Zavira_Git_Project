
import React from 'react';
import { Clock, Package, CheckCircle, Activity, LucideIcon } from 'lucide-react';

interface OrderStatsProps {
  stats: {
    pending: number;
    shipped: number;
    delivered: number;
    total: number;
  };
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  bg: string;
  icon: LucideIcon;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color, bg, icon: Icon }) => (
  <div className="bg-white border border-gray-100 p-4 rounded-sm flex items-center space-x-6 shadow-sm group hover:border-[#7A578D]/30 transition-all cursor-default">
    <div className={`p-4 rounded-sm ${bg} flex items-center justify-center ${color} group-hover:scale-110 transition-transform shadow-inner`}>
       <Icon size={28} />
    </div>
    <div className="flex flex-col">
       <span className="text-2xl font-black text-gray-900 leading-none mb-1 shadow-sm px-1">{value}</span>
       <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  </div>
);

const OrderStats: React.FC<OrderStatsProps> = ({ stats }) => {
  const statConfigs = [
    { label: 'Unfulfilled Records', value: stats.pending, color: 'text-orange-600', bg: 'bg-orange-50', icon: Clock },
    { label: 'Logistics Transit', value: stats.shipped, color: 'text-blue-600', bg: 'bg-blue-50', icon: Package },
    { label: 'Prisstine Delivery', value: stats.delivered, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
    { label: 'Total Transaction Archive', value: stats.total, color: 'text-[#7A578D]', bg: 'bg-[#7A578D]/5', icon: Activity },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
      {statConfigs.map((chip) => (
        <StatCard key={chip.label} {...chip} />
      ))}
    </div>
  );
};

export default OrderStats;
