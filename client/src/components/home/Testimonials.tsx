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
    <section className="bg-[#F9F6F4] dark:bg-[#0D0D0D] py-8 transition-colors duration-500 relative overflow-hidden font-sans">
      
      {/* Decorative Header */}
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-[35px] md:text-[50px] lg:text-[60px] font-black font-serif italic leading-none whitespace-nowrap opacity-[0.05] dark:opacity-[0.08] select-none uppercase tracking-tighter">
          Happy Customers
        </h1>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Simplified Scroll Controls (Smaller and positioned same-line intent) */}
        <div className="relative group/arrows max-w-6xl mx-auto">
          <div className="absolute -top-7 right-2 flex space-x-1.5 z-20 scale-90">
            <button 
              onClick={() => scrollReviews('left')}
              className="w-7 h-7 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-zavira-purple transition-all rounded-full bg-white/50 dark:bg-black/50"
              aria-label="Previous review"
            >
              <ChevronLeft size={14} strokeWidth={1.5} />
            </button>
            <button 
              onClick={() => scrollReviews('right')}
              className="w-7 h-7 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-zavira-purple transition-all rounded-full bg-white/50 dark:bg-black/50"
              aria-label="Next review"
            >
              <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* Reviews Container: Maximum compactness per card */}
          <div 
            ref={scrollRef}
            className="flex items-stretch overflow-x-auto gap-4 no-scrollbar pb-2 snap-x snap-mandatory px-4 scroll-smooth"
          >
            {reviews.map((review, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="w-full sm:w-[300px] md:w-[340px] flex-shrink-0 snap-start bg-white dark:bg-zavira-blackDeep p-5 md:p-6 rounded-sm shadow-[0_5px_15px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-white/5 relative group/card"
              >
                <div className="flex flex-col h-full relative z-10 space-y-3">
                  {/* Rating & Badge */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={9} 
                          className={`${i < (review.rating || 5) ? 'fill-zavira-purple text-zavira-purple' : 'text-gray-200'}`} 
                          strokeWidth={1}
                        />
                      ))}
                    </div>
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 bg-zavira-purple/5 text-zavira-purple rounded-full">
                      Real User
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-[13px] md:text-[14px] font-serif italic text-gray-700 dark:text-gray-300 leading-snug line-clamp-3">
                    "{review.content}"
                  </p>
                  
                  {/* Client Info */}
                  <div className="flex items-center gap-2.5 pt-3 border-t border-gray-50 dark:border-white/5 mt-auto">
                    <div className="w-8 h-8 rounded-full ring-1 ring-zavira-purple/10 overflow-hidden bg-gray-100 shrink-0">
                      {review.imageUrl ? (
                         <img src={review.imageUrl} alt={review.name} className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full bg-zavira-purple text-white flex items-center justify-center font-black text-[9px]">
                           {(review.name || 'U').charAt(0)}
                         </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white leading-none mb-0.5 truncate">
                        {review.name}
                      </h4>
                      <p className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter opacity-80">
                        Reviewer
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="min-w-[40px] flex-shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Testimonials);
