import { Link } from 'react-router-dom';
import { 
  Package, CheckCircle, Truck, MapPin, CreditCard, ArrowLeft, 
  Receipt, Clock, ShieldCheck, AlertCircle, HelpCircle, XCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/format';
import { getPrimaryImage } from '../utils/productHelpers';
import { useOrderSuccess } from '../hooks/useOrderSuccess';

const OrderSuccessPage = () => {
  const { order, loading, timeline, currentIndex } = useOrderSuccess();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A]">
        <div className="w-6 h-6 border-2 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0A0A0A] p-6 text-center">
        <AlertCircle size={40} className="text-gray-200 mb-4" />
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
        <Link to="/profile" className="text-[#7A578D] text-xs font-semibold flex items-center gap-1"><ArrowLeft size={14}/> Back to Orders</Link>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING': return { label: 'Placed', icon: <Clock size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' };
      case 'CONFIRMED': return { label: 'Confirmed', icon: <ShieldCheck size={16} />, color: 'text-[#7A578D]', bg: 'bg-purple-50' };
      case 'SHIPPED': return { label: 'Shipped', icon: <Truck size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'DELIVERED': return { label: 'Delivered', icon: <CheckCircle size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' };
      case 'CANCELLED': return { label: 'Cancelled', icon: <XCircle size={16} />, color: 'text-red-600', bg: 'bg-red-50' };
      default: return { label: status, icon: <Package size={16} />, color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  const status = getStatusConfig(order.status);

  return (
    <div className="bg-[#fcfcfc] dark:bg-[#0A0A0A] min-h-screen text-gray-900 dark:text-white font-sans w-full">
      
      <main className="w-full px-6 lg:px-12 py-10 bg-white dark:bg-black/20 min-h-screen transition-all">
        
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-8 border-b border-gray-100 dark:border-white/5">
           <div className="space-y-1">
              <Link to="/profile" className="flex items-center gap-2 text-gray-400 hover:text-[#7A578D] transition-colors mb-3">
                 <ArrowLeft size={16} />
                 <span className="text-[11px] font-bold uppercase tracking-widest">Back to Account</span>
              </Link>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Order ID: {order.orderNumber}</h1>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-[0.2em]">{formatDate(order.createdAt)}</p>
           </div>
           <div className="flex items-center gap-4">
              <button title="Download Invoice" className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-[#7A578D] hover:bg-[#7A578D]/5 transition-all"><Receipt size={20}/></button>
              <div className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 ${status.bg} ${status.color} border-current/20 shadow-sm shadow-current/5`}>
                 {status.icon}
                 <span className="text-[12px] font-bold uppercase tracking-widest leading-none">{status.label}</span>
              </div>
           </div>
        </div>

        {/* Enhanced Thicker Timeline */}
        {!['CANCELLED', 'RETURNED'].includes(order.status) && (
          <div className="mb-16 px-2">
             <div className="relative w-full">
                {/* Background Track */}
                <div className="absolute top-[11px] left-0 right-0 h-[6px] bg-gray-100 dark:bg-white/5 rounded-full" />
                
                {/* Progress Track */}
                <div className="absolute top-[11px] left-0 h-[6px] bg-[#7A578D] shadow-[0_0_15px_rgba(122,87,141,0.3)] transition-all duration-1000 rounded-full" 
                  style={{ width: `${(Math.max(0, currentIndex) / (timeline.length - 1)) * 100}%` }} 
                />
                
                {/* Nodes & Labels */}
                <div className="flex justify-between relative z-10 w-full">
                   {timeline.map((step, idx) => (
                     <div key={step} className="flex flex-col items-center flex-1 first:items-start last:items-end">
                        {/* Enlarged Dot */}
                        <div className={`w-6 h-6 rounded-full border-[4px] bg-white dark:bg-[#111] transition-all duration-500 flex items-center justify-center 
                          ${idx <= currentIndex ? 'border-[#7A578D] scale-110 shadow-lg shadow-[#7A578D]/10' : 'border-gray-200 dark:border-white/10'}`}>
                          {idx <= currentIndex && <div className="w-2 h-2 bg-[#7A578D] rounded-full" />}
                        </div>
                        {/* Label */}
                        <div className="mt-5">
                           <span className={`text-[11px] font-bold uppercase tracking-[0.1em] block whitespace-nowrap
                              ${idx <= currentIndex ? 'text-gray-900 dark:text-white' : 'text-gray-300 dark:text-gray-600'}`}>
                              {step}
                           </span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
          
          <div className="lg:col-span-8 space-y-10">
            {/* Tracking Feed */}
            {order.tracking?.tracking_data?.shipment_track_activities && (
              <div className="bg-white dark:bg-transparent rounded-2xl border border-gray-100 dark:border-white/5 p-8 shadow-sm">
                 <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#7A578D] mb-8 px-1 flex items-center gap-2">
                    <Clock size={16} /> Latest Activities
                 </h3>
                 <div className="space-y-8">
                    {order.tracking.tracking_data.shipment_track_activities.slice(0, 4).map((act: any, idx: number) => (
                      <div key={idx} className="flex gap-6 text-[13px] group">
                         <div className="flex flex-col items-center">
                            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${idx === 0 ? 'bg-[#7A578D] shadow-[0_0_10px_rgba(122,87,141,0.4)]' : 'bg-gray-100 dark:bg-white/10'}`} />
                            {idx !== 3 && <div className="w-[1.5px] flex-1 bg-gray-100 dark:bg-white/5 my-2.5" />}
                         </div>
                         <div className="flex-1 pb-4">
                            <p className={`font-bold tracking-tight mb-2 text-sm ${idx === 0 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{act.activity}</p>
                            <div className="flex items-center gap-6 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                               <span className="flex items-center gap-1.5 opacity-60"><Clock size={12}/> {act.date}</span>
                               <span className="flex items-center gap-1.5 text-[#7A578D]"><MapPin size={12}/> {act.location}</span>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white dark:bg-transparent border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
               <div className="px-8 py-5 border-b border-gray-50 dark:border-white/5 flex items-center justify-between bg-gray-50/50">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400">Order Items</h3>
                  <span className="text-[11px] font-bold text-[#7A578D] uppercase tracking-widest">{order.items?.length} Piece(s)</span>
               </div>
               <div className="divide-y divide-gray-50 dark:divide-white/5">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="p-8 flex gap-8 hover:bg-gray-50/20 transition-all group">
                       <Link to={`/product/${item.product?.id}`} className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 dark:border-white/5 relative">
                          {getPrimaryImage(item.product?.images) ? (
                            <img src={getPrimaryImage(item.product?.images)} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-[10px] text-gray-300">...</div>
                          )}
                          <div className="absolute top-3 right-3 bg-black/90 text-white text-[10px] px-3 py-1 rounded-lg font-bold backdrop-blur-md">x{item.quantity}</div>
                       </Link>
                       <div className="flex-1 flex flex-col justify-center min-w-0">
                          <h4 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-[#7A578D] transition-colors leading-snug mb-2">{item.product?.name}</h4>
                          <div className="flex items-center gap-5 text-[12px] text-gray-400 mb-4">
                             {item.selectedSize && <span className="bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-md">Size: <span className="font-bold text-gray-900 dark:text-gray-300">{item.selectedSize}</span></span>}
                          </div>
                          <div className="text-lg font-bold text-[#7A578D]">{formatCurrency(item.price)}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
             {/* Billing Summary */}
             <div className="bg-gray-50/50 dark:bg-white/[0.02] rounded-2xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-8 px-1">Ledger Summary</h3>
                <div className="space-y-5 text-sm font-medium">
                   <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="text-gray-900 dark:text-white uppercase font-bold">{formatCurrency(order.totalAmount)}</span>
                   </div>
                   <div className="flex justify-between text-gray-500">
                      <span>Courier Fee</span>
                      <span className="text-gray-900 dark:text-white uppercase font-bold">{order.shippingCharges === 0 ? 'Complimentary' : formatCurrency(order.shippingCharges)}</span>
                   </div>
                   <div className="flex justify-between text-gray-500 pb-5 border-b border-gray-100 dark:border-white/10">
                      <span>GST/VAT Estimate</span>
                      <span className="text-gray-900 dark:text-white uppercase font-bold">{formatCurrency(order.taxAmount)}</span>
                   </div>
                   <div className="flex justify-between items-center pt-3">
                      <span className="font-bold text-gray-900 dark:text-white uppercase tracking-tighter text-lg">Net Total_</span>
                      <span className="text-2xl font-bold text-[#7A578D]">{formatCurrency(order.payableAmount)}</span>
                   </div>
                </div>
                
                <div className="mt-10 flex items-center gap-4 bg-white dark:bg-black/40 p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                   <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100"><CreditCard size={20}/></div>
                   <div className="flex-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5 leading-none">Paid via {order.payment?.paymentMethod || 'COD'}</p>
                      <p className="text-[12px] font-black text-emerald-600 uppercase tracking-widest leading-none flex items-center gap-2">
                         Successful Execution
                      </p>
                   </div>
                </div>
             </div>

             {/* Shipping Info */}
             <div className="rounded-2xl border border-gray-100 dark:border-white/5 p-8 bg-white dark:bg-transparent shadow-sm">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-8 flex items-center gap-2"><MapPin size={16}/> Shipping Destination</h3>
                <div className="space-y-2">
                   <p className="text-[15px] font-bold text-gray-900 dark:text-white leading-none mb-2">{order.address?.name}</p>
                   <p className="text-[13px] text-gray-500 leading-relaxed font-medium uppercase tracking-tight">
                      {order.address?.street},<br/>
                      {order.address?.city}, {order.address?.state} {order.address?.pincode}
                   </p>
                   <div className="mt-6 pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Phone Contact</span>
                      <span className="text-[12px] font-bold text-[#7A578D] tracking-[0.2em]">{order.address?.phone}</span>
                   </div>
                </div>
             </div>

             {/* Footer Help */}
             <div className="text-center py-4">
                <Link to="/contact" className="text-[11px] font-bold uppercase tracking-[0.5em] text-gray-300 hover:text-[#7A578D] transition-all decoration-gray-100 underline-offset-[12px] underline">Concierge Support_</Link>
             </div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default OrderSuccessPage;
