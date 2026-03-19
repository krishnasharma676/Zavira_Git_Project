import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Users, DollarSign, Activity, RefreshCw, AlertTriangle, X, ExternalLink, TrendingUp, Clock, CheckCircle, Truck, XCircle, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLowStockModalOpen, setIsLowStockModalOpen] = useState(false);
  const [lowStockUsers, setLowStockUsers] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      const { data: res } = await api.get('/dashboard/stats');
      setData(res.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLowStock = async () => {
    try {
      const { data: res } = await api.get('/dashboard/low-stock');
      setLowStockUsers(res.data);
      setIsLowStockModalOpen(true);
    } catch (error) {
      toast.error('Failed to load inventory list');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-[2.5px] border-[#7A578D] border-t-transparent rounded-full animate-spin" />
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#7A578D]">Synchronizing Intelligence...</p>
      </div>
    </div>
  );

  const stats = [
    { label: 'Revenue', value: `₹${(data?.summary?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-[#7A578D]' },
    { label: 'Orders', value: data?.summary?.totalOrders || 0, icon: ShoppingBag, color: 'text-indigo-600' },
    { label: 'Customers', value: data?.summary?.totalCustomers || 0, icon: Users, color: 'text-violet-600' },
    { label: "Today's Orders", value: data?.summary?.todayOrders || 0, icon: Activity, color: 'text-emerald-600' },
  ];

  const statusMap = [
    { label: 'Pending', count: data?.orderStatusDistribution?.pending || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Confirmed', count: data?.orderStatusDistribution?.confirmed || 0, icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Shipped', count: data?.orderStatusDistribution?.shipped || 0, icon: Truck, color: 'text-[#7A578D]', bg: 'bg-[#7A578D]/5' },
    { label: 'Delivered', count: data?.orderStatusDistribution?.delivered || 0, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Cancelled', count: data?.orderStatusDistribution?.cancelled || 0, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-[1400px]">
      {/* COMPACT HEADER */}
      <header className="flex justify-between items-center border-b border-gray-100 pb-2">
        <div>
           <h1 className="text-lg font-sans font-black uppercase tracking-tighter text-gray-900 leading-none flex items-center gap-2">
             Dashboard
             <span className="text-[9px] font-black text-[#7A578D]/50 tracking-widest px-1.5 py-0.5 bg-[#7A578D]/5 rounded uppercase">V1.2 Optimized</span>
           </h1>
        </div>
        <div className="flex items-center space-x-2">
           <button onClick={fetchDashboardData} className="p-1.5 bg-white border border-gray-100 rounded text-gray-400 hover:text-[#7A578D] hover:bg-gray-50 transition-all">
              <RefreshCw size={12} />
           </button>
           <div className="bg-white border border-gray-100 px-2 py-1 rounded flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Store Live</span>
           </div>
        </div>
      </header>

      {/* COMPACT HERO STATS (Total Revenue, Orders, Users, Products) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 p-3 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
              <p className="text-base font-black text-gray-900 leading-none">{stat.value}</p>
            </div>
            <div className={`w-7 h-7 rounded-lg bg-gray-50 ${stat.color} flex items-center justify-center shadow-inner`}>
              <stat.icon size={14} strokeWidth={2.5} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: PERFORMANCE, LEDGER, STATUS */}
        <div className="lg:col-span-8 space-y-3">
          
          <div className="grid grid-cols-2 gap-3 h-full">
             {/* PERFORMANCE CHART */}
             <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                   <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-900 italic flex items-center gap-2">
                     <TrendingUp size={12} className="text-[#7A578D]" />
                     Sales Distribution
                   </h3>
                   <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">Last 7 Days</span>
                </div>
                <div className="h-[100px] w-full flex items-end gap-1 px-1">
                   {data?.salesTrend?.map((day: any, i: number) => {
                     const maxRevenue = Math.max(...data.salesTrend.map((d: any) => d.revenue), 1);
                     const height = (day.revenue / maxRevenue) * 100;
                     return (
                       <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                         <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[7px] font-black text-[#7A578D] bg-[#7A578D]/5 px-1.5 py-0.5 rounded shadow-sm z-10">
                           ₹{(day.revenue/1000).toFixed(1)}k
                         </div>
                         <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${Math.max(height, 5)}%` }}
                           transition={{ delay: i * 0.05 }}
                           className={`w-full rounded-sm transition-all duration-300 ${height > 0 ? 'bg-[#7A578D]' : 'bg-gray-100'}`}
                         />
                         <span className="mt-1.5 text-[6px] font-black text-gray-300 uppercase">{day.date}</span>
                       </div>
                     );
                   })}
                </div>
             </div>

             {/* ORDER STATUS SUMMARY (Step 6) */}
             <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-900 mb-2 px-1">Status Summary</h3>
                <div className="space-y-1">
                  {statusMap.map((status) => (
                    <div key={status.label} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50 transition-all cursor-default">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-md ${status.bg} ${status.color} flex items-center justify-center`}>
                          <status.icon size={11} strokeWidth={2.5} />
                        </div>
                        <span className="text-[8px] font-black uppercase text-gray-500 tracking-tight">{status.label}</span>
                      </div>
                      <span className="text-[9px] font-black text-gray-900">{status.count}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* RECENT ORDERS (Step 4) */}
          <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-50 px-1">
               <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-900">Recent Transactions</h3>
               <button onClick={() => navigate('/admin/orders')} className="text-[7px] font-black uppercase tracking-widest text-[#7A578D] hover:underline flex items-center gap-1 group">
                 Open Ledger <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
               </button>
            </div>
            
            <div className="space-y-0.5">
              {data?.recentOrders?.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50/50 transition-all border border-transparent hover:border-gray-50">
                   <div className="flex items-center gap-3">
                      <div className="text-[7px] font-black text-[#7A578D] bg-[#7A578D]/5 px-1.5 py-0.5 rounded w-14 text-center">#{order.orderNumber?.slice(-6) || '---'}</div>
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-gray-800 uppercase tracking-tight line-clamp-1 leading-tight">{order.user?.name}</span>
                         <span className="text-[7px] text-gray-400 italic font-medium uppercase leading-tight">{new Date(order.createdAt).toLocaleDateString()} • {order.payment?.paymentMethod}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className={`text-[6px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${
                        order.status === 'DELIVERED' ? 'text-green-600 bg-green-50' : 
                        order.status === 'CANCELLED' ? 'text-red-500 bg-red-50' :
                        'text-orange-500 bg-orange-50'
                      }`}>{order.status}</span>
                      <span className="text-[10px] font-black text-gray-900 min-w-[60px] text-right italic">₹{order.payableAmount.toLocaleString()}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BEST SELLERS, STOCK & SYSTEM */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* TOP SELLERS (Step 5) */}
          <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
             <h3 className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] mb-3 italic px-1">Top Selling Pieces</h3>
             <div className="space-y-3">
               {data?.topSellingProducts?.map((item: any) => (
                 <div key={item.productId} className="flex items-center justify-between p-0.5 group">
                    <div className="flex items-center gap-2.5">
                       <div className="w-8 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                          <img src={item.image || 'https://via.placeholder.com/100'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-800 uppercase line-clamp-1 max-w-[100px] leading-tight">{item.name}</span>
                          <span className="text-[7px] font-bold text-[#7A578D] uppercase mt-0.5">{item.unitsSold} Units Sold</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-gray-900">₹{item.revenue.toLocaleString()}</p>
                       <span className="text-[6px] font-black text-gray-300 uppercase tracking-widest leading-none">Revenue</span>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* STOCK WARNING (Step 7) */}
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-3">
             <div className="flex items-center justify-between mb-2 text-red-600">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={13} />
                  <h3 className="text-[8px] font-black uppercase tracking-widest leading-none">Stock Alerts</h3>
                </div>
                <span className="text-[12px] font-black leading-none">{data?.summary?.lowStockAlerts || 0}</span>
             </div>
             <div className="space-y-1">
                {data?.lowStockItems?.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-red-100 shadow-sm">
                    <span className="text-[7px] font-black uppercase text-gray-600 truncate max-w-[110px]">{item.product?.name}</span>
                    <span className="text-[9px] font-black text-red-600">{item.stock} LEFT</span>
                  </div>
                ))}
                <button 
                  onClick={fetchAllLowStock}
                  className="w-full mt-1.5 py-1.5 bg-red-600 text-white rounded-lg text-[7px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-md shadow-red-600/20"
                >
                  Restock Now
                </button>
             </div>
          </div>

          {/* SYSTEM HEALTH */}
          <div className="bg-gray-900 text-white rounded-xl p-3 shadow-lg border border-white/5">
             <div className="flex items-center justify-between mb-3">
                <h3 className="text-[7px] font-black uppercase tracking-widest text-[#C9A0C8]">Security Console</h3>
                <div className="flex items-center gap-1.5 bg-black/40 px-1.5 py-0.5 rounded">
                   <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[6px] font-black uppercase tracking-widest opacity-80">Online</span>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-2 text-[7px] font-bold">
                <div className="bg-white/5 p-1.5 rounded-lg border border-white/5">
                   <p className="uppercase text-gray-500 mb-0.5">Handshake</p>
                   <p className="text-emerald-400 text-[9px] font-black">Authorized</p>
                </div>
                <div className="bg-white/5 p-1.5 rounded-lg border border-white/5">
                   <p className="uppercase text-gray-500 mb-0.5">Encrypted</p>
                   <p className="text-blue-400 text-[9px] font-black">AES-256</p>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* DETAILED MONITOR MODAL */}
      <AnimatePresence>
        {isLowStockModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLowStockModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-red-50/50">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-600" />
                  Inventory Alerts
                </h2>
                <button onClick={() => setIsLowStockModalOpen(false)}><X size={18} className="text-gray-400 hover:text-red-600 transition-colors" /></button>
              </div>
              <div className="p-5 max-h-[50vh] overflow-y-auto space-y-2 custom-scrollbar">
                {lowStockUsers.length > 0 ? lowStockUsers.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:border-red-100 transition-all hover:bg-red-50/[0.2]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded bg-gray-50 overflow-hidden border border-gray-100">
                        <img src={item.product?.images?.[0]?.imageUrl} className="w-full h-full object-cover grayscale opacity-60" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-900 uppercase truncate max-w-[150px]">{item.product?.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-[#7A578D]">₹{item.product?.basePrice?.toLocaleString()}</span>
                          <span className="text-[8px] font-black text-gray-300">SKU: {item.sku || '---'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className={`text-[12px] font-black ${item.stock <= 3 ? 'text-red-600' : 'text-orange-500'}`}>{item.stock} <span className="text-[8px] opacity-60">UNITS</span></span>
                       <button onClick={() => { setIsLowStockModalOpen(false); navigate('/admin/products'); }} className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-[#7A578D] transition-colors"><ExternalLink size={14} /></button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 opacity-40">No critical alerts detected.</div>
                )}
              </div>
              <div className="p-4 bg-gray-100 flex justify-end">
                <button onClick={() => setIsLowStockModalOpen(false)} className="px-8 py-2.5 bg-black text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-transform active:scale-95">Dismiss Monitor</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
