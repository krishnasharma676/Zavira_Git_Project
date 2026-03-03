import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/format';

interface ProductCardProps {
  product: any;
  toggleItem: (product: any) => void;
  isInWishlist: (id: string) => boolean;
  addItem: (item: any) => void;
}

const ProductCard = ({ product, toggleItem, isInWishlist, addItem }: ProductCardProps) => {
  const primaryImage = product.images?.find((img: any) => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || 'https://via.placeholder.com/400';
  const isOutOfStock = product.inventory && product.inventory.stock <= 0;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountedPrice || product.basePrice || 0,
      quantity: 1,
      image: primaryImage,
      stock: product.inventory?.stock || 0
    });
    toast.success('Added to your collection!');
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
      className="luxury-card group flex flex-col h-full bg-white dark:bg-[#121212]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 dark:bg-black">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {product.featured && (
            <span className="bg-[#7A578D] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-purple-500/20">
              Featured
            </span>
          )}
          {product.discountedPrice && (
            <span className="bg-black dark:bg-white text-white dark:text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              {Math.round(((product.basePrice - product.discountedPrice) / product.basePrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/20 shadow-xl ${
            inWishlist 
            ? 'bg-[#7A578D] text-white border-[#7A578D]' 
            : 'bg-white/80 dark:bg-black/50 text-gray-400 hover:text-[#7A578D]'
          }`}
        >
          <Heart size={16} className={inWishlist ? 'fill-white' : ''} />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img 
            src={primaryImage} 
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>

        {/* Quick Add Overlay */}
        {!isOutOfStock && (
          <div className="absolute bottom-6 left-6 right-6 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
            <button 
              onClick={handleAddToCart}
              className="luxury-button w-full rounded-xl flex items-center justify-center space-x-3"
            >
              <ShoppingBag size={14} />
              <span>ADD TO VAULT</span>
            </button>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="border border-white/30 px-6 py-2 rounded-full">
              <span className="text-white text-[10px] font-black uppercase tracking-[0.3em] font-sans">Sold Out</span>
            </div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3 flex-grow flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex justify-between items-start gap-2">
            <Link to={`/product/${product.slug}`} className="flex-1">
              <h2 className="text-[12px] font-black uppercase tracking-tight text-gray-900 dark:text-white line-clamp-1">{product.name}</h2>
            </Link>
            
            <div className="flex items-center space-x-1.5 shrink-0 pt-0.5">
              <span className="text-[13px] font-black text-[#7A578D]">{formatCurrency(product.discountedPrice || product.basePrice || 0)}</span>
              {product.discountedPrice && (
                <span className="text-[9px] text-gray-300 line-through">{formatCurrency(product.basePrice || 0)}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-1 border-t border-gray-50 dark:border-white/5">
             {product.avgRating > 0 && (
                <div className="flex items-center space-x-1">
                   <div className="flex">
                     {[...Array(5)].map((_, i) => (
                       <Star 
                         key={i} 
                         size={6} 
                         className={i < Math.floor(product.avgRating) ? 'fill-[#7A578D] text-[#7A578D]' : 'text-gray-100 dark:text-gray-800'} 
                       />
                     ))}
                   </div>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.avgRating.toFixed(1)}</span>
                </div>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
