import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrderItem from './OrderItem';

interface OrdersTabProps {
  orders: any[];
  loading: boolean;
  getStatusIcon: (status: string) => React.ReactNode;
}

const OrdersTab = ({ orders, loading, getStatusIcon }: OrdersTabProps) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
       <h2 className="text-xl font-sans font-black mb-6 uppercase tracking-tighter">My <span className="text-[#7A578D]">Orders_</span></h2>
       {loading ? (
          <div className="space-y-3">
             {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-50 dark:bg-white/5 animate-pulse rounded-2xl" />)}
          </div>
       ) : orders.length > 0 ? (
          <div className="space-y-3">
             {orders.map((order) => (
                <OrderItem 
                  key={order.id} 
                  order={order} 
                  getStatusIcon={getStatusIcon} 
                />
             ))}
          </div>
       ) : (
          <div className="text-center py-16 bg-gray-50/50 dark:bg-white/[0.02] rounded-3xl border border-dashed border-gray-100 dark:border-white/10">
            <Package className="mx-auto text-gray-200 dark:text-white/5 mb-4" size={48} />
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] mb-6">You haven't placed any orders yet</p>
            <Link to="/shop" className="bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#7A578D] dark:hover:bg-[#7A578D] dark:hover:text-white transition-all inline-block shadow-lg">Start Shopping</Link>
          </div>
       )}
    </motion.div>
  );
};

export default OrdersTab;
