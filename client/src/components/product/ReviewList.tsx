import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewListProps {
  reviews: any[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {/* Overall Ratings Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-8 border-b border-gray-100 dark:border-white/5 pb-8">
        <div className="flex flex-col items-center justify-center border-r border-gray-200 dark:border-white/10 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {reviews?.length > 0 
                ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1) 
                : "0.0"}
            </span>
            <Star size={28} className="text-[#7A578D] fill-[#7A578D]" />
          </div>
          <p className="text-sm text-gray-500 font-medium whitespace-nowrap">{reviews?.length || 0} Verified Buyers</p>
        </div>

        {/* Dynamic Star Bars */}
        <div className="flex-1 max-w-sm space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews?.filter((r: any) => r.rating === star).length || 0;
            const percentage = reviews?.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-400">
                <span className="w-2">{star}</span>
                <Star size={10} className="fill-gray-300 text-gray-300" />
                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#7A578D]" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right opacity-50">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Photos - Gathered from all reviews */}
      {reviews?.some((r: any) => r.images && r.images.length > 0) && (
        <div className="space-y-4">
          <h5 className="text-[14px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">Customer Photos ({reviews.reduce((acc: number, r: any) => acc + (r.images?.length || 0), 0)})</h5>
          <div className="flex flex-wrap gap-3">
            {reviews.flatMap((r: any) => r.images || []).slice(0, 15).map((img: string, i: number) => (
              <div 
                key={i} 
                onClick={() => setSelectedImage(img)}
                className="w-20 h-24 rounded-sm overflow-hidden border border-gray-200 dark:border-white/10 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img src={img} alt="Customer" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Cards */}
      <div className="space-y-10">
        <h5 className="text-[14px] font-bold uppercase tracking-wider text-gray-900 dark:text-white">Customer Reviews ({reviews?.length || 0})</h5>
        {reviews?.length > 0 ? (
          reviews.map((review: any) => (
            <div key={review.id} className="border-b border-gray-100 dark:border-white/5 pb-8 last:border-0 transition-colors">
               {/* 1st Line: Rating, User Name and Date Side by Side */}
               <div className="flex items-center gap-3 mb-4">
                 <div className="flex items-center gap-1 bg-[#7A578D] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm">
                   {review.rating} <Star size={10} fill="currentColor" />
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{review.user?.name || 'Verified Buyer'}</span>
                    <span className="text-gray-300 dark:text-gray-600 font-light">|</span>
                    <span className="text-[13px] text-gray-400 font-medium">
                      {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                 </div>
               </div>

               {/* 2nd Line: Comment */}
               <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed mb-5 font-normal">
                 {review.comment}
               </p>

               {/* 3rd Line: Images */}
               {review.images && review.images.length > 0 && (
                 <div className="flex gap-3">
                    {review.images.map((img: string, idx: number) => (
                       <img 
                        key={idx} 
                        src={img} 
                        onClick={() => setSelectedImage(img)}
                        className="w-20 h-24 object-cover rounded-sm border border-gray-200 dark:border-white/10 cursor-pointer hover:scale-105 transition-transform" 
                        alt="Review Attachment" 
                       />
                    ))}
                 </div>
               )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm italic">No reviews yet.</p>
        )}
      </div>

      {/* Image Modal */}
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
               className="max-w-[90vw] max-h-[90vh] object-contain shadow-2xl"
               alt="Zoomed Review"
             />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewList;
