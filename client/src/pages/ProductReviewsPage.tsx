import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, Calendar, User } from 'lucide-react';
import api from '../api/axios';
import { useCatalogStore } from '../store/useCatalogStore';
import SEOMeta from '../components/SEOMeta';
import ReviewList from '../components/product/ReviewList';
import ReviewForm from '../components/product/ReviewForm';
import toast from 'react-hot-toast';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const ProductReviewsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProductBySlug } = useCatalogStore();
  
  const [product, setProduct] = useState<any>(getProductBySlug(slug || '') || null);
  const [loading, setLoading] = useState(!product);
  
  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!product) setLoading(true);
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data.data);
      } catch (err) {
        toast.error("Product not found");
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) { toast.error("Please enter a comment"); return; }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('rating', rating.toString());
      formData.append('comment', comment);
      reviewImages.forEach((img) => formData.append('images', img));

      await api.post(`/reviews/product/${product.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Review submitted for approval!");
      setComment('');
      setRating(5);
      setReviewImages([]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !product) return null;

  return (
    <div className="bg-white dark:bg-[#121212] min-h-screen pb-20 pt-8 transition-colors duration-300">
      <SEOMeta title={`Reviews - ${product.name}`} />
      
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate(`/product/${slug}`)}
          className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#7A578D] mb-8 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Product
        </button>

        <div className="grid lg:grid-cols-[350px_1fr] gap-12 items-start">
          {/* Left Side: Product Summary */}
          <div className="lg:sticky lg:top-24 space-y-8">
            <div className="flex flex-col gap-4">
              <div 
                className="aspect-[3/4] rounded-sm overflow-hidden border border-gray-100 dark:border-white/5 cursor-pointer"
                onClick={() => navigate(`/product/${slug}`)}
              >
                <img 
                  src={product.images?.[0]?.imageUrl || 'https://via.placeholder.com/400'} 
                  alt={product.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{product.category?.name || 'ZAVIRAA'}</h1>
                <p className="text-gray-500 text-sm mb-3">{product.name}</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(product.discountedPrice || product.basePrice || 0).replace('₹', '₹ ')}
                  </span>
                  {product.discountedPrice && product.basePrice > product.discountedPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(product.basePrice).replace('₹', '₹ ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-white/5">
              <h5 className="text-[13px] font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-6">Write a Review</h5>
              <ReviewForm 
                rating={rating} 
                setRating={setRating} 
                comment={comment} 
                setComment={setComment} 
                images={reviewImages}
                setImages={setReviewImages}
                isSubmitting={isSubmitting} 
                handleReviewSubmit={handleReviewSubmit} 
              />
            </div>
          </div>

          {/* Right Side: All Reviews */}
          <div className="space-y-12">
             <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight uppercase">Rating Details</h2>
                <p className="text-gray-500 text-sm">Showing all {product.reviews?.length || 0} verified reviews </p>
             </div>

             <ReviewList reviews={product.reviews || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewsPage;
