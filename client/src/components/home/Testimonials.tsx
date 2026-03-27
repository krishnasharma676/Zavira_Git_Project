import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface TestimonialsProps {
  reviews: any[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  scrollReviews: (direction: 'left' | 'right') => void;
}

const Testimonials = ({ reviews, scrollRef, scrollReviews }: TestimonialsProps) => {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="bg-white dark:bg-[#0A0A0A] py-10 transition-colors duration-500 relative overflow-hidden border-y border-gray-50 dark:border-gray-900/50">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[100px] bg-[#7A578D]/2 blur-[80px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-10 text-center relative">
          <div className="flex items-center gap-6 mb-3 w-full">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#7A578D] to-[#7A578D] opacity-20" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#7A578D] whitespace-nowrap">Kind Words</span>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#7A578D] to-[#7A578D] opacity-20" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900 dark:text-white tracking-tight leading-none mb-1">
            Customer Stories
          </h2>
          <div className="w-12 h-0.5 bg-[#7A578D] opacity-20 mt-4 rounded-full" />
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
              className="flex items-stretch overflow-x-auto gap-6 no-scrollbar pb-8 snap-x snap-mandatory px-4 scroll-smooth"
            >
              {reviews.map((review, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="w-[300px] md:w-[450px] min-h-[180px] flex-shrink-0 snap-start bg-white dark:bg-[#0D0D0D] p-5 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800/50 relative group/card overflow-hidden"
                >
                  <div className="flex flex-col h-full relative z-10">
                    <div className="mb-2 flex justify-between items-start">
                      <Quote className="text-[#7A578D]/20" size={24} strokeWidth={1.5} />
                      <div className="flex space-x-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={8} className="fill-[#7A578D] text-[#7A578D]" />
                        ))}
                      </div>
                    </div>

                    <h3 className="text-[10px] font-black text-gray-900 dark:text-white mb-1 uppercase tracking-wider">{review.role || 'Verified Buyer'}</h3>
                    <p className="text-[13px] leading-relaxed text-gray-500 dark:text-gray-400 font-medium mb-3 flex-grow italic line-clamp-3 break-all">
                      "{review.content}"
                    </p>
                    
                    <div className="flex items-center space-x-3 pt-3 border-t border-gray-50 dark:border-gray-800/50 mt-auto">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7A578D] to-[#C9A0C8] flex items-center justify-center text-white text-[11px] font-black shadow-md overflow-hidden border-2 border-white dark:border-gray-800">
                        {review.imageUrl ? (
                           <img src={review.imageUrl} alt={review.name} className="w-full h-full object-cover" />
                        ) : (
                           (review.name || 'A').charAt(0)
                        )}
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-900 dark:text-white block mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{review.name}</span>
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">{review.role || 'Verified Buyer'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {/* Spacer for better scroll experience */}
              <div className="min-w-[20px] flex-shrink-0" />
            </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Testimonials);
