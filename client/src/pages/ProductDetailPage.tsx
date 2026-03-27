import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import SEOMeta from '../components/SEOMeta';

import { useCatalogStore } from '../store/useCatalogStore';
import { performAddToCart } from '../utils/cartHelpers';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getProductBySlug } = useCatalogStore();
  
  // 1. Try Catalog Store first, 2. Try Router State, 3. Null
  const initialData = getProductBySlug(slug || '') || location.state?.product;

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const openAuthModal = useUIStore((s) => s.openAuthModal);
  
  const [product, setProduct] = useState<any>(initialData || null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(!initialData);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Initialize variant/size from state if possible
  const [selectedVariant, setSelectedVariant] = useState<any>(() => {
    if (initialData?.variants && initialData.variants.length > 0) {
      return initialData.variants[0];
    }
    return null;
  });

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    if (initialData) {
      if (initialData.variants && initialData.variants.length > 0) {
        const v = initialData.variants[0];
        return v.sizes?.find((s: any) => s.stock > 0)?.size || v.sizes?.[0]?.size || '';
      } else if (initialData.sizes) {
         return initialData.sizes.split(',').map((s: string) => s.trim()).filter(Boolean)[0] || '';
      }
    }
    return '';
  });

  const [activeTab, setActiveTab] = useState('details');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      // If we don't have initial data, show full loader
      if (!initialData) setLoading(true);

      try {
        const { data } = await api.get(`/products/${slug}`);
        const p = data.data;
        setProduct(p);
        
        // Background update state selections if the user hasn't interacted yet
        if (!selectedVariant && p.variants && p.variants.length > 0) {
          const firstVariant = p.variants[0];
          setSelectedVariant(firstVariant);
          const firstSize = firstVariant.sizes?.find((s: any) => s.stock > 0)?.size || firstVariant.sizes?.[0]?.size;
          if (firstSize) setSelectedSize(firstSize);
        } else if (!selectedSize && p.sizes) {
          const sizes = p.sizes.split(',').map((s: string) => s.trim()).filter(Boolean);
          if (sizes.length > 0) setSelectedSize(sizes[0]);
        }

      } catch (err) {
        if (!initialData) {
          toast.error("Product not found");
          navigate('/shop');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug, navigate, initialData]);

  useEffect(() => {
    if (product?.categoryId) {
      const fetchSimilar = async () => {
        try {
          const { data } = await api.get('/products', { 
            params: { category: product.categoryId, limit: 20 } 
          });
          // Filter out the current product itself
          const filtered = data.data.products.filter((p: any) => p.id !== product.id);
          setSimilarProducts(filtered);
        } catch (error) {
          console.error("Failed to fetch similar products", error);
        }
      };
      fetchSimilar();
    }
  }, [product?.id, product?.categoryId]);

  const handleAddToCart = () => {
    performAddToCart(product, selectedVariant, selectedSize, quantity, addItem);
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
      const formData = new FormData();
      formData.append('rating', rating.toString());
      formData.append('comment', comment);
      reviewImages.forEach((img) => {
        formData.append('images', img);
      });

      await api.post(`/reviews/product/${product.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Review submitted! It will be visible after approval.");
      setComment('');
      setRating(5);
      setReviewImages([]);
    } catch (error: any) {

      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  const variantImages = selectedVariant?.images?.map((img: any) => img.imageUrl);
  const productImages = product.images?.map((img: any) => img.imageUrl);
  const images = (variantImages && variantImages.length > 0) ? variantImages : (productImages && productImages.length > 0 ? productImages : ['https://via.placeholder.com/800']);

  return (
    <div className="bg-white dark:bg-[#121212] pt-8 pb-16 text-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
      <SEOMeta
        title={product.name}
        description={product.description?.slice(0, 155) || `Shop ${product.name} at Zaviraa. Premium jewellery with fast delivery.`}
        ogImage={images[0] || ''}
        ogUrl={window.location.href}
      />
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6 font-bold">
          <span className="cursor-pointer hover:text-[#7A578D] transition-colors" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={8} className="opacity-50" />
          <span className="cursor-pointer hover:text-[#7A578D] transition-colors" onClick={() => navigate('/shop')}>Shop</span>
          <ChevronRight size={8} className="opacity-50" />
          <span className="text-gray-900 dark:text-gray-200">{product?.name?.slice(0, 20)}...</span>
        </div>

        <div className="grid lg:grid-cols-[45%_1fr] gap-12 items-start">
          <div className="flex flex-col lg:sticky lg:top-32 h-fit">
            <ProductGallery 
              images={images} 
              selectedImage={selectedImage} 
              setSelectedImage={setSelectedImage} 
              productName={product.name} 
            />
          </div>
            
          <div className="flex flex-col">
            <ProductInfo 
              product={product} 
              quantity={quantity} 
              setQuantity={setQuantity} 
              selectedVariant={selectedVariant}
              setSelectedVariant={(v: any) => { 
                setSelectedVariant(v); 
                const firstS = v.sizes?.find((s: any) => s.stock > 0)?.size || v.sizes?.[0]?.size;
                setSelectedSize(firstS || ''); 
                setSelectedImage(0); 
              }}

              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              handleAddToCart={handleAddToCart} 
              toggleItem={toggleItem} 
              isInWishlist={isInWishlist} 
              toast={toast} 
            />
            
            <div className="mt-8">
              <ProductTabs 
                product={product} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
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
        </div>


        {/* Similar Products Section */}
        <div className="mt-8 pt-10">
          <ProductSection 
            title="SIMILAR PRODUCTS" 
            products={similarProducts} 
            loading={loading}
            toggleItem={toggleItem}
            isInWishlist={isInWishlist}
            addItem={addItem}
            hideViewAll={true}
            swipeable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
