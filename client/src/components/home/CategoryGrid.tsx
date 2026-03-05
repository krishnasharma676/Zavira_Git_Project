import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface CategoryGridProps {
  categories: any[];
}

const CategoryGrid = ({ categories }: CategoryGridProps) => {
  return (
    <section className="w-full bg-[#EAD0DB] dark:bg-[#1A1A1A]/50 py-10 mb-16 transition-colors duration-500 relative">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col items-center mb-10 text-center relative">
          <div className="flex items-center gap-6 mb-3 w-full">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#7A578D] to-[#7A578D] opacity-20" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#7A578D] whitespace-nowrap">Explore More</span>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#7A578D] to-[#7A578D] opacity-20" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900 dark:text-white tracking-tight leading-none mb-1">
            Shop By Style
          </h2>
          <div className="w-12 h-0.5 bg-[#7A578D] opacity-20 mt-4 rounded-full" />
        </div>
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-6 gap-6 lg:gap-8 no-scrollbar pb-6 lg:pb-0 group/container">
          {categories.slice(0, 6).map((cat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8,
                delay: idx * 0.1,
              }}
              className="w-[140px] md:w-[200px] lg:w-auto cursor-pointer flex-shrink-0 group"
            >
              <Link to={`/shop?category=${cat.slug}`} className="flex flex-col items-center">
                {/* Iconic Square Display */}
                <div className="relative w-[140px] h-[140px] md:w-[200px] md:h-[200px] lg:w-full lg:aspect-square mb-3 group-hover:-translate-y-2 transition-transform duration-500">
                  {/* Main Portrait */}
                  <div className="w-full h-full rounded-[2.8rem] overflow-hidden bg-white dark:bg-[#0A0A0A] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-white dark:border-white/5 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 relative z-10">
                    <img 
                      src={(cat.imageUrl && cat.imageUrl.trim() !== '') ? cat.imageUrl : 'https://via.placeholder.com/500'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] cubic-bezier(0.2, 0, 0, 1)" 
                      alt={cat.name} 
                    />
                    {/* Silk Shimmer Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                </div>

                {/* Iconic Branding */}
                <div className="text-center">
                  <h3 className="text-[12px] md:text-[13px] font-black tracking-[0.2em] text-gray-900 dark:text-gray-100 uppercase">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
