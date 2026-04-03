
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/format';
import { getPrimaryImage } from '../utils/productHelpers';
import api from '../api/axios';
import { performToggleWishlist } from '../utils/wishlistHelpers';


interface ProductCardProps {
  product: any;
  toggleItem: (product: any) => void;
  isInWishlist: (id: string) => boolean;
  addItem: (item: any) => void;
}

const ProductCard = ({ product, toggleItem, isInWishlist, addItem }: ProductCardProps) => {
  const primaryImage = getPrimaryImage(product, 'https://via.placeholder.com/400');


  const isOutOfStock = product.inventory && product.inventory.stock <= 0;
  const inWishlist = isInWishlist(product.id);

  const availableSizes = (product.currentVariantSizes?.length > 0)
    ? product.currentVariantSizes.map((s: any) => s.size)
    : (product.variants?.[0]?.sizes?.length > 0)
    ? product.variants[0].sizes.map((s: any) => s.size)
    : (product.sizes ? product.sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
  
  const defaultSize = availableSizes[0];




  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    performToggleWishlist(product, 0, toggleItem, isInWishlist);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col h-full bg-white dark:bg-[#121212] transition-all duration-300 hover:shadow-lg rounded-md overflow-hidden"
    >
      {/* Image Container - Flush with Top and Sides */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 dark:bg-black">
        {/* Top Badges (Optional alternative to new style, keeping for consistency if needed) */}
        {/* We keep only top-left Hot Deals if needed, removing the top-left percentage since it moves to bottom */}
        {product.hotDeals && (
          <div className="absolute top-3 left-3 z-20">
            <span className="bg-[#A65B69] text-white text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm">
              Hot Selling
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            inWishlist 
            ? 'bg-[#7A578D] text-white shadow-lg shadow-purple-500/30' 
            : 'bg-white/80 dark:bg-black/40 text-gray-400 hover:text-[#7A578D] hover:scale-110 backdrop-blur-md'
          }`}
        >
          <Heart size={16} className={inWishlist ? 'fill-white' : ''} />
        </button>

        {/* Product Image */}
        <Link 
          to={`/product/${product.slug}`} 
          state={{ product }} 
          className="block w-full h-full relative z-10"
        >
          <img 
            src={primaryImage} 
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
          />
          {/* Subtle Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        </Link>

        {/* Rating Badge Overlay at Bottom Left */}
        <div className="absolute bottom-3 left-3 z-20">
          <div className="bg-white/95 backdrop-blur-sm text-black flex items-center gap-1.5 px-2 py-1 rounded-sm shadow-sm text-[11px] font-bold">
            <span>{product.avgRating ? product.avgRating.toFixed(1) : "0.0"}</span>
            <Star size={10} className="fill-[#009688] text-[#009688] -mt-[1px]" />
            <span className="text-gray-300 font-normal">|</span>
            <span>{product.totalReviews || "0"}</span>
          </div>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-20 flex items-center justify-center">
            <span className="bg-white/90 px-5 py-2 rounded-lg text-black text-[10px] font-bold uppercase tracking-widest shadow-xl">Sold Out</span>
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="pt-3 pb-4 px-2 flex flex-col flex-grow">
        <div className="mb-1">
          <Link to={`/product/${product.slug}`} state={{ product }}>
            <h2 className="text-[13px] md:text-[14px] font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-[#7A578D] transition-colors leading-snug">
              {product.name}
            </h2>
          </Link>
        </div>

        <div className="flex items-center flex-wrap gap-1.5 mt-1">
          <span className="text-[14px] font-bold text-gray-900 dark:text-white">
            {formatCurrency(product.discountedPrice || product.basePrice || 0).replace('₹', 'Rs. ')}
          </span>
          {product.discountedPrice && (
            <>
              <span className="text-[12px] text-gray-400 line-through">
                {formatCurrency(product.basePrice || 0).replace('₹', 'Rs. ')}
              </span>
              <span className="text-[11px] font-bold text-[#FF8E6E] ml-1">
                ({Math.round(((product.basePrice - product.discountedPrice) / product.basePrice) * 100)}% OFF)
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
