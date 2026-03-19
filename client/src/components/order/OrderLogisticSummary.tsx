interface OrderLogisticSummaryProps {
  order: any;
}

const OrderLogisticSummary = ({ order }: OrderLogisticSummaryProps) => {
  return (
    <div className="bg-white dark:bg-white/[0.01] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden mt-6 text-left shadow-sm">
      <div className="px-5 py-3 border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-transparent flex justify-between items-center">
        <h3 className="text-[8px] font-black uppercase tracking-[0.2em]">Order Summary</h3>
        <span className="text-[8px] font-black uppercase tracking-widest text-[#7A578D]">Total: ₹{order?.payableAmount.toLocaleString()}</span>
      </div>
      <div className="p-5 space-y-5">
        <div className="flex flex-wrap gap-2">
           {order?.items.map((item: any) => (
              <div key={item.id} className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 shrink-0 bg-gray-50 dark:bg-white/5">
                 <img src={item.product?.images?.[0]?.imageUrl} className="w-full h-full object-cover opacity-80" alt="" />
              </div>
           ))}
        </div>
        <div className="grid grid-cols-3 gap-4 text-[9px]">
           <div className="space-y-2">
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#7A578D]">Delivery Address</p>
              <div className="space-y-0.5 text-gray-400 dark:text-gray-500">
                 <p className="font-bold uppercase text-gray-900 dark:text-gray-300">{order?.address?.name}</p>
                 <p className="italic">{order?.address?.street}, {order?.address?.city}</p>
                 <p className="italic">{order?.address?.state} - {order?.address?.pincode}</p>
                 <p className="pt-1 opacity-60">Date: {new Date(order?.createdAt).toLocaleDateString()}</p>
              </div>
           </div>
           <div className="space-y-2">
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#7A578D]">Payment Details</p>
              <div className="space-y-0.5 text-gray-400 dark:text-gray-500">
                 <p className="font-bold uppercase text-gray-900 dark:text-gray-300">Method: {order?.payment?.paymentMethod}</p>
                 <div className="flex items-center gap-1.5 pt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="font-black uppercase text-[#7A578D]">{order?.payment?.status}</p>
                 </div>
                 {order?.payment?.transactionId && (
                   <p className="text-[7px] opacity-40 break-all pt-1">txn: {order.payment.transactionId.substring(0, 16)}...</p>
                 )}
              </div>
           </div>
           <div className="space-y-2">
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#7A578D]">Delivery Status</p>
              <div className="space-y-0.5 text-gray-400 dark:text-gray-500">
                 <p className="font-bold uppercase text-gray-900 dark:text-gray-300">Status: {order?.shippingStatus || order?.status}</p>
                 {order?.awbNumber ? (
                   <>
                    <p className="italic">AWB: {order.awbNumber}</p>
                    <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="text-[#7A578D] font-black underline underline-offset-2 block mt-1">Track &gt;</a>
                   </>
                 ) : (
                   <p className="italic opacity-60">Processing...</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderLogisticSummary;
