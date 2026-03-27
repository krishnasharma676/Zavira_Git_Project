import { ShoppingBag, Heart } from 'lucide-react';
import { performToggleWishlist } from '../../utils/wishlistHelpers';

interface PurchaseActionsProps {
  product: any;
  quantity: number;
  setQuantity: (quantity: number | ((q: number) => number)) => void;
  handleAddToCart: () => void;
  toggleItem: (item: any) => void;
  isInWishlist: (id: string) => boolean;
  primaryPrice: number;
  toast: any;
}

const PurchaseActions = ({ product, quantity, setQuantity, handleAddToCart, toggleItem, isInWishlist, primaryPrice, toast }: PurchaseActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
      <div className="flex items-center border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] rounded-xl overflow-hidden shrink-0">
        <button onClick={() => setQuantity((q: number) => Math.max(1, q - 1))} className="px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border-r border-gray-100 dark:border-white/5 text-gray-700 dark:text-gray-300 font-bold">-</button>
        <span className="px-5 text-sm font-black text-gray-900 dark:text-white">{quantity}</span>
        <button 
          onClick={() => {
              const stock = product.inventory?.stock || 0;
              if (quantity < stock) {
                  setQuantity((q: number) => q + 1);
              } else {
                  toast.error("Maximum stock level reached");
              }
          }} 
          className="px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border-l border-gray-100 dark:border-white/5 text-gray-700 dark:text-gray-300 font-bold"
        >
          +
        </button>
      </div>
      
      <button 
        disabled={(product.inventory?.stock || 0) <= 0}
        onClick={handleAddToCart}
        className={`flex-grow luxury-button rounded-xl flex items-center justify-center space-x-3 ${(product.inventory?.stock || 0) <= 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
      >
          <ShoppingBag size={14} className="mr-2" />
          <span>{(product.inventory?.stock || 0) <= 0 ? 'OUT OF STOCK' : 'Add To Cart'}</span>
        </button>
        <button 
          onClick={() => performToggleWishlist(product, primaryPrice, toggleItem, isInWishlist)}
          className={`p-3.5 border rounded-xl transition-all shadow-sm flex items-center justify-center ${
            isInWishlist(product.id)
              ? 'bg-[#7A578D] border-[#7A578D] text-white'
              : 'border-gray-100 dark:border-white/10 text-gray-400 dark:text-gray-500 hover:text-[#7A578D] dark:hover:text-[#7A578D] hover:border-[#7A578D] dark:hover:border-[#7A578D]'
          }`}
        >
          <Heart size={18} className={isInWishlist(product.id) ? 'fill-white' : ''} />
        </button>
      </div>
  );
};

export default PurchaseActions;
