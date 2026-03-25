import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewListProps {
  reviews: any[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 no-scrollbar relative">


      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4 cursor-pointer"
          >
             <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                <X size={32} />
             </button>
             <motion.img 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               src={selectedImage} 
               className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
               alt="Zoomed Review"
             />
          </motion.div>
        )}
      </AnimatePresence>

      {reviews?.length > 0 ? (
        reviews.map((review: any) => (
          <div key={review.id} className="border-b border-gray-50 dark:border-white/5 pb-6 last:border-0">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#7A578D]">{review.user?.name}</h4>
              <span className="text-[8px] text-gray-400 uppercase font-bold">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex text-yellow-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-yellow-500" : "text-gray-200"} />
              ))}
            </div>
            <p className="text-gray-500 font-medium leading-relaxed text-xs mb-3 italic">"{review.comment}"</p>
            
            {review.images && review.images.length > 0 && (
              <div className="flex gap-3">
                {review.images.map((img: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedImage(img)}
                    className="w-16 h-20 rounded-lg overflow-hidden border border-gray-100 dark:border-white/5 cursor-zoom-in group relative"
                  >
                    <img src={img} alt={`Review ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400 text-[10px] uppercase font-bold tracking-widest py-10 opacity-50">No reviews yet for this masterpiece.</p>
      )}
    </div>
  );
};

export default ReviewList;

