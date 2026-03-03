import React from 'react';
import { Star, Send } from 'lucide-react';

interface ReviewFormProps {
  rating: number;
  setRating: (rating: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  isSubmitting: boolean;
  handleReviewSubmit: (e: React.FormEvent) => Promise<void>;
}

const ReviewForm = ({
  rating,
  setRating,
  comment,
  setComment,
  isSubmitting,
  handleReviewSubmit
}: ReviewFormProps) => {
  return (
    <div className="mt-10 p-6 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
      <h4 className="text-[11px] font-black uppercase tracking-widest mb-4">Share your Experience</h4>
      <form onSubmit={handleReviewSubmit} className="space-y-4">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`transition-transform hover:scale-125 ${rating >= star ? 'text-yellow-500' : 'text-gray-200'}`}
              >
                <Star size={18} fill={rating >= star ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe your feel about this jewelry..."
          className="w-full bg-white dark:bg-[#0D0D0D] border border-gray-100 dark:border-white/5 rounded-xl p-4 text-xs outline-none focus:border-[#7A578D] transition-all min-h-[100px]"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="luxury-button w-full rounded-xl flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <span className="animate-pulse">PUBLISHING...</span>
          ) : (
            <>
              <span>POST REVIEW</span>
              <Send size={12} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
