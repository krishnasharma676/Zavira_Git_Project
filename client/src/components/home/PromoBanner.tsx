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
           className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
           alt={promo.title || "Promo Banner"} 
         />
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center p-6 bg-black/40 backdrop-blur-sm border-2 border-dashed border-[#7A578D] transform group-hover:scale-105 transition-transform duration-500">
              <h3 className="text-white text-2xl md:text-4xl font-black font-sans uppercase italic tracking-tighter shadow-lg">
                {promo.title || "ENTERPRISE CRAFTSMANSHIP"}
              </h3>
              <div className="bg-[#C9A0C8] text-white font-black uppercase text-[10px] px-6 py-2 rounded-full inline-block mt-4 shadow-xl">
                {promo.subtitle || "Explore Now"}
              </div>
            </div>
         </div>
      </Link>
    </section>
  );
};

export default PromoBanner;
