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
    <div className="mt-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* ADD TO BAG Button */}
        <button 
          disabled={(product.inventory?.stock || 0) <= 0}
          onClick={handleAddToCart}
          className={`w-full sm:flex-[1.6] bg-[#7A578D] hover:bg-[#6a4a7b] text-white py-4 px-8 rounded-sm flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg shadow-purple-500/20 active:scale-95 ${(product.inventory?.stock || 0) <= 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
          <ShoppingBag size={20} className="mb-0.5" />
          <span className="text-[15px] font-bold uppercase tracking-wider">ADD TO BAG</span>
        </button>

        {/* WISHLIST Button */}
        <button 
          onClick={() => performToggleWishlist(product, primaryPrice, toggleItem, isInWishlist)}
          className={`w-full sm:flex-1 py-4 px-8 border border-gray-300 dark:border-white/10 rounded-sm flex items-center justify-center space-x-3 transition-all duration-300 hover:border-gray-800 dark:hover:border-white active:scale-95 bg-white dark:bg-transparent ${
            isInWishlist(product.id) ? 'bg-gray-50 border-gray-900' : ''
          }`}
        >
          <Heart size={20} className={`${isInWishlist(product.id) ? 'fill-[#7A578D] text-[#7A578D]' : 'text-gray-900 dark:text-gray-100'}`} />
          <span className="text-[15px] font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">WISHLIST</span>
        </button>
      </div>

      <hr className="border-gray-100 dark:border-white/5" />

      {/* DELIVERY info exactly like image 2nd */}
      <div className="space-y-5 pt-2">
        <div className="flex items-start gap-4">
          <div className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-400 mt-0.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div className="text-[15px] font-bold text-gray-800 dark:text-gray-100">
            Get it by Thu, Apr 02
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-400 mt-0.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div className="text-[15px] font-bold text-gray-800 dark:text-gray-100">
            Pay on delivery available
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-400 mt-0.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </div>
          <div className="text-[15px] font-bold text-gray-800 dark:text-gray-100">
            Easy 3 days return & exchange available
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseActions;
