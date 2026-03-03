import { useCart } from '../store/useCart';
import { useWishlist } from '../store/useWishlist';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import EmptyWishlist from '../components/wishlist/EmptyWishlist';

const WishlistPage = () => {
  const { addItem } = useCart();
  const { items, toggleItem, isInWishlist } = useWishlist();

  if (items.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <div className="bg-[#F9F9F9] dark:bg-[#0D0D0D] pt-8 pb-24 text-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Restored Breadcrumb style, Heading removed */}
        <div className="text-center mb-12">
          <div className="text-[13px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center space-x-3">
             <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
             <span className="opacity-30">/</span>
             <span className="text-gray-900 dark:text-gray-200">Wishlist</span>
          </div>
        </div>

        {/* Product Grid - Standardized with Home page */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              toggleItem={toggleItem}
              isInWishlist={isInWishlist}
              addItem={addItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;


