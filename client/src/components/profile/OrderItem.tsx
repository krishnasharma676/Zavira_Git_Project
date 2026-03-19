import { Package, ChevronRight, ExternalLink, RotateCcw, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/format';

interface OrderItemProps {
  order: any;
  getStatusIcon: (status: string) => React.ReactNode;
  onRequestReturn: (orderId: string, orderNumber: string) => void;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'RETURN_REQUESTED': return 'Return Requested';
    case 'RETURNED': return 'Returned';
    default: return status;
  }
};

const OrderItem = ({ order, getStatusIcon, onRequestReturn }: OrderItemProps) => {
  const isDelivered = order.status === 'DELIVERED';
  const isReturnRequested = order.status === 'RETURN_REQUESTED';
  const isReturned = order.status === 'RETURNED';

  return (
    <div className="group bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden hover:border-[#7A578D]/30 transition-all shadow-sm">

      {/* Order Header */}
      <div className="p-4 border-b border-gray-50 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white dark:bg-white/5 rounded-lg shadow-sm flex items-center justify-center text-[#7A578D]">
            <Package size={14} />
          </div>
          <div>
            <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Order Placed</h3>
            <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">{formatDate(order.createdAt)}</p>
          </div>
          <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-white/10 mx-2" />
          <div className="hidden sm:block">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Total</h3>
            <p className="text-[11px] font-bold text-[#7A578D] uppercase tracking-tight">{formatCurrency(order.payableAmount)}</p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
            #{order.orderNumber?.split('-').pop()}
          </span>
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm ${
            isReturnRequested
              ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20 text-orange-600'
              : isReturned
              ? 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500'
              : 'bg-white dark:bg-[#222] border-gray-100 dark:border-white/10'
          }`}>
            {getStatusIcon(order.status)}
            <span className="text-gray-800 dark:text-gray-200">{getStatusLabel(order.status)}</span>
          </div>
        </div>
      </div>

      {/* Return requested banner */}
      {isReturnRequested && (
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50/80 dark:bg-orange-500/5 border-b border-orange-100 dark:border-orange-500/10">
          <AlertTriangle size={11} className="text-orange-400 shrink-0" />
          <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">
            Return request submitted — our team will review it shortly.
          </span>
        </div>
      )}

      {/* Order Items List */}
      <div className="p-4 space-y-3">
        {order.items?.map((item: any) => (
          <div key={item.id} className="flex gap-3 items-start sm:items-center">
            <Link to={`/product/${item.product?.id}`} className="shrink-0 group/img">
              <div className="w-16 h-20 sm:w-20 sm:h-24 bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 relative">
                {item.product?.images?.[0]?.url ? (
                  <img
                    src={item.product.images[0].url}
                    alt={item.product?.name}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-[9px] font-black uppercase">No Image</div>
                )}
                <div className="absolute inset-0 group-hover/img:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                  <ExternalLink size={14} className="text-white bg-black/50 p-1 rounded-full h-6 w-6" />
                </div>
              </div>
            </Link>

            <div className="flex-grow pt-0.5">
              <Link to={`/product/${item.product?.id}`} className="hover:text-[#7A578D] transition-colors">
                <h4 className="text-[11px] sm:text-[12px] font-black uppercase tracking-tight text-gray-900 dark:text-white line-clamp-1 leading-relaxed mb-1.5">
                  {item.product?.name || 'Unknown Product'}
                </h4>
              </Link>
              <div className="flex flex-wrap gap-1.5 text-[9px] sm:text-[10px]">
                {item.selectedSize && (
                  <span className="font-bold text-gray-500 uppercase bg-gray-50 dark:bg-white/5 px-1.5 py-0.5 rounded border border-gray-100 dark:border-white/5">
                    Size: {item.selectedSize}
                  </span>
                )}
                <span className="font-bold text-gray-500 uppercase bg-gray-50 dark:bg-white/5 px-1.5 py-0.5 rounded border border-gray-100 dark:border-white/5">
                  Qty: {item.quantity}
                </span>
              </div>
              <div className="mt-2 font-black text-[#7A578D] text-[11px] sm:text-[12px]">
                {formatCurrency(item.price)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-gray-50 dark:border-white/5 flex items-center justify-between gap-2">
        {/* Return button — only for DELIVERED orders */}
        {isDelivered ? (
          <button
            onClick={() => {
              if (window.confirm('Request a return for this order? Our team will review and process it.')) {
                onRequestReturn(order.id, order.orderNumber || '');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 dark:bg-orange-500/10 text-orange-500 border border-orange-100 dark:border-orange-500/20 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-all"
          >
            <RotateCcw size={11} />
            <span>Return Order</span>
          </button>
        ) : (
          <div /> /* spacer */
        )}

        <Link
          to={`/order-success/${order.id}`}
          className="flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all"
        >
          <span>Track Details</span>
          <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
};

export default OrderItem;
