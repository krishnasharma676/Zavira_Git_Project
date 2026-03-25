import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

interface HeroCarouselProps {
  slides: any[];
  currentSlide: number;
  setCurrentSlide: (idx: number) => void;
}

const HeroCarousel = ({ slides, currentSlide, setCurrentSlide }: HeroCarouselProps) => {
  if (slides.length === 0) return null;

  return (
    <section className="w-full bg-black overflow-hidden relative h-[340px] lg:h-[450px]">
      <Link 
        to={slides[currentSlide].link || "/shop"}
        onClick={() => {
          if (slides[currentSlide].id) {
            api.patch(`/banners/${slides[currentSlide].id}/click`);
          }
        }}
        className="block w-full h-full relative group cursor-pointer"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ x: '100%', filter: 'blur(5px)', opacity: 0 }}
            animate={{ x: 0, filter: 'blur(0px)', opacity: 1 }}
            exit={{ x: '-100%', filter: 'blur(5px)', opacity: 0 }}
            transition={{ 
              x: { type: "spring", stiffness: 100, damping: 20 },
              opacity: { duration: 0.5 },
              filter: { duration: 0.5 }
            }}
            className="absolute inset-0"
          >
            <img 
              src={slides[currentSlide].imageUrl} 
              className="w-full h-full object-cover transition-transform duration-[5000ms] group-hover:scale-110" 
              alt={slides[currentSlide].title || "Hero banner"} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent group-hover:bg-black/0 transition-all duration-700"></div>
            
            {/* Added subtle text overlay animation if title exists */}
            {(slides[currentSlide].title || slides[currentSlide].subtitle) && (
              <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 z-10 pointer-events-none">
                 <motion.h2 
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.3, duration: 0.8 }}
                   className="text-white text-4xl md:text-6xl font-black uppercase max-w-2xl drop-shadow-2xl"
                 >
                   {slides[currentSlide].title}
                 </motion.h2>
                 <motion.p 
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.5, duration: 0.8 }}
                   className="text-white/80 text-sm md:text-lg mt-4 max-w-lg font-bold tracking-widest uppercase drop-shadow-lg"
                 >
                   {slides[currentSlide].subtitle}
                 </motion.p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </Link>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentSlide(idx);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              currentSlide === idx ? 'bg-[#7A578D] w-8' : 'bg-white/40 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
