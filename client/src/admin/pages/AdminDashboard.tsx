
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, DollarSign, Clock, ArrowUpRight, ArrowDownRight, Activity, Package } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const { data: res } = await api.get('/admin/dashboard/stats');
      setData(res.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const stats = [
    { label: 'REVENUE', value: `₹${(data?.stats?.totalRevenue || 0).toLocaleString()}`, change: '+2.4%', icon: DollarSign, color: 'text-[#7A578D]', bg: 'bg-[#7A578D]/5', trend: 'up' },
    { label: 'ORDERS', value: data?.stats?.totalOrders || 0, change: '+1.2%', icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'up' },
    { label: 'CUSTOMERS', value: data?.stats?.totalUsers || 0, change: '+5.7%', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50', trend: 'up' },
    { label: 'PRODUCTS', value: data?.stats?.totalProducts || 0, change: 'STABLE', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'up' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Dashboard</h1>
          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mt-1.5">Real-time metrics & analytics</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="text-right">
              <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">Store Status</span>
              <div className="flex items-center gap-1 mt-0.5 justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">Online</span>
              </div>
           </div>
           <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#7A578D]">
              <Activity size={16} />
           </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-gray-100 p-4 rounded-2xl hover:shadow-sm transition-all relative overflow-hidden italic"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} border border-white/50`}>
                <stat.icon size={16} />
              </div>
              <div className={`flex items-center space-x-0.5 px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase ${stat.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-[#7A578D] bg-red-50'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={8} /> : <ArrowDownRight size={8} />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-xl font-black text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-900">Recent Orders</h3>
            <button className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-[8px] font-black text-gray-300 uppercase tracking-widest">
                  <th className="pb-2">Order</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 uppercase font-black text-[10px] tracking-tight">
                {data?.recentOrders?.length > 0 ? data.recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="py-3 text-gray-900">#{order.id.slice(-4)}</td>
                    <td className="py-3">
                      <div className="flex flex-col truncate max-w-[150px]">
                        <span className="text-gray-700 truncate">{order.user?.name}</span>
                        <span className="text-[7px] text-gray-400 lowercase truncate">{order.user?.email}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                        order.status === 'DELIVERED' ? 'border-green-100 text-green-600 bg-green-50' :
                        'border-red-100 text-[#7A578D] bg-red-50'
                      }`}>{order.status}</span>
                    </td>
                    <td className="py-3 text-right text-gray-900">₹{order.payableAmount}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="py-8 text-center text-gray-300 text-[9px]">Awaiting orders...</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {data?.topSellingProducts?.length > 0 ? data.topSellingProducts.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center space-x-3 p-2 rounded-xl border border-gray-50 group hover:bg-gray-50/30 transition-all">
                <img src={item.image || 'https://via.placeholder.com/100'} className="w-8 h-10 object-cover rounded shadow-sm flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-[9px] font-black text-gray-900 uppercase truncate leading-tight">{item.name}</h4>
                  <p className="text-[8px] font-black uppercase tracking-widest mt-1 text-green-600">{item._sum.quantity} Sold</p>
                </div>
              </div>
            )) : (
              <div className="py-8 text-center text-gray-300 text-[9px] uppercase italic">Sales data incoming...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
