
import React from 'react';

interface OrderDetailsExpandedProps {
  order: any;
  columnsLength: number;
}

const OrderDetailsExpanded: React.FC<OrderDetailsExpandedProps> = ({
  order,
  columnsLength,
}) => {
  if (!order) return null;

  return (
    <tr className="bg-gray-50/50">
      <td colSpan={columnsLength + 1} className="p-0 border-b border-gray-100">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-300">
          {/* Identity & Metadata */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D]">Identity Profile</h3>
             <div className="space-y-4 pl-6 border-l-2 border-[#7A578D]/20">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Internal ID</span>
                   <span className="text-[10px] font-mono font-black text-gray-900 tracking-tighter truncate max-w-[120px]" title={order.id}>{order.id}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nexus Entry</span>
                   <span className="text-xs font-black text-gray-900 uppercase">
                      {new Date(order.createdAt).toLocaleDateString()}
                      <span className="text-[9px] text-gray-400 ml-2">{new Date(order.createdAt).toLocaleTimeString()}</span>
                   </span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Digital Mail</span>
                   <span className="text-[10px] font-mono font-black text-[#7A578D] lowercase truncate max-w-[150px]">{order.user?.email || 'N/A'}</span>
                </div>
             </div>
          </div>

          {/* Financial Protocol */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D]">Financial Protocol</h3>
             <div className="space-y-4 pl-6 border-l-2 border-[#7A578D]/20">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Liability</span>
                   <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">₹{order.payableAmount?.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payment Method</span>
                   <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border w-fit ${order.paymentMethod === 'ONLINE' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                      {order.paymentMethod} - {order.payment?.status || 'PENDING'}
                   </span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Transaction Ref</span>
                   <span className="text-[10px] font-mono font-black text-gray-900 truncate max-w-[120px]" title={order.payment?.transactionId}>{order.payment?.transactionId || 'N/A'}</span>
                </div>
             </div>
          </div>

          {/* Logistics Nexus */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D]">Logistics Nexus</h3>
             <div className="space-y-4 pl-6 border-l-2 border-[#7A578D]/20">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tracking / AWB</span>
                   <span className={`text-[10px] font-mono font-black tracking-widest ${order.awbNumber ? 'text-gray-900' : 'text-gray-300 italic'}`}>
                      {order.awbNumber || 'NOT_SHIPPED_YET'}
                   </span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Courier Partner</span>
                   <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">
                      {order.courierName || 'In Processing Nexus'}
                   </span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Fulfillment State</span>
                   <div className="flex items-center gap-2 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'DELIVERED' ? 'bg-emerald-500 shadow-emerald-500/30 shadow-lg' : order.status === 'SHIPPED' ? 'bg-blue-500 shadow-blue-500/30 shadow-lg' : 'bg-orange-500 shadow-orange-500/30 shadow-lg animate-pulse'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'text-emerald-700' : order.status === 'SHIPPED' ? 'text-blue-700' : 'text-orange-700'}`}>
                         {order.status}
                      </span>
                   </div>
                </div>
             </div>
          </div>

          {/* Destination Archive */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D]">Destination Archive</h3>
             <div className="p-4 bg-white border border-gray-100 rounded-sm shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-gray-50 group-hover:text-gray-100 transition-colors pointer-events-none">
                   <span className="text-3xl font-black opacity-20 uppercase tracking-tighter">ADDRESS</span>
                </div>
                <p className="text-[10px] font-bold text-gray-800 leading-relaxed uppercase tracking-tighter relative z-10">
                   {order.address?.street}, {order.address?.area}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                </p>
                {order.address?.landmark && (
                  <div className="mt-2 pt-2 border-t border-dashed border-gray-100">
                     <span className="text-[8px] font-black text-[#7A578D] uppercase tracking-widest italic opacity-70">
                        LANDMARK: {order.address.landmark}
                     </span>
                  </div>
                )}
             </div>
          </div>

          {/* Narrative / Items Ledger */}
          <div className="md:col-span-4 mt-2 space-y-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" /> Narrative Artifact Ledger <div className="h-px flex-1 bg-gray-200" />
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-sm shadow-sm hover:shadow-md transition-shadow group">
                     <div className="relative">
                        <img 
                           src={item.variant?.images?.[0]?.imageUrl || item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/100'} 
                           className="w-12 h-16 object-cover rounded-sm shadow-sm border border-gray-100 group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-sm border border-white shadow-lg">
                           {item.quantity}
                        </span>
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-black text-gray-900 uppercase truncate mb-1 tracking-tighter" title={item.product?.name}>
                           {item.product?.name}
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                           <span className="text-[8px] font-black text-[#7A578D] bg-[#7A578D]/5 px-2 py-0.5 rounded-full border border-[#7A578D]/10">
                              SIZE: {item.selectedSize || 'UNIT'}
                           </span>
                           <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                              SKU: {item.sku || 'N/A'}
                           </span>
                        </div>
                        <div className="mt-2 text-[11px] font-black text-gray-900 tracking-tighter">
                           ₹{item.price.toLocaleString()}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Internal Nexus Notes */}
          <div className="md:col-span-4 mt-2">
             <div className="p-4 bg-gray-100/50 border border-gray-200 rounded-sm">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Executive Nexus Notes</span>
                <p className="text-[10px] font-bold text-gray-700 italic leading-relaxed">
                   {order.adminNotes || 'No executive narrative archive provided for this transaction.'}
                </p>
             </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default OrderDetailsExpanded;
