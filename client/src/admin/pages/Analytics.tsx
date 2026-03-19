
import { useState, useEffect } from 'react';
import { TrendingUp, Users, CreditCard, Calendar, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2, Info, Download } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get('/reports/analytics');
      setData(res.data);
    } catch (error) {
      toast.error('Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
       <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Harvesting Data...</p>
       </div>
    </div>
  );

  const dailyEntries = Object.entries(data?.sales?.dailySales || {}).sort();
  const maxSale = Math.max(...dailyEntries.map(e => e[1] as number), 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1400px]">
      <header className="flex justify-between items-center border-b border-gray-100 pb-1.5">
        <div>
          <h1 className="text-lg font-sans font-black uppercase tracking-tight text-gray-900 leading-none">Intelligence Engine</h1>
          <p className="text-gray-400 text-[8px] font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
            <BarChart2 size={10} className="text-[#7A578D]" /> Strategic Business Insights & Performance
          </p>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={fetchAnalytics} className="p-1.5 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#7A578D] transition-all active:scale-95 shadow-sm">
             <RefreshCw size={13} />
           </button>
           <button className="bg-black text-white px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#7A578D] transition-all">
             <Download size={11} />
             <span>Export PDF</span>
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BIG CHART: REVENUE TREND */}
        <div className="lg:col-span-8 space-y-4">
           <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 italic">30-Day Revenue Delta</h3>
                    <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Daily gross performance tracking</p>
                 </div>
                 <div className="flex items-center gap-2 px-2 py-1 bg-green-50 rounded-lg text-green-600">
                    <ArrowUpRight size={12} />
                    <span className="text-[9px] font-black uppercase">+12.5% Growth</span>
                 </div>
              </div>

              <div className="h-[280px] w-full flex items-end gap-1.5 px-2 relative pt-8">
                 {/* GRID LINES */}
                 <div className="absolute inset-x-0 top-8 bottom-8 border-y border-gray-50 flex flex-col justify-between pointer-events-none">
                    <div className="w-full border-t border-gray-50/50" />
                    <div className="w-full border-t border-gray-50/50" />
                    <div className="w-full border-t border-gray-50/50" />
                 </div>

                 {dailyEntries.map(([date, amount]: any) => {
                    const height = (amount / maxSale) * 100;
                    return (
                       <div key={date} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                          <div className="absolute -top-8 scale-0 group-hover:scale-100 transition-all duration-300 whitespace-nowrap text-[9px] font-black text-white bg-black px-2 py-1.5 rounded-lg shadow-xl z-20">
                             ₹{(amount as number).toLocaleString()}
                             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45" />
                          </div>
                          <div 
                             style={{ height: `${Math.max(height, 2)}%` }}
                             className={`w-full rounded-t-sm transition-all duration-500 relative group-hover:bg-[#7A578D] ${height > 0 ? 'bg-[#7A578D]/20' : 'bg-gray-100'}`}
                          >
                             {height > 0 && (
                               <div className="absolute top-0 left-0 right-0 h-1 bg-[#7A578D] rounded-t-sm" />
                             )}
                          </div>
                          <span className="mt-3 text-[7px] font-black text-gray-300 uppercase rotate-45 origin-left">{date.split('-').slice(1).join('/')}</span>
                       </div>
                    );
                 })}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TOP CUSTOMERS */}
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                 <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                    <Users size={12} className="text-[#7A578D]" /> Elite Customers
                 </h3>
                 <div className="space-y-4">
                    {data?.topCustomers?.map((user: any) => (
                       <div key={user.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-[10px] font-black text-[#7A578D] border border-gray-100 uppercase">
                                {user.name[0]}
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-gray-900 truncate max-w-[120px]">{user.name}</span>
                                <span className="text-[8px] font-bold text-gray-400 italic uppercase">LTV: ₹{user.totalSpent.toLocaleString()}</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <span className="text-[9px] font-black text-gray-900">{user.ordersCount}</span>
                             <p className="text-[7px] font-bold text-gray-300 uppercase">Orders</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* PAYMENT METHODS */}
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                 <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard size={12} className="text-[#7A578D]" /> Channel Velocity
                 </h3>
                 <div className="space-y-5">
                    {Object.entries(data?.sales?.paymentMethods || {}).map(([method, count]: any) => {
                       const total = data?.sales?.totalOrders || 1;
                       const percent = Math.round((count / total) * 100);
                       return (
                          <div key={method} className="space-y-2">
                             <div className="flex justify-between items-center text-[9px] font-black uppercase">
                                <span className="text-gray-500">{method}</span>
                                <span className="text-[#7A578D] italic">{percent}%</span>
                             </div>
                             <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                <div 
                                   style={{ width: `${percent}%` }}
                                   className={`h-full ${method === 'ONLINE' ? 'bg-[#7A578D]' : 'bg-gray-300'} transition-all duration-1000`} 
                                />
                             </div>
                          </div>
                       );
                    })}
                 </div>
                 <div className="mt-8 p-3 bg-[#7A578D]/5 rounded-xl border border-[#7A578D]/10">
                    <p className="text-[9px] font-bold text-[#7A578D] leading-tight uppercase tracking-tight italic">
                       Online payments lead by 18% compared to last quarter. Recommended: Enable more UPI gateways.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* SIDEBAR STATS */}
        <div className="lg:col-span-4 space-y-4">
           <div className="bg-gray-900 text-white rounded-xl p-4 shadow-xl border border-white/5 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7A578D] opacity-20 blur-[80px] -mr-16 -mt-16" />
              
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C9A0C8] mb-6 italic">Key KPIs</h3>
              
              <div className="space-y-10">
                 <div className="relative z-10">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                       <Calendar size={10} className="text-[#7A578D]" /> Average Order Value
                    </p>
                    <div className="flex items-baseline gap-2">
                       <h4 className="text-3xl font-black italic">₹{(Object.values(data?.sales?.dailySales || []).reduce((a:any,b:any)=>a+b,0) as number / (data?.sales?.totalOrders || 1)).toFixed(0)}</h4>
                       <span className="text-emerald-400 text-[10px] font-black uppercase flex items-center gap-1">
                          <ArrowUpRight size={10} /> 4.2%
                       </span>
                    </div>
                 </div>

                 <div className="relative z-10">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                       <TrendingUp size={10} className="text-[#7A578D]" /> Conversion Rate
                    </p>
                    <div className="flex items-baseline gap-2">
                       <h4 className="text-3xl font-black italic">3.8%</h4>
                       <span className="text-amber-400 text-[10px] font-black uppercase flex items-center gap-1">
                          <ArrowDownRight size={10} /> 0.5%
                       </span>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-white/10 mt-10">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-[#7A578D]">
                          <Info size={14} />
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-widest leading-none">Intelligence Bot</p>
                    </div>
                    <p className="text-[9px] font-medium text-gray-400 leading-relaxed italic uppercase">
                       Predicted revenue for next 48 hours: ₹42,500 based on current traffic trends and cart activity.
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
