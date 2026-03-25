import React from 'react';
import { Star, Send, Camera, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  rating: number;
  setRating: (rating: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  images: File[];
  setImages: (images: File[] | ((prev: File[]) => File[])) => void;
  isSubmitting: boolean;
  handleReviewSubmit: (e: React.FormEvent) => Promise<void>;
}

const ReviewForm = ({
  rating,
  setRating,
  comment,
  setComment,
  images,
  setImages,
  isSubmitting,
  handleReviewSubmit
}: ReviewFormProps) => {
  return (
    <div className="mt-10 p-6 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
      <h4 className="text-[11px] font-black uppercase tracking-widest mb-4">Share your Experience</h4>
      <form onSubmit={handleReviewSubmit} className="space-y-6">
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

        <div className="space-y-1">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe your feel about this jewelry..."
            className="w-full bg-white dark:bg-[#0D0D0D] border border-gray-100 dark:border-white/5 rounded-xl p-4 text-xs outline-none focus:border-[#7A578D] transition-all min-h-[100px] font-medium"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-4">
               <label className="cursor-pointer group flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border-2 border-dashed border-gray-100 dark:border-white/5 hover:border-[#7A578D] transition-all">
                   <input 
                     type="file" 
                     className="hidden" 
                     onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (images.length + files.length > 2) {
                           toast.error("Max 2 photos allowed");
                           return;
                        }
                        setImages((prev) => [...prev, ...files]);
                     }} 
                     multiple 
                     accept="image/*" 
                   />
                   <Camera size={18} className="text-gray-400 group-hover:text-[#7A578D]" />
               </label>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-gray-900 dark:text-gray-100 tracking-widest">Add Photos</span>
                  <span className="text-[8px] text-gray-400 uppercase">Max 2 photos (JPEG, PNG)</span>
               </div>
          </div>

          {images.length > 0 && (
            <div className="flex gap-3">
              {images.map((file, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 group shadow-sm">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
