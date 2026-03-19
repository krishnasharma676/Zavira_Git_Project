import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { 
  Package, 
  CheckCircle, 
  Truck, 
  MapPin, 
  CreditCard, 
  ArrowLeft,
  ChevronRight,
  RotateCcw,
  XCircle,
  ExternalLink,
  Receipt
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/format';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data);
      } catch {
        // error handling handled by interceptor typically
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0A]">
        <div className="w-12 h-12 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0A]">
         <div className="text-center space-y-4">
            <h2 className="text-xl font-black uppercase text-gray-900 dark:text-white tracking-widest">Order Not Found</h2>
            <Link to="/profile" className="text-[#7A578D] font-bold underline flex items-center justify-center gap-1"><ArrowLeft size={16}/> Back to Profile</Link>
         </div>
      </div>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING': return { title: 'Order Placed', desc: 'Waiting for confirmation', icon: <Package size={32} />, color: 'text-orange-500', bg: 'bg-orange-500' };
      case 'CONFIRMED': return { title: 'Order Confirmed', desc: 'We are packing your items', icon: <CheckCircle size={32} />, color: 'text-indigo-500', bg: 'bg-indigo-500' };
      case 'SHIPPED': return { title: 'On Its Way', desc: 'Your order has been shipped', icon: <Truck size={32} />, color: 'text-blue-500', bg: 'bg-blue-500' };
      case 'DELIVERED': return { title: 'Delivered', desc: 'Enjoy your Zaviraa experience', icon: <MapPin size={32} />, color: 'text-green-500', bg: 'bg-green-500' };
      case 'RETURN_REQUESTED': return { title: 'Return Requested', desc: 'We are reviewing your request', icon: <RotateCcw size={32} />, color: 'text-orange-500', bg: 'bg-orange-500' };
      case 'RETURNED': return { title: 'Refund Processed', desc: 'Order has been returned successfully', icon: <RotateCcw size={32} />, color: 'text-gray-500', bg: 'bg-gray-500' };
      case 'CANCELLED': return { title: 'Cancelled', desc: 'This order was cancelled', icon: <XCircle size={32} />, color: 'text-red-500', bg: 'bg-red-500' };
      default: return { title: 'Order Placed', desc: 'Processing...', icon: <Package size={32} />, color: 'text-gray-500', bg: 'bg-gray-500' };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  // Timeline Progress calculation
  const timelineSteps = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  let currentStepIndex = timelineSteps.indexOf(order.status);
  
  // if canceled or returned, don't show normal flowing progress usually, but we'll adapt:
  const isAbnormal = ['CANCELLED', 'RETURN_REQUESTED', 'RETURNED'].includes(order.status);
  if (isAbnormal) {
    currentStepIndex = -1; // disable timeline fill
  }

  return (
    <div className="bg-gray-50 dark:bg-[#0A0A0A] pt-[100px] pb-20 text-gray-900 dark:text-white min-h-screen font-sans selection:bg-[#7A578D] selection:text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Top Header Navigation */}
        <div className="mb-6 flex justify-between items-center">
            <Link to="/profile" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#7A578D] hover:text-gray-900 dark:hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#7A578D]/10 flex items-center justify-center">
                 <ArrowLeft size={14} />
              </div>
              Back to Profile
            </Link>
            <div className="text-right">
               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Order Reference</p>
               <p className="text-[12px] font-black uppercase tracking-widest text-gray-900 dark:text-white">#{order.orderNumber?.split('-').pop()}</p>
            </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Status Banner Card */}
          <div className="bg-white dark:bg-[#111] rounded-3xl p-8 sm:p-10 border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#7A578D]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
             
             <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
                <div className={`w-20 h-20 shrink-0 rounded-full flex items-center justify-center text-white shadow-lg ${statusInfo.bg} shadow-${statusInfo.bg.split('-')[1]}-500/30`}>
                   {statusInfo.icon}
                </div>
                <div className="flex-1 space-y-1.5 pt-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7A578D]">Delivery Status</p>
                   <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">{statusInfo.title}</h1>
                   <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{statusInfo.desc}</p>
                </div>
             </div>

             {/* Progress Timeline (Only show if not returned/cancelled) */}
             {!isAbnormal && (
               <div className="mt-12 relative w-full max-w-2xl mx-auto sm:mx-0">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 dark:bg-white/5 -translate-y-1/2 rounded-full z-0" />
                  
                  {/* Active Line Fill */}
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-[#7A578D] -translate-y-1/2 rounded-full z-0 transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.max(0, (currentStepIndex / (timelineSteps.length - 1)) * 100)}%` }}
                  />

                  <div className="relative z-10 flex justify-between">
                     {timelineSteps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        return (
                          <div key={step} className="flex flex-col items-center gap-3">
                            <motion.div 
                              initial={false}
                              animate={isCompleted ? { scale: [1, 1.2, 1] } : {}}
                              className={`w-6 h-6 rounded-full flex items-center justify-center border-[3px] transition-colors duration-500
                                ${isCompleted ? 'bg-[#7A578D] border-white dark:border-[#111] shadow-[0_0_0_4px_rgba(122,87,141,0.2)]' : 'bg-white dark:bg-[#111] border-gray-200 dark:border-white/10'}`}
                            >
                                {isCompleted && <CheckCircle size={10} className="text-white" />}
                            </motion.div>
                            <span className={`text-[9px] font-black uppercase tracking-widest absolute mt-9 text-center w-24 -ml-9
                               ${isCurrent ? 'text-[#7A578D]' : isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}
                            >
                               {step}
                            </span>
                          </div>
                        )
                     })}
                  </div>
               </div>
             )}

             {isAbnormal && (
                <div className={`mt-8 p-4 rounded-xl border flex items-start gap-3 text-left ${
                    order.status === 'CANCELLED' ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 text-red-600' :
                    'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20 text-orange-600'
                }`}>
                    <RotateCcw size={16} className="mt-0.5 shrink-0" />
                    <div>
                       <h4 className="text-[11px] font-black uppercase tracking-widest mb-1">Status Update</h4>
                       <p className="text-[10px] font-bold opacity-80 leading-relaxed uppercase">
                          {order.status === 'CANCELLED' ? 'This order has been cancelled and will not be fulfilled.' :
                           order.status === 'RETURNED' ? 'Your return request has been approved and refund processed.' :
                           'Your return request is currently under review by our team.'}
                       </p>
                    </div>
                </div>
             )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Items */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-sm">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A578D] flex items-center gap-2 mb-6">
                      <Package size={14} /> Item Details
                   </h3>
                   
                   <div className="space-y-6">
                     {order.items?.map((item: any) => (
                       <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 group hover:border-[#7A578D]/30 transition-colors">
                          <Link to={`/product/${item.product?.id}`} className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 relative">
                             {item.product?.images?.[0]?.url ? (
                                <img src={item.product.images[0].url} alt={item.product?.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] font-black uppercase text-gray-400">No Img</div>
                             )}
                          </Link>
                          
                          <div className="flex-1 flex flex-col justify-center">
                             <Link to={`/product/${item.product?.id}`} className="hover:text-[#7A578D] transition-colors">
                                <h4 className="text-[11px] sm:text-[13px] font-black uppercase tracking-tight text-gray-900 dark:text-white line-clamp-2 leading-relaxed mb-1.5">
                                   {item.product?.name || 'Unknown Item'}
                                </h4>
                             </Link>
                             <div className="flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                                {item.selectedSize && <span className="px-2 py-1 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded">Size: {item.selectedSize}</span>}
                                <span className="px-2 py-1 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded">Qty: {item.quantity}</span>
                             </div>
                             <div className="text-[12px] sm:text-[14px] font-black text-[#7A578D]">
                                {formatCurrency(item.price)}
                             </div>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Shipping Info (Tracking) */}
                {order.shippingStatus && (
                  <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A578D] flex items-center gap-2 mb-6">
                        <Truck size={14} /> Shipping Details
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 text-center sm:text-left">
                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Delivery Partner</p>
                            <p className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white truncate">
                              {order.courierName || 'Assigning...'}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 text-center sm:text-left relative">
                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Tracking Number</p>
                            <p className="text-[11px] font-black uppercase tracking-widest text-[#7A578D] truncate">
                              {order.awbNumber || 'Waiting for update...'}
                            </p>
                            {order.trackingUrl && (
                               <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="absolute top-4 right-4 text-gray-400 hover:text-[#7A578D] transition-colors">
                                  <ExternalLink size={14}/>
                               </a>
                            )}
                        </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Right Column: Summaries */}
            <div className="space-y-6">
                {/* Financial Summary */}
                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A578D] flex items-center gap-2 mb-6">
                        <Receipt size={14} /> Order Summary
                    </h3>
                    
                    <div className="space-y-4 text-[10px] font-black uppercase tracking-widest">
                        <div className="flex justify-between items-center text-gray-500">
                           <span>Subtotal</span>
                           <span className="text-gray-900 dark:text-white">{formatCurrency(order.totalAmount)}</span>
                        </div>
                        {order.discountAmount > 0 && (
                            <div className="flex justify-between items-center text-green-500">
                               <span>Discount</span>
                               <span>-{formatCurrency(order.discountAmount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-gray-500">
                           <span>Shipping</span>
                           <span className="text-gray-900 dark:text-white">{order.shippingCharges === 0 ? 'FREE' : formatCurrency(order.shippingCharges)}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-500 pb-4 border-b border-gray-100 dark:border-white/10">
                           <span>Tax</span>
                           <span className="text-gray-900 dark:text-white">{formatCurrency(order.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[12px] pt-1">
                           <span className="text-gray-900 dark:text-gray-300">Total</span>
                           <span className="text-[#7A578D] text-[14px]">{formatCurrency(order.payableAmount)}</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <CreditCard size={14} className="text-[#7A578D]" />
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Payment Mode</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-900 dark:text-white">
                                {order.payment?.paymentMethod || 'COD'}
                            </p>
                          </div>
                       </div>
                       <div className="text-right">
                           <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Status</p>
                           <p className="text-[9px] font-black uppercase tracking-widest text-green-500">
                               {order.payment?.status || 'PENDING'}
                           </p>
                       </div>
                    </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A578D] flex items-center gap-2 mb-5">
                        <MapPin size={14} /> Delivery Address
                    </h3>
                    <div className="space-y-1.5 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                       <p className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white mb-2">{order.address?.name}</p>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 leading-relaxed shadow-sm">
                          {order.address?.street}<br/>
                          {order.address?.city}, {order.address?.state}<br/>
                          {order.address?.pincode}
                       </p>
                       <p className="text-[9px] font-black uppercase tracking-widest text-[#7A578D] mt-3 border-t border-gray-200 dark:border-white/10 pt-3">
                          Ph: {order.address?.phone}
                       </p>
                    </div>
                </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
