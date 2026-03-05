import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';

interface ProductSectionProps {
  title: string;
  products: any[];
  viewAllLink: string;
  loading?: boolean;
  toggleItem: (item: any) => void;
  isInWishlist: (id: string) => boolean;
  addItem: (item: any) => void;
}

const ProductSection = ({ 
  title, 
  products, 
  viewAllLink, 
  loading, 
  toggleItem, 
  isInWishlist, 
  addItem 
}: ProductSectionProps) => {
  if (!loading && products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 mb-12 lg:mb-16">
      <div className="flex flex-col items-center mb-10 text-center relative">
        <div className="flex items-center gap-6 mb-3 w-full">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#7A578D] to-[#7A578D] opacity-20" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#7A578D] whitespace-nowrap">The Collection</span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#7A578D] to-[#7A578D] opacity-20" />
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-gray-900 dark:text-white tracking-tight leading-none mb-1">
          {title}
        </h2>
        <div className="w-12 h-0.5 bg-[#7A578D] opacity-20 mt-4 rounded-full" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard 
            key={product.id}
            product={product} 
            toggleItem={toggleItem} 
            isInWishlist={isInWishlist} 
            addItem={addItem} 
          />
        ))}
        {loading && Array(4).fill(0).map((_, i) => (
          <div key={i} className="aspect-[4/5] bg-gray-200 dark:bg-white/5 animate-pulse rounded-lg"/>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Link to={viewAllLink} className="luxury-button rounded-full py-2 px-6 text-[10px]">
          VIEW ALL
        </Link>
      </div>
    </section>
  );
};

export default ProductSection;
