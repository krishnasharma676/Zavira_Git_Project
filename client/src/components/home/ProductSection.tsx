import React from 'react';
import { motion } from 'framer-motion';
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
  limit?: number;
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
  swipeable,
  limit
}: ProductSectionProps) => {
  if (!loading && products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 mb-8 lg:mb-10">

      {/* Section Heading — Decorated Center */}
      <div className="flex items-center justify-center gap-4 mb-8 max-w-4xl mx-auto">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#7A578D]/30" />
        <h2 className="text-[15px] md:text-[18px] font-black tracking-[0.2em] uppercase text-gray-900 dark:text-white whitespace-nowrap px-2">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#7A578D]/30" />
      </div>

      {/* Product Grid */}
      <div className={swipeable ? "flex overflow-x-auto gap-4 mb-6 pb-6 snap-x snap-mandatory no-scrollbar" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6"}>
        {products.slice(0, limit || products.length).map((product) => (
          <div key={product._cardKey || product.id} className={swipeable ? "w-[160px] md:w-[240px] flex-shrink-0 snap-start" : ""}>
            <ProductCard 
              product={product} 
              toggleItem={toggleItem} 
              isInWishlist={isInWishlist} 
              addItem={addItem} 
            />
          </div>
        ))}
        {loading && Array(limit || 5).fill(0).map((_, i) => (
          <div key={i} className={`aspect-[4/5] bg-gray-200 dark:bg-white/5 animate-pulse rounded-lg ${swipeable ? "w-[160px] md:w-[240px] flex-shrink-0" : ""}`}/>
        ))}
      </div>

      {/* View All CTA */}
      {!hideViewAll && viewAllLink && (
        <div className="flex justify-center mt-8 mb-0">
          <Link 
            to={viewAllLink} 
            className="group relative flex items-center gap-4 px-12 py-4 bg-[#7A578D] border border-[#7A578D] hover:bg-[#6c4d7e] transition-all duration-300 rounded-none shadow-[0_4px_14px_rgba(122,87,141,0.25)]"
          >
            <span className="relative z-10 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-white transition-colors">
              EXPLORE ALL
            </span>
            <ArrowRight size={16} className="relative z-10 text-white/90 group-hover:translate-x-1.5 transition-all duration-300" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default React.memo(ProductSection);
