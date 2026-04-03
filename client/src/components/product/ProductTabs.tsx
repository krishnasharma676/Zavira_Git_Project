import { useNavigate } from 'react-router-dom';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

interface ProductTabsProps {
  product: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  rating: number;
  setRating: (rating: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  images: File[];
  setImages: (images: File[] | ((prev: File[]) => File[])) => void;
  isSubmitting: boolean;
  handleReviewSubmit: (e: React.FormEvent) => Promise<void>;
}

const ProductTabs = ({
  product,
  rating,
  setRating,
  comment,
  setComment,
  images,
  setImages,
  isSubmitting,
  handleReviewSubmit
}: ProductTabsProps) => {

  const navigate = useNavigate();
  const attributes = product.attributes || {};
  
  // Helper to check if an attribute exists (case insensitive)
  const getAttr = (name: string) => {
    const key = Object.keys(attributes).find(k => k.toLowerCase() === name.toLowerCase());
    return key ? attributes[key] : null;
  };

  const sizeAndFit = getAttr('sizeAndFit') || getAttr('size and fit');
  const material = getAttr('material');
  const care = getAttr('careInstructions') || getAttr('care');

  // Filter out the "main" attributes from the list to avoid duplication
  const technicalKeys = ['isvariantproduct', '_id', '__v', 'id', 'productid', 'material', 'careinstructions', 'care', 'sizeandfit', 'size and fit'];
  const specificationEntries = Object.entries(attributes).filter(
    ([key]) => !technicalKeys.includes(key.toLowerCase())
  );

  return (
    <div className="space-y-4 mt-2">
      
      {/* RENAME SPECIFICATIONS TO PRODUCT DETAILS & REMOVE OLD DESCRIPTION */}
      <div className="pt-2">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-[16px] font-bold uppercase tracking-widest text-gray-900 dark:text-white">Product Details</h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900 dark:text-white mb-1">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>

        {/* 1 ROW 1 COLUMN LIST (STACKED) */}
        <div className="space-y-6 max-w-4xl">
            {specificationEntries.length > 0 && specificationEntries.map(([key, value]: [string, any]) => (
              <div key={key} className="flex flex-col border-b border-gray-100 dark:border-white/5 pb-2">
                <span className="text-[11px] text-gray-400 mb-1 font-semibold uppercase tracking-wide">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-[14px] text-gray-900 dark:text-white font-bold">{String(value)}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Size & Fit - ONLY IF EXISTS */}
      {sizeAndFit && (
        <div className="pt-4 mb-6">
          <h4 className="text-[15px] font-bold text-gray-900 dark:text-white mb-2 underline decoration-[#7A578D]/30 underline-offset-4">Size & Fit</h4>
          <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{sizeAndFit}</p>
        </div>
      )}

      {/* Material & Care - ONLY IF EXISTS */}
      {(material || care) && (
        <div className="pt-4 mb-6">
          <h4 className="text-[15px] font-bold text-gray-900 dark:text-white mb-2 underline decoration-[#7A578D]/30 underline-offset-4">Material & Care</h4>
          {material && <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{material}</p>}
          {care && <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{care}</p>}
        </div>
      )}

      <hr className="my-6 border-gray-200 dark:border-white/10" />

      {/* Reviews Section - DYNAMIC 3 REVIEWS */}
      <div className="pt-2 pb-10">
        <h4 className="text-[16px] font-bold text-gray-900 dark:text-white mb-8 uppercase tracking-[0.15em]">Customer Feedback</h4>
        <div className="max-w-4xl">
          <ReviewList reviews={product.reviews?.slice(0, 3) || []} />
          
          {product.reviews?.length > 3 && (
            <button 
              onClick={() => navigate(`/product/${product.slug}/reviews`)}
              className="text-[#7A578D] font-bold text-[14px] uppercase tracking-wider mt-6 hover:underline flex items-center gap-2"
            >
              View All {product.reviews.length} Reviews
            </button>
          )}

          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5">
            <h5 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-6">Write a Review</h5>
            <ReviewForm 
              rating={rating} 
              setRating={setRating} 
              comment={comment} 
              setComment={setComment} 
              images={images}
              setImages={setImages}
              isSubmitting={isSubmitting} 
              handleReviewSubmit={handleReviewSubmit} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;
