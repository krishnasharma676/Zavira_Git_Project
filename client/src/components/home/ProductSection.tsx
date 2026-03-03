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
      <div className="flex flex-col items-center mb-6 text-center">
         <h2 className="text-[13px] md:text-[14px] text-gray-900 dark:text-gray-100 uppercase font-black tracking-[0.25em] leading-none">
           {title}
         </h2>
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
