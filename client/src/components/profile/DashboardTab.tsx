import React from 'react';
import { motion } from 'framer-motion';

import { Package, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardTabProps {
  user: any;
  orders: any[];
  wishlistCount: number;
  loading: boolean;
  getStatusIcon: (status: string) => React.ReactNode;
  setActiveTab: (tab: string) => void;

}

const DashboardTab = ({ user, orders, wishlistCount, loading, getStatusIcon, setActiveTab }: DashboardTabProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="text-lg font-sans font-black mb-1 uppercase tracking-tight">Welcome, <span className="text-[#7A578D]">{user.name.split(' ')[0]}!</span></h2>
        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
          Track your orders, manage your addresses, and update your profile settings.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/10 p-5 rounded-2xl">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
          <p className="text-xl font-black text-gray-900 dark:text-white">{orders.length}</p>
        </div>
        <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/10 p-5 rounded-2xl">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Wishlist Items</p>
          <p className="text-xl font-black text-gray-900 dark:text-white">{wishlistCount}</p>
        </div>
        <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/10 p-5 rounded-2xl">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Membership</p>
          <p className="text-sm font-black text-[#7A578D] uppercase italic">Gold Member</p>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-black uppercase tracking-widest">Recent Orders</h2>
          <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black text-[#7A578D] uppercase tracking-widest hover:underline">View All</button>
        </div>
        {orders.length > 0 ? (
          <div className="bg-white dark:bg-transparent border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 flex items-center justify-between">
               <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center">
                     <Package size={18} className="text-[#7A578D]" />
                  </div>
                  <div>
                     <p className="text-[11px] font-black uppercase tracking-wider">{orders[0].orderNumber}</p>
                     <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{new Date(orders[0].createdAt).toLocaleDateString()}</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[12px] font-black text-[#7A578D]">₹{orders[0].payableAmount.toLocaleString()}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                     {getStatusIcon(orders[0].status)}
                     <span className="text-[8px] font-black uppercase text-gray-400">{orders[0].status}</span>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 p-5 rounded-2xl flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
              <ChevronRight size={14} />
            </div>
            <p className="text-[12px] font-medium text-blue-900 dark:text-blue-300">
              <Link to="/shop" className="underline font-black mr-1 uppercase text-[10px]">Start Shopping.</Link> 
              You haven't placed any orders yet.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardTab;
