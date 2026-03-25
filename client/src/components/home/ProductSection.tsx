import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../ProductCard';


interface ProductSectionProps {
  title: string;
  products: any[];
  viewAllLink?: string;
  loading?: boolean;
  toggleItem: (item: any) => void;
  isInWishlist: (id: string) => boolean;
  addItem: (item: any) => void;
  hideViewAll?: boolean;
  swipeable?: boolean;
}

const ProductSection = ({ 
  title, 
  products, 
  viewAllLink, 
  loading, 
  toggleItem, 
  isInWishlist, 
  addItem,
  hideViewAll,
  swipeable
}: ProductSectionProps) => {
  if (!loading && products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 mb-12 lg:mb-16">
      <div className="flex flex-col items-center mb-10 text-center relative max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-3 w-full">
           <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#7A578D] to-[#7A578D] opacity-10" />
           <span className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.4em] text-[#7A578D]/80 whitespace-nowrap leading-none">{title}</span>
           <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#7A578D] to-[#7A578D] opacity-10" />
        </div>
        <div className="w-12 h-0.5 bg-[#7A578D] opacity-10 mt-2 rounded-full" />
      </div>




      <div className={swipeable ? "flex overflow-x-auto gap-4 mb-6 pb-6 snap-x snap-mandatory no-scrollbar" : "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"}>
        {products.map((product) => (
          <div key={product._cardKey || product.id} className={swipeable ? "w-[160px] md:w-[240px] flex-shrink-0 snap-start" : ""}>

            <ProductCard 
              product={product} 
              toggleItem={toggleItem} 
              isInWishlist={isInWishlist} 
              addItem={addItem} 
            />
          </div>
        ))}
        {loading && Array(4).fill(0).map((_, i) => (
          <div key={i} className={`aspect-[4/5] bg-gray-200 dark:bg-white/5 animate-pulse rounded-lg ${swipeable ? "w-[160px] md:w-[240px] flex-shrink-0" : ""}`}/>
        ))}
      </div>
      {!hideViewAll && viewAllLink && (
        <div className="flex justify-center mt-12 mb-4">
          <Link 
            to={viewAllLink} 
            className="group relative flex items-center gap-4 px-10 py-3.5 bg-white dark:bg-[#0A0A0A] border border-[#7A578D]/15 hover:border-[#7A578D]/40 transition-all duration-700 rounded-full"
          >
            {/* Hover fill effect */}
            <div className="absolute inset-0 bg-[#7A578D] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 rounded-full" />
            
            <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.4em] text-[#7A578D]/80 group-hover:text-[#7A578D] transition-colors">
              Explore {title}
            </span>
            
            <ArrowRight size={14} className="relative z-10 text-[#7A578D]/60 group-hover:text-[#7A578D] group-hover:translate-x-1 transition-all duration-500" />
          </Link>
        </div>
      )}



    </section>
  );
};

export default ProductSection;
