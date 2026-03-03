import { Link } from 'react-router-dom';

const PromoBanner = () => {
  return (
    <section className="w-full mb-20 cursor-pointer">
      <Link to="/shop" className="block w-full overflow-hidden group relative bg-black aspect-[3/1] md:aspect-[5/1]">
         <img 
           src="https://images.unsplash.com/photo-1515562141207-7a18b5ce7042?q=80&w=2000" 
           className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
           alt="Promo Banner" 
         />
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center p-6 bg-black/40 backdrop-blur-sm border-2 border-dashed border-[#7A578D] transform group-hover:scale-105 transition-transform duration-500">
              <h3 className="text-white text-2xl md:text-4xl font-black font-sans uppercase italic tracking-tighter shadow-lg">
                ENTERPRISE <span className="text-[#7A578D]">CRAFTSMANSHIP</span>
              </h3>
              <div className="bg-[#C9A0C8] text-white font-black uppercase text-[10px] px-6 py-2 rounded-full inline-block mt-4 shadow-xl">
                Explore Now
              </div>
            </div>
         </div>
      </Link>
    </section>
  );
};

export default PromoBanner;
