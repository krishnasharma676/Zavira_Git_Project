import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface TestimonialsProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  scrollReviews: (direction: 'left' | 'right') => void;
}

const Testimonials = ({ scrollRef, scrollReviews }: TestimonialsProps) => {
  const reviews = [
    { 
      title: 'Quality products', 
      rating: 5, 
      text: 'Quality of the products is top notch 🤯 am really happy with what i bought.', 
      author: 'Riya' 
    },
    { 
      title: 'Awesome', 
      rating: 5, 
      text: 'It an awesome product, trustworthy and good customer care. Highly recommended for premium jewelry.', 
      author: 'Nunutei Chhangte' 
    },
    { 
      title: 'Obsessed!', 
      rating: 5, 
      text: 'I love the earrings they are of great quality,& wide range of design\'s. Got them in sale but id definitely purchase for the actual price.', 
      author: 'Katyayani Inuti' 
    },
    { 
      title: 'Timeless Beauty', 
      rating: 5, 
      text: 'The finish on the gold items is spectacular. It looks far more expensive than it actually is. Perfectly packed too.', 
      author: 'Arpita Sharma' 
    }
  ];

  return (
    <section className="bg-white dark:bg-[#0A0A0A] py-10 transition-colors duration-500 relative overflow-hidden border-y border-gray-50 dark:border-gray-900/50">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[100px] bg-[#7A578D]/2 blur-[80px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-6 text-center">
            <h2 className="text-lg md:text-xl font-sans font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-2">
              Customer <span className="text-[#7A578D]">Reviews_</span>
            </h2>
            <div className="w-8 h-px bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="relative group/arrows mx-auto">
          <div className="absolute -top-10 right-0 flex space-x-2">
            <button 
              onClick={() => scrollReviews('left')}
              className="w-7 h-7 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#7A578D] transition-all rounded-full bg-white dark:bg-[#121212]"
            >
              <ChevronLeft size={14} />
            </button>
            <button 
              onClick={() => scrollReviews('right')}
              className="w-7 h-7 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#7A578D] transition-all rounded-full bg-white dark:bg-[#121212]"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 no-scrollbar pb-6 snap-x snap-mandatory px-1 scroll-smooth"
          >
            {reviews.map((review, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="min-w-[260px] md:min-w-[320px] flex-shrink-0 snap-center bg-white dark:bg-[#0D0D0D] p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800/50 relative group/card overflow-hidden"
              >
                <div className="flex flex-col h-full relative z-10">
                  <div className="mb-3 flex justify-between items-start">
                    <Quote className="text-[#7A578D]/20" size={24} strokeWidth={1.5} />
                    <div className="flex space-x-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={10} className="fill-[#7A578D] text-[#7A578D]" />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-[11px] font-black text-gray-900 dark:text-white mb-1.5 uppercase tracking-wider">{review.title}</h3>
                  <p className="text-[13px] leading-relaxed text-gray-500 dark:text-gray-400 font-medium mb-4 flex-grow italic line-clamp-3">
                    "{review.text}"
                  </p>
                  
                  <div className="flex items-center space-x-3 pt-3 border-t border-gray-50 dark:border-gray-800/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7A578D] to-[#C9A0C8] flex items-center justify-center text-white text-[10px] font-black">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-900 dark:text-white block mb-0.5">{review.author}</span>
                      <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Verified Buyer</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
