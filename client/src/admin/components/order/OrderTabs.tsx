
import React from 'react';

interface OrderTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setPage: (page: number) => void;
}

const tabs = [
  { label: 'Universal Records', value: 'ALL' },
  { label: 'Awaiting Pickup', value: 'PENDING' },
  { label: 'Logistics Transit', value: 'SHIPPED' },
  { label: 'Delivered Nexus', value: 'DELIVERED' },
  { label: 'Protocol Returns', value: 'RETURNS' },
];

const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, setActiveTab, setPage }) => {
  return (
    <div className="flex items-center gap-3 p-1.5 bg-gray-50/80 rounded-sm overflow-x-auto no-scrollbar w-fit border border-gray-100 shadow-inner">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => { setActiveTab(tab.value); setPage(0); }}
          className={`px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap active:scale-95 ${
            activeTab === tab.value 
            ? 'bg-black text-white shadow-xl shadow-black/20 border border-black' 
            : 'text-gray-400 hover:text-[#7A578D] hover:bg-white transition-colors'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default OrderTabs;
