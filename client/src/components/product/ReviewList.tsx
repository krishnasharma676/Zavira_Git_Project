import { Star } from 'lucide-react';

interface ReviewListProps {
  reviews: any[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  return (
    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {reviews?.length > 0 ? (
        reviews.map((review: any) => (
          <div key={review.id} className="border-b border-gray-50 dark:border-white/5 pb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#7A578D]">{review.user?.name}</h4>
              <span className="text-[8px] text-gray-400 uppercase font-bold">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex text-yellow-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} />
              ))}
            </div>
            <p className="text-gray-500 font-medium leading-relaxed text-xs">"{review.comment}"</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400 text-xs italic py-10">No reviews yet for this masterpiece.</p>
      )}
    </div>
  );
};

export default ReviewList;
