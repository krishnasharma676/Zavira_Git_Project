import React from 'react';
import { Link } from 'react-router-dom';

interface PromoBannerProps {
  banners: any[];
}

const PromoBanner = ({ banners }: PromoBannerProps) => {
  if (!banners || banners.length === 0) return null;
  const promo = banners[0];

  return (
    <section className="w-full mb-20 cursor-pointer">
      <Link to={promo.link || "/shop"} className="block w-full overflow-hidden group relative bg-black aspect-[3/1] md:aspect-[5/1]">
         <img 
           src={promo.imageUrl} 
           className="w-full h-full object-cover transition-opacity" 
           alt="Promo Banner" 
         />

      </Link>
    </section>
  );
};

export default React.memo(PromoBanner);
