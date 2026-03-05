import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../store/useCart';
import { useWishlist } from '../store/useWishlist';
import { useAuth } from '../store/useAuth';
import { useUIStore } from '../store/useUIStore';
import toast from 'react-hot-toast';

import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductTabs from '../components/product/ProductTabs';
import ProductSection from '../components/home/ProductSection';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const openAuthModal = useUIStore((s) => s.openAuthModal);
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  
  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data.data);
      } catch {
        toast.error("Product not found");
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  useEffect(() => {
    if (product?.categoryId) {
      const fetchSimilar = async () => {
        try {
          const { data } = await api.get('/products', { 
            params: { category: product.categoryId, limit: 5 } 
          });
          // Filter out the current product itself
          const filtered = data.data.products.filter((p: any) => p.id !== product.id);
          setSimilarProducts(filtered.slice(0, 4));
        } catch (error) {
          console.error("Failed to fetch similar products", error);
        }
      };
      fetchSimilar();
    }
  }, [product?.id, product?.categoryId]);

  const handleAddToCart = () => {
    const stock = product.inventory?.stock || 0;
    if (stock <= 0) {
      toast.error("This product is currently out of stock");
      return;
    }
    const primaryImage = product.images?.find((img: any) => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl;
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.basePrice,
      quantity: quantity,
      image: primaryImage,
      stock: product.inventory?.stock || 0
    });
    toast.success(`${product.name} added to your cart`);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      openAuthModal('login');
      return;
    }

    if (!comment) { toast.error("Please enter a comment"); return; }

    setIsSubmitting(true);
    try {
      await api.post(`/reviews/product/${product.id}`, { rating, comment });
      toast.success("Review submitted! It will be visible after approval.");
      setComment('');
      setRating(5);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#121212] transition-colors duration-300">
      <div className="w-12 h-12 border-4 border-[#7A578D] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const images = product.images?.map((img: any) => img.imageUrl) || ['https://via.placeholder.com/800'];

  return (
    <div className="bg-white dark:bg-[#121212] pt-8 pb-16 text-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6 font-bold">
          <span className="cursor-pointer hover:text-[#7A578D] transition-colors" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={8} className="opacity-50" />
          <span className="cursor-pointer hover:text-[#7A578D] transition-colors" onClick={() => navigate('/shop')}>Shop</span>
          <ChevronRight size={8} className="opacity-50" />
          <span className="text-gray-900 dark:text-gray-200">{product?.name?.slice(0, 20)}...</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <ProductGallery 
            images={images} 
            selectedImage={selectedImage} 
            setSelectedImage={setSelectedImage} 
            productName={product.name} 
          />
          
          <div className="flex flex-col">
            <ProductInfo 
              product={product} 
              quantity={quantity} 
              setQuantity={setQuantity} 
              handleAddToCart={handleAddToCart} 
              toggleItem={toggleItem} 
              isInWishlist={isInWishlist} 
              toast={toast} 
            />
            
            <ProductTabs 
              product={product} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              rating={rating} 
              setRating={setRating} 
              comment={comment} 
              setComment={setComment} 
              isSubmitting={isSubmitting} 
              handleReviewSubmit={handleReviewSubmit} 
            />
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-20 border-t border-gray-100 dark:border-gray-800 pt-16">
          <ProductSection 
            title="SIMILAR PRODUCTS" 
            products={similarProducts} 
            viewAllLink={`/shop?category=${product.category?.slug || product.categoryId}`} 
            loading={loading}
            toggleItem={toggleItem}
            isInWishlist={isInWishlist}
            addItem={addItem}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

