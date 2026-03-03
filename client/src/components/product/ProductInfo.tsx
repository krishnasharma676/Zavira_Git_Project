import { Star } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import PurchaseActions from './PurchaseActions';
import LuxuryBadges from './LuxuryBadges';

interface ProductInfoProps {
  product: any;
  quantity: number;
  setQuantity: (quantity: number | ((q: number) => number)) => void;
  handleAddToCart: () => void;
  toggleItem: (item: any) => void;
  isInWishlist: (id: string) => boolean;
  toast: any;
}

const ProductInfo = ({ product, quantity, setQuantity, handleAddToCart, toggleItem, isInWishlist, toast }: ProductInfoProps) => {
  const primaryPrice = product.discountedPrice || product.basePrice;

  return (
    <div>
      <div className="mb-6">
        <p className="text-[#7A578D] uppercase tracking-[0.4em] text-[10px] mb-2 font-black">{product.category?.name || 'Jewelry'}</p>
        <h1 className="text-2xl lg:text-3xl font-sans font-black uppercase tracking-tight mb-3 leading-tight text-gray-900 dark:text-white">{product.name}</h1>
        
        <div className="flex items-center space-x-6 mb-4 text-[11px] font-bold uppercase tracking-widest">
          <div className="flex items-center text-yellow-500">
            <Star size={13} fill="currentColor" />
            <span className="ml-2 text-gray-900 dark:text-gray-200 font-semibold">4.8</span>
          </div>
          <span className="text-gray-400 font-light lowercase">|</span>
          <span className="text-gray-500 font-light lowercase italic tracking-wide">{product.reviews?.length || 0} verified reviews</span>
        </div>

        <div className="flex items-baseline space-x-4 mb-6">
          {product.discountedPrice ? (
            <>
              <span className="text-2xl text-gray-900 dark:text-white font-black">{formatCurrency(product.discountedPrice)}</span>
              <span className="text-sm text-gray-400 dark:text-gray-500 line-through">{formatCurrency(product.basePrice || 0)}</span>
              <div className="bg-[#7A578D] text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase ml-2">Sale</div>
            </>
          ) : (
            <span className="text-2xl text-gray-900 dark:text-white font-black">{formatCurrency(product.basePrice || 0)}</span>
          )}
        </div>

        <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium mb-6 text-xs max-w-lg">
          {product.description}
        </p>

        <PurchaseActions 
          product={product} 
          quantity={quantity} 
          setQuantity={setQuantity} 
          handleAddToCart={handleAddToCart} 
          toggleItem={toggleItem} 
          isInWishlist={isInWishlist} 
          primaryPrice={primaryPrice} 
          toast={toast} 
        />

        <LuxuryBadges />
      </div>
    </div>
  );
};

export default ProductInfo;

