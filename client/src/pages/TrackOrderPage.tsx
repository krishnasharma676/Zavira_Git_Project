import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  Search, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Link,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { formatCurrency } from '../utils/format';
import zaviraLogo from '../assets/zavira-logo.png';
import { useTrackOrder } from '../hooks/useTrackOrder';

const TrackOrderPage = () => {
  const {
    searchBy,
    setSearchBy,
    trackingId,
    setTrackingId,
    loading,
    result,
    setResult,
    error,
    handleTrack
  } = useTrackOrder();

  const getTimelineSteps = (status: string) => {
    const steps = [
      { id: 'PENDING', label: 'Ordered', icon: Clock },
      { id: 'CONFIRMED', label: 'Confirmed', icon: ShieldCheck },
      { id: 'SHIPPED', label: 'Shipped', icon: Truck },
      { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 }
    ];
    const currentIndex = steps.findIndex(s => s.id === status);
    return steps.map((s, idx) => ({ ...s, isCompleted: idx <= currentIndex }));
  };

  return (
    <div className="h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans overflow-hidden flex flex-col">
      
      {/* Simple Header */}
      <header className="border-b border-gray-100 dark:border-white/5 px-6 py-4 flex items-center justify-between shrink-0">
        <a href="/" className="flex items-center gap-2 group">
          <img src={zaviraLogo} alt="Logo" className="h-8 w-auto object-contain dark:invert" />
          <span className="font-black text-xl uppercase tracking-tighter italic">Zavira</span>
        </a>
        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <a href="/shop" className="hover:text-black dark:hover:text-white transition-colors">Shop</a>
          <a href="/profile" className="hover:text-black dark:hover:text-white transition-colors">Account</a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-xl space-y-8 py-10"
            >
              <div className="text-center space-y-2">
                 <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none italic">
                   Track <span className="text-[#7A578D]">Order_</span>
                 </h1>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Enter your details below to see status</p>
              </div>

              <div className="bg-gray-50 dark:bg-white/[0.02] p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm">
                 <div className="flex items-center gap-6 mb-8 border-b border-gray-100 dark:border-white/5">
                    {['orderId', 'awb'].map(type => (
                       <button 
                         key={type}
                         type="button"
                         onClick={() => setSearchBy(type)}
                         className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-colors relative
                           ${searchBy === type ? 'text-[#7A578D]' : 'text-gray-300 dark:text-gray-600 hover:text-gray-400'}`}
                       >
                         {type === 'orderId' ? 'Order ID' : 'Tracking ID'}
                         {searchBy === type && <motion.div layoutId="trackTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7A578D]" />}
                       </button>
                    ))}
                 </div>

                 <form onSubmit={handleTrack} className="space-y-6">
                    <div className="relative group">
                       <input 
                         type="text" 
                         required
                         value={trackingId}
                         onChange={(e) => setTrackingId(e.target.value)}
                         placeholder={searchBy === 'orderId' ? 'e.g. ZV-240401-A9B3' : 'Enter 12-digit Tracking ID'}
                         className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#7A578D]/20 transition-all font-bold text-xs uppercase tracking-widest dark:text-white"
                       />
                       <Search size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>

                    <button 
                      type="submit"
                      disabled={loading || !trackingId}
                      className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-4 rounded-xl transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-[#7A578D] dark:hover:bg-[#7A578D] dark:hover:text-white disabled:opacity-30 group"
                    >
                      {loading ? (
                         <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                         <><span>Track Order</span> <ChevronRight size={14} /></>
                      )}
                    </button>

                    {error && (
                       <p className="text-center text-red-500 text-[9px] font-black uppercase tracking-widest px-4">{error}</p>
                    )}
                 </form>
              </div>
            </motion.div>
          ) : (
            <motion.div 
               key="result"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full max-w-5xl space-y-4 py-4"
            >
              <button 
                onClick={() => setResult(null)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white mb-2"
              >
                <ArrowLeft size={12} /> New Search
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                 {/* Main Status */}
                 <div className="lg:col-span-8 space-y-4">
                    <div className="bg-gray-50 dark:bg-white/[0.02] rounded-3xl p-6 border border-gray-100 dark:border-white/5">
                       <div className="flex justify-between items-start mb-10">
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-[#7A578D] mb-1">Status</p>
                             <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                                {result.shippingStatus || result.status}
                             </h2>
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-widest bg-gray-200 dark:bg-white/10 px-4 py-2 rounded-lg">
                             Order ID: {result.orderNumber}
                          </div>
                       </div>

                       <div className="relative flex justify-between px-2">
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-white/5 -translate-y-1/2" />
                          {getTimelineSteps(result.status).map((step, idx) => {
                             const Icon = step.icon;
                             return (
                               <div key={idx} className="flex flex-col items-center gap-2 relative">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2 
                                    ${step.isCompleted ? 'bg-[#7A578D] text-white border-[#7A578D] shadow-lg shadow-[#7A578D]/20' : 'bg-white dark:bg-black text-gray-200 border-gray-100 dark:border-white/5'}`}>
                                     <Icon size={16} />
                                  </div>
                                  <p className={`text-[8px] font-black uppercase tracking-widest ${step.isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                     {step.label}
                                  </p>
                               </div>
                             );
                          })}
                       </div>
                    </div>

                    {/* Activity Log - Dynamic from Shiprocket */}
                    {result.tracking?.tracking_data?.shipment_track_activities && (
                       <div className="bg-gray-50 dark:bg-white/[0.02] rounded-3xl p-6 border border-gray-100 dark:border-white/5 overflow-y-auto max-h-[300px]">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                             <MapPin size={12}/> Activity History
                          </h3>
                          <div className="space-y-4">
                             {result.tracking.tracking_data.shipment_track_activities.slice(0, 5).map((log: any, idx: number) => (
                                <div key={idx} className="flex gap-4 group">
                                   <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${idx === 0 ? 'bg-[#7A578D]' : 'bg-gray-200 dark:bg-white/10'}`} />
                                   <div className="flex-1 border-b border-gray-50 dark:border-white/5 pb-3">
                                      <p className="text-[10px] font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-1 leading-tight">{log.activity}</p>
                                      <div className="flex justify-between items-center">
                                         <span className="text-[8px] font-bold text-gray-400">{log.date}</span>
                                         <span className="text-[8px] font-black text-[#7A578D] uppercase tracking-widest">{log.location}</span>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                 </div>

                 {/* Sidebar Info */}
                 <div className="lg:col-span-4 space-y-4">
                    <div className="bg-gray-50 dark:bg-white/[0.02] rounded-3xl p-6 border border-gray-100 dark:border-white/5 space-y-6">
                       <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] mb-4">Delivery Info</p>
                          <div className="space-y-3">
                             <div className="p-3 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-white/5">
                                <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Courier</p>
                                <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase">{result.courierName || 'In Transit'}</p>
                             </div>
                             <div className="p-3 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-white/5 flex justify-between items-center">
                                <div>
                                   <p className="text-[8px] font-black uppercase text-gray-400 mb-1">AWB Number</p>
                                   <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{result.awbNumber || 'Generating'}</p>
                                </div>
                                {result.trackingUrl && (
                                   <a href={result.trackingUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#7A578D] transition-colors"><Link size={14} /></a>
                                )}
                             </div>
                          </div>
                       </div>

                       <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4 italic">Inside This Box_</p>
                          <div className="space-y-3">
                             {result.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-3 p-2 bg-white dark:bg-black rounded-xl border border-gray-50 dark:border-white/5">
                                   <img src={item.image} alt="" className="w-10 h-12 object-cover rounded-lg bg-gray-50 dark:bg-white/5" />
                                   <div className="flex-1 justify-center flex flex-col">
                                      <p className="text-[9px] font-black uppercase tracking-tight text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                                      <p className="text-[8px] font-black text-[#7A578D]">Qty: {item.quantity}</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center px-1">
                          <p className="text-[10px] font-black uppercase text-gray-400">Total Price</p>
                          <p className="text-[14px] font-black text-gray-900 dark:text-white italic">{formatCurrency(result.payableAmount)}</p>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="shrink-0 py-4 px-6 text-center border-t border-gray-100 dark:border-white/5">
         <p className="text-[8px] text-gray-300 dark:text-gray-700 font-bold uppercase tracking-[0.3em]">© 2024 Zavira Original. Shipping Worldwide.</p>
      </footer>
    </div>
  );
};

export default TrackOrderPage;
