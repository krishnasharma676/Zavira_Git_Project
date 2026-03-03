interface OrderLogisticSummaryProps {
  order: any;
}

const OrderLogisticSummary = ({ order }: OrderLogisticSummaryProps) => {
  return (
    <div className="bg-white dark:bg-white/[0.01] border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden mt-12 text-left shadow-sm">
      <div className="p-6 border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-transparent flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Logistic Summary</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#7A578D]">Valuation: ₹{order?.payableAmount.toLocaleString()}</span>
      </div>
      <div className="p-8 space-y-8">
        <div className="flex flex-wrap gap-4">
           {order?.items.map((item: any) => (
              <div key={item.id} className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 shrink-0 bg-gray-50 dark:bg-white/5">
                 <img src={item.product?.images?.[0]?.imageUrl} className="w-full h-full object-cover" alt="" />
              </div>
           ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8 text-[11px]">
           <div className="space-y-4">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Shipping Node</p>
              <div className="space-y-1">
                 <p className="font-black uppercase">{order?.address?.name}</p>
                 <p className="text-gray-500 font-medium italic">{order?.address?.street}, {order?.address?.city}</p>
                 <p className="text-gray-500 font-medium italic">{order?.address?.state} - {order?.address?.pincode}</p>
              </div>
           </div>
           <div className="space-y-4">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Financial Protocol</p>
              <div className="space-y-1">
                 <p className="font-black uppercase">Method: {order?.payment?.paymentMethod}</p>
                 <p className="font-black uppercase text-[#7A578D]">Status: {order?.payment?.status}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderLogisticSummary;
