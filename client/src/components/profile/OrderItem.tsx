import { Package, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/format';

interface OrderItemProps {
  order: any;
  getStatusIcon: (status: string) => React.ReactNode;
}

const OrderItem = ({ order, getStatusIcon }: OrderItemProps) => {
  return (
    <div className="group bg-white dark:bg-white/[0.01] border border-gray-100 dark:border-white/10 p-5 rounded-2xl hover:border-[#7A578D]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center space-x-5">
        <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#7A578D] transition-colors">
          <Package size={20} className="text-[#7A578D] group-hover:text-white transition-colors" />
        </div>
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.1em]">{order.orderNumber}</h3>
          <div className="flex items-center space-x-3 mt-1 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
            <span>{formatDate(order.createdAt)}</span>
            <span>•</span>
            <span>{order.items.length} Items</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
        <p className="text-[13px] font-black text-gray-900 dark:text-white tracking-widest">{formatCurrency(order.payableAmount)}</p>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] bg-gray-50 dark:bg-white/5`}>
          {getStatusIcon(order.status)}
          <span>{order.status}</span>
        </div>
      </div>
      <div className="hidden md:block">
        <Link to={`/order-success/${order.id}`} className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-xl transition-all block">
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default OrderItem;
