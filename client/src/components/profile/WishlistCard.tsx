import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/format';

interface WishlistCardProps {
  item: any;
}

const WishlistCard = ({ item }: WishlistCardProps) => {
  return (
    <div className="bg-white dark:bg-white/[0.01] border border-gray-100 dark:border-white/10 p-4 rounded-2xl flex items-center space-x-4">
      <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover bg-gray-50" />
      <div className="flex-1">
        <h4 className="text-[10px] font-black uppercase tracking-wider line-clamp-1">{item.name}</h4>
        <p className="text-[11px] font-black text-[#7A578D] mt-1">{formatCurrency(item.price)}</p>
      </div>
      <Link to={`/product/${item.slug || ''}`} className="text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-[#7A578D]">View</Link>
    </div>
  );
};

export default WishlistCard;
