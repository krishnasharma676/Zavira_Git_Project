
import React from 'react';
import { Eye, Clock, Package, CheckCircle, Activity, ExternalLink, Printer, ShoppingBag, User, CreditCard, Truck, FileText, RefreshCw } from 'lucide-react';

interface OrderDetailsModalProps {
  selectedOrder: any;
  isDetailsLoading: boolean;
  isLabelLoading: boolean;
  settings: any;
  handleTriggerShipment: (id: string) => void;
  handleGenerateAWB: (id: string) => void;
  handleCancelShipment: (id: string) => void;
  handleForceDeliver: (id: string) => void;
  handleResetReship: (id: string) => void;
  handleGenerateLabel: (id: string) => void;
  setIsInvoiceOpen: (open: boolean) => void;
  handleNoteUpdate: (id: string, notes: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  selectedOrder,
  isDetailsLoading,
  isLabelLoading,
  settings,
  handleTriggerShipment,
  handleGenerateAWB,
  handleCancelShipment,
  handleForceDeliver,
  handleResetReship,
  handleGenerateLabel,
  setIsInvoiceOpen,
  handleNoteUpdate,
}) => {
  if (!selectedOrder && isDetailsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3 animate-pulse">
        <RefreshCw className="w-10 h-10 text-[#7A578D] animate-spin" />
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#7A578D]">Synchronizing Matrix...</p>
      </div>
    );
  }

  if (!selectedOrder) return null;

  const getTimelineEvents = (order: any) => {
    const events = [];
    events.push({ label: 'Order Created', time: order.createdAt, done: true });
    const isPaymentDone = order.payment?.status === 'COMPLETED';
    events.push({ label: 'Payment Successful', time: isPaymentDone ? order.payment?.updatedAt : null, done: isPaymentDone });
    events.push({ label: 'Shipment Created', time: order.shipmentId ? order.updatedAt : null, done: !!order.shipmentId });
    const shipped = ['SHIPPED', 'DELIVERED'].includes(order.status);
    events.push({ label: 'Shipped', time: shipped ? order.updatedAt : null, done: shipped });
    const delivered = order.status === 'DELIVERED';
    events.push({ label: 'Delivered', time: delivered ? order.updatedAt : null, done: delivered });
    if (order.status === 'CANCELLED') events.push({ label: 'Cancelled', time: order.updatedAt, done: true });
    return events;
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Order Header / Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 border-x border-t border-gray-100 p-4 rounded-t-sm gap-4 shadow-inner">
        <div>
           <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-gray-900 tracking-tighter">
                 ORDER #{selectedOrder.orderNumber.split('-')[2] || selectedOrder.orderNumber}
              </h2>
              <span className={`px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-sm ${
                 selectedOrder.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                 selectedOrder.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                 selectedOrder.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                 'bg-orange-100 text-orange-700 font-black flex items-center gap-2'
              }`}>
                 {selectedOrder.status === 'PENDING' && <Clock size={12} className="animate-pulse" />}
                 {selectedOrder.status}
              </span>
           </div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-2">
              <Clock size={12} /> ARCHIVED ON {new Date(selectedOrder.createdAt).toLocaleString().toUpperCase()}
           </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
            {selectedOrder.status === 'RETURNED' && (
               <button 
                  onClick={() => handleResetReship(selectedOrder.id)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white px-4 py-2 rounded-sm hover:bg-black transition-all shadow-xl shadow-emerald-200 active:scale-95 border-b-2 border-emerald-800/30"
               >
                  <Package size={16} /> RE-SHIP / REPLACE Nexus
               </button>
            )}

            {!selectedOrder.shipmentId && !['CANCELLED', 'REFUNDED', 'SHIPPED', 'DELIVERED', 'RETURNED'].includes(selectedOrder.status) && (
               <button 
                  onClick={() => handleTriggerShipment(selectedOrder.id)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-black text-white px-4 py-2 rounded-sm hover:bg-[#7A578D] transition-all shadow-xl shadow-black/10 active:scale-95 border-b-2 border-black/30"
               >
                  <Package size={16} /> CREATE_SHIPPING_ Nexus
               </button>
            )}

            {selectedOrder.shipmentId && !selectedOrder.awbNumber && (
               <button 
                  onClick={() => handleGenerateAWB(selectedOrder.id)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-[#7A578D] text-white px-4 py-2 rounded-sm hover:bg-black transition-all shadow-xl shadow-[#7A578D]/20 active:scale-95 border-b-2 border-[#7A578D]/30"
               >
                  <Activity size={16} className="animate-pulse" /> GENERATE_AWB_ Nexus
               </button>
            )}

            {selectedOrder.shipmentId && (
               <div className="flex gap-2">
                  <button 
                     onClick={() => handleGenerateLabel(selectedOrder.id)}
                     disabled={isLabelLoading}
                     className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 px-4 py-2 rounded-sm hover:bg-emerald-100 transition-all border border-emerald-100 shadow-sm disabled:opacity-50 active:scale-95"
                  >
                     {isLabelLoading ? <RefreshCw size={16} className="animate-spin" /> : <Printer size={16} />} 
                     FETCH_LABEL
                  </button>

                  <button 
                     onClick={() => handleCancelShipment(selectedOrder.id)}
                     className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 px-4 py-2 rounded-sm hover:bg-red-100 transition-all border border-red-100 shadow-sm active:scale-95"
                  >
                     CANCEL_Nexus
                  </button>
               </div>
            )}

            {settings?.shiprocket_test_mode === 'true' && selectedOrder.status === 'SHIPPED' && (
               <button 
                  onClick={() => handleForceDeliver(selectedOrder.id)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white px-4 py-2 rounded-sm hover:bg-black transition-all shadow-xl shadow-orange-200 active:scale-95 border-b-2 border-orange-700/30"
               >
                  <CheckCircle size={16} /> FORCE DELIVER (TEST)
               </button>
            )}

           <button 
               onClick={() => setIsInvoiceOpen(true)}
               className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-sm hover:bg-gray-50 transition-all shadow-sm active:scale-95"
           >
               <Printer size={16} /> PRINT_BILL_ Nexus
           </button>
        </div>
      </div>

      {/* Logistics Status Hub */}
      <div className="bg-white p-4 rounded-sm border border-gray-100 flex items-center justify-between shadow-sm group hover:border-[#7A578D]/30 transition-all">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-[#7A578D]/5 rounded-sm text-[#7A578D] group-hover:scale-110 transition-transform">
               <Activity size={24} className={selectedOrder.awbNumber ? 'animate-pulse' : ''} />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Logistics Nexus</p>
               <p className="text-xs font-black text-gray-900 uppercase tracking-tighter mt-1">{selectedOrder.shippingStatus || 'AWAITING_LOGISTICS_COMMENCEMENT'}</p>
            </div>
         </div>
         {selectedOrder.awbNumber && (
            <div className="text-right flex flex-col items-end">
               <p className="text-[9px] font-black text-[#7A578D] uppercase tracking-widest mb-1 shadow-sm bg-[#7A578D]/5 px-2 rounded-sm">AWB IDENTIFIER</p>
               <p className="text-sm font-mono font-black text-gray-900 bg-gray-50 px-3 py-1 rounded border border-gray-100">{selectedOrder.awbNumber}</p>
            </div>
         )}
      </div>

      <div className="grid grid-cols-12 gap-4">
         {/* Main Content Area */}
         <div className="col-span-12 lg:col-span-8 space-y-4">
            {/* itemized Ledger */}
            <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm">
               <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                     <ShoppingBag size={16} className="text-[#7A578D]" /> Manifest Archive
                  </h3>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{selectedOrder.items?.length} ENTRIED_ARTIFACTS</span>
               </div>
               <div className="p-4 space-y-3">
                  {selectedOrder.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-sm border border-transparent hover:border-[#7A578D]/10 hover:bg-white transition-all group">
                         <div className="relative">
                            <img src={item.variant?.images?.[0]?.imageUrl || item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/100'} 
                               className="w-12 h-16 object-cover rounded-sm bg-gray-100 shadow-sm group-hover:scale-105 transition-transform" />
                            <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-sm border border-white shadow-lg">
                               {item.quantity}
                            </span>
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-black uppercase text-gray-900 truncate max-w-[400px] mb-1.5 tracking-tighter">{item.product?.name}</h4>
                            <div className="flex flex-wrap gap-2">
                               {item.selectedSize && <span className="text-[9px] font-black text-[#7A578D] bg-[#7A578D]/5 px-2 py-0.5 rounded border border-[#7A578D]/10 uppercase tracking-widest">SIZE: {item.selectedSize}</span>}
                               {(item.variant?.colorCode || item.variant?.colorRel?.hexCode) && (
                                  <div className="flex items-center gap-2 bg-white px-2 py-0.5 rounded border border-gray-100 shadow-sm">
                                     <div 
                                        style={{ backgroundColor: item.variant.colorCode || item.variant?.colorRel?.hexCode }} 
                                        className="w-2.5 h-2.5 rounded-full border border-gray-200 shadow-inner" 
                                     />
                                     <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">CHROMA</span>
                                  </div>
                               )}
                               <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-widest">
                                  SKU: {item.sku || item.variant?.sku || item.product?.inventory?.sku || 'NP'}
                               </span>
                            </div>
                         </div>
                         <div className="text-right min-w-[100px]">
                            <span className="text-sm font-black text-gray-900 block leading-none">₹{(item.price * item.quantity).toLocaleString()}</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 block">UNIT_₹{item.price.toLocaleString()}</span>
                         </div>
                      </div>
                  ))}
               </div>
               
               {/* Financial Breakdown */}
               <div className="bg-gray-50/80 p-6 flex justify-end border-t border-gray-100">
                   <div className="w-80 space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                         <span>Itemized Base Total</span>
                         <span className="text-gray-900">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                      </div>
                      {selectedOrder.discountAmount > 0 && (
                          <div className="flex justify-between items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50/50 px-3 py-1 rounded border border-emerald-100/50">
                             <span className="flex items-center gap-2"><CheckCircle size={12}/> Voucher Deduction</span>
                             <span className="font-bold">-₹{selectedOrder.discountAmount?.toLocaleString()}</span>
                          </div>
                      )}
                      <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                         <span>Logistics Overhead</span>
                         <span className="text-gray-900">₹{selectedOrder.shippingCharges?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center font-black pt-4 text-xl border-t-2 border-gray-200 border-dashed">
                         <span className="text-[10px] text-gray-400 uppercase tracking-[0.3em]">Net Liability</span>
                         <span className="text-[#7A578D] tracking-tighter">₹{selectedOrder.payableAmount?.toLocaleString()}</span>
                      </div>
                   </div>
               </div>
            </div>

            {/* info Cards */}
            <div className="grid grid-cols-2 gap-4">
                {/* Customer Identity */}
                <div className="bg-white p-5 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                   <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D] flex items-center gap-3 mb-4">
                      <User size={16} /> Identitly Profile
                   </h3>
                   <div className="space-y-4">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Nexus Subject</span>
                         <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">{selectedOrder.address?.name}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Digital Mail</span>
                         <span className="text-[10px] font-mono font-bold text-[#7A578D] lowercase flex items-center gap-2 underline underline-offset-4 decoration-[#7A578D]/20">
                            <Mail size={12}/> {selectedOrder.user?.email}
                         </span>
                      </div>
                      <div className="flex flex-col bg-gray-50 p-4 rounded border border-gray-100 shadow-inner">
                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Destination Record</span>
                         <div className="text-[10px] font-bold text-gray-700 uppercase leading-relaxed tracking-tight">
                            <p className="mb-1 text-gray-900 font-black">{selectedOrder.address?.street}</p>
                            <p className="mb-1 text-gray-500">{selectedOrder.address?.area}</p>
                            <p>{selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}</p>
                            {selectedOrder.address?.landmark && (
                               <div className="mt-3 pt-2 border-t border-dashed border-gray-200">
                                  <span className="text-[9px] font-black text-[#7A578D] uppercase tracking-widest italic flex items-center gap-2">
                                     <MapPin size={12}/> Landmark: {selectedOrder.address.landmark}
                                  </span>
                               </div>
                            )}
                         </div>
                      </div>
                      <div className="flex items-center gap-3 bg-emerald-50/30 p-3 rounded border border-emerald-100/50">
                         <Truck size={16} className="text-emerald-700"/>
                         <span className="text-xs font-black text-emerald-800 tracking-widest">{selectedOrder.address?.phone}</span>
                      </div>
                   </div>
                </div>

                {/* Status Timeline */}
                <div className="bg-white p-5 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                   <header className="flex justify-between items-start mb-6">
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D] flex items-center gap-3">
                         <Clock size={16} /> Nexus History
                      </h3>
                      <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Temporal Archives</span>
                   </header>
                   <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 py-2">
                       {getTimelineEvents(selectedOrder).map((event, i) => (
                          <div key={i} className={`pl-6 relative group ${event.done ? 'opacity-100' : 'opacity-20 translate-x-1'}`}>
                             <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1 border-4 border-white shadow-sm transition-all group-hover:scale-125 ${event.done ? 'bg-[#7A578D] shadow-[#7A578D]/30' : 'bg-gray-300'}`} />
                             <div className="flex flex-col">
                                <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${event.done ? 'text-gray-900' : 'text-gray-400'}`}>
                                   {event.label}
                                </span>
                                {event.time && (
                                   <span className="text-[9px] font-black text-gray-400 mt-1.5 flex items-center gap-2 uppercase tracking-tighter">
                                      {new Date(event.time).toLocaleDateString()} / {new Date(event.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                   </span>
                                )}
                             </div>
                          </div>
                       ))}
                   </div>
                </div>
            </div>
         </div>

         {/* Sidebar Area */}
         <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* Financial Metadata */}
            <div className="bg-white p-5 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D] flex items-center gap-3 mb-5">
                  <CreditCard size={16} /> Financial Identity
               </h3>
               <div className="space-y-3">
                   <div className="flex justify-between items-center bg-gray-50 p-3 rounded-sm border border-gray-100 shadow-inner group transition-all hover:bg-white hover:border-[#7A578D]/20">
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-[#7A578D]">Archive Mode</span>
                       <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{selectedOrder.payment?.paymentMethod || 'COD'}</span>
                   </div>
                   <div className="flex justify-between items-center bg-gray-50 p-3 rounded-sm border border-gray-100 shadow-inner group transition-all hover:bg-white hover:border-[#7A578D]/20">
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-[#7A578D]">Identity Source</span>
                       <span className="text-[10px] font-black text-[#7A578D] uppercase tracking-widest">{selectedOrder.payment?.paymentMethod === 'COD' ? 'OFFLINE_CASH' : 'RAZORPAY_Nexus'}</span>
                   </div>
                   {selectedOrder.payment?.transactionId && (
                       <div className="space-y-2 mt-4 pt-4 border-t border-dashed border-gray-100">
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">Universal Asset Reference</span>
                           <div className="relative group/ref">
                              <span className="text-[10px] font-mono font-black text-gray-900 break-all bg-gray-900 border border-black text-gray-100 p-3 rounded-sm block leading-relaxed shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
                                 {selectedOrder.payment.transactionId}
                              </span>
                              <div className="absolute top-1 right-1 opacity-20 text-white">
                                 <Activity size={12}/>
                              </div>
                           </div>
                       </div>
                   )}
               </div>
            </div>

            {/* Logistics Documentation */}
            <div className="bg-white p-5 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D] flex items-center gap-3 mb-5">
                  <Truck size={16} /> Fulfillment Intel
               </h3>
               <div className="space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-gray-400">Carrier Entity</span>
                       <span className="text-gray-900 uppercase text-right border-b border-[#7A578D]/20 pb-0.5">{selectedOrder.courierName || 'IN_QUEUED_Nexus'}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest py-3 border-y border-gray-50 bg-gray-50/30 px-2 rounded">
                       <span className="text-gray-400">Current Node Status</span>
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/30" />
                          <span className="text-emerald-700 font-black text-right uppercase tracking-[0.1em]">{selectedOrder.shippingStatus || 'AWAITING_FULFILLMENT'}</span>
                       </div>
                   </div>
                   <div className="pt-2">
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Master Tracking Identifier</span>
                       <div className="flex items-center justify-between bg-gray-900 border border-black p-3 rounded-sm shadow-xl group transition-all hover:shadow-[#7A578D]/10">
                          <span className="text-[11px] font-mono font-black text-gray-100 tracking-[0.2em] uppercase">
                             {selectedOrder.awbNumber || 'PENDING_INITIALIZATION'}
                          </span>
                          {selectedOrder.trackingUrl && (
                             <a 
                                href={selectedOrder.trackingUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[#7A578D] hover:text-white transition-all p-1.5 bg-white/10 rounded-sm hover:scale-110 active:scale-95 shadow-inner"
                                title="EXTERNAL_Nexus_LINK"
                             >
                                <ExternalLink size={16}/>
                             </a>
                          )}
                       </div>
                   </div>
               </div>
            </div>

            {/* Operations Dossier */}
            <div className="bg-[#7A578D]/5 p-5 rounded-sm border border-[#7A578D]/10 shadow-inner group hover:bg-[#7A578D]/10 transition-all">
               <h3 className="text-[11px] font-black uppercase tracking-widest text-[#7A578D] flex items-center gap-3 mb-4">
                  <FileText size={16} /> Executive Dossier
               </h3>
               <div className="relative group">
                  <textarea 
                     className="w-full bg-white border border-[#7A578D]/20 rounded-sm p-4 text-[11px] font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#7A578D]/20 focus:border-[#7A578D] resize-none shadow-sm placeholder:text-gray-300 italic min-h-[120px] transition-all"
                     placeholder="Structure executive operational narrative..."
                     defaultValue={selectedOrder.adminNotes || ''}
                     onBlur={(e) => {
                       if (e.target.value !== selectedOrder.adminNotes) {
                         handleNoteUpdate(selectedOrder.id, e.target.value);
                       }
                     }}
                  />
                  <div className="absolute bottom-2 right-2 p-1 text-gray-100 group-focus-within:text-[#7A578D]/30 transition-colors pointer-events-none">
                     <Clock size={16}/>
                  </div>
               </div>
               <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2 ml-1 opacity-60">Last updated by administrative nexus participant</p>
            </div>
         </div>
      </div>
    </div>
  );
};

// Mock sub-components for internal layout consistency
const MapPin = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const Mail = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;

export default OrderDetailsModal;
