
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/format';
import { getPrimaryImage } from '../utils/productHelpers';


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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    
    addItem({
      id: product.id,
      variantId: product.currentVariantId,
      name: product.name,
      price: product.discountedPrice || product.basePrice || 0,
      quantity: 1,
      image: primaryImage,
      selectedSize: defaultSize,
      slug: product.slug,
      stock: product.inventory?.stock || 0

    });
    toast.success(`Small Luxury! Added Size: ${defaultSize || 'Unified'}`);
  };



  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.discountedPrice || product.basePrice || 0,
      image: primaryImage,
      slug: product.slug,
      category: product.category?.name || ''
    });
    if (!inWishlist) toast.success('Saved to vault');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="luxury-card group relative flex flex-col h-full bg-white dark:bg-[#121212] rounded-3xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden m-2 rounded-2xl bg-gray-50 dark:bg-black">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {product.hotDeals && (
            <span className="bg-[#ed4c14] text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg flex items-center gap-1">
              <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
              Hot Deal
            </span>
          )}
          {product.discountedPrice && (
            <span className="bg-black dark:bg-white text-white dark:text-black text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg">
              {Math.round(((product.basePrice - product.discountedPrice) / product.basePrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-30 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 transform ${
            inWishlist 
            ? 'bg-[#7A578D] text-white shadow-lg shadow-purple-500/30' 
            : 'bg-white/90 dark:bg-black/40 text-gray-400 hover:text-[#7A578D] hover:scale-110 backdrop-blur-md'
          }`}
        >
          <Heart size={14} className={inWishlist ? 'fill-white' : ''} />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product.slug}`} className="block w-full h-full relative z-10">
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

        {/* Quick Actions for Desktop */}
        {!isOutOfStock && (
          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 hidden md:block">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-white dark:bg-[#7A578D] text-[#7A578D] dark:text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl hover:bg-[#7A578D] hover:text-white transition-all flex flex-col items-center justify-center gap-0.5"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={12} />
                <span>ADD TO BAG</span>
              </div>
              {defaultSize && (
                <span className="text-[7px] opacity-60 font-black">SIZE: {defaultSize}</span>
              )}
            </button>
          </div>
        )}


        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <span className="bg-white/90 px-4 py-1.5 rounded-lg text-black text-[8px] font-extrabold uppercase tracking-widest shadow-xl">Sold Out</span>
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="px-4 pb-4 pt-1 flex-grow flex flex-col justify-between">
        <div>
           <span className="text-[7px] font-black text-[#7A578D] uppercase tracking-widest opacity-60 block mb-0.5">
             {product.category?.name || product.category || 'Collection'}
           </span>
           <div className="flex justify-between items-start gap-2">
              <Link to={`/product/${product.slug}`} className="flex-1">
                <h2 className="text-[11px] font-black uppercase tracking-tight text-gray-800 dark:text-white line-clamp-1 leading-tight group-hover:text-[#7A578D] transition-colors">{product.name}</h2>
              </Link>

              <div className="flex flex-col items-end shrink-0">
                 <span className="text-[12px] font-black text-[#7A578D] tracking-tighter">
                   {formatCurrency(product.discountedPrice || product.basePrice || 0)}
                 </span>
                 {product.discountedPrice && (
                   <span className="text-[7px] text-gray-300 line-through font-bold">
                     {formatCurrency(product.basePrice || 0)}
                   </span>
                 )}
              </div>
           </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          {product.totalReviews > 0 ? (
            <div className="flex items-center space-x-1">
              <Star size={7} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                {(product.avgRating || 0).toFixed(1)}
              </span>
            </div>
          ) : <div />}

          {/* Mobile Quick Add */}
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="md:hidden w-7 h-7 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 active:bg-[#7A578D] active:text-white transition-colors"
          >
            <ShoppingBag size={12} />
          </button>
        </div>
      </div>
    </motion.div>

  );
};

export default ProductCard;
