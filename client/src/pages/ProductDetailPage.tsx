import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useCart } from '../store/useCart';
import { useWishlist } from '../store/useWishlist';
import toast from 'react-hot-toast';

import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductTabs from '../components/product/ProductTabs';
import ProductSection from '../components/home/ProductSection';
import SEOMeta from '../components/SEOMeta';

import { useCatalogStore } from '../store/useCatalogStore';
import { ProductSkeleton } from '../components/common/Skeleton';
import { performAddToCart } from '../utils/cartHelpers';
import { useProductDetail } from '../hooks/useProductDetail';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getProductBySlug } = useCatalogStore();
  
  // 1. Try Catalog Store first, 2. Try Router State, 3. Null
  const initialData = getProductBySlug(slug || '') || location.state?.product;

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  
  const {
    product,
    loading,
    similarProducts,
    selectedVariant,
    handleVariantSelect,
    selectedSize,
    setSelectedSize,
    rating,
    setRating,
    comment,
    setComment,
    reviewImages,
    setReviewImages,
    isSubmittingReview,
    handleReviewSubmit
  } = useProductDetail(slug, initialData);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  const handleAddToCart = () => {
    performAddToCart(product, selectedVariant, selectedSize, quantity, addItem);
  };

  const images = useMemo(() => {
    const variantImages = selectedVariant?.images?.map((img: any) => img.imageUrl);
    const productImages = product?.images?.map((img: any) => img.imageUrl);
    return (variantImages && variantImages.length > 0) 
      ? variantImages 
      : (productImages && productImages.length > 0 ? productImages : ['https://via.placeholder.com/800']);
  }, [selectedVariant, product]);

  if (loading || !product) return <ProductSkeleton />;

  return (
    <div className="bg-white dark:bg-[#121212] pt-8 pb-16 text-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
      <SEOMeta
        title={product.name}
        description={product.description?.slice(0, 155) || `Shop ${product.name} at Zaviraa. Premium jewellery with fast delivery.`}
        ogImage={images[0] || ''}
        ogUrl={window.location.href}
      />
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6 font-bold">
          <span className="cursor-pointer hover:text-[#7A578D] transition-colors" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={8} className="opacity-50" />
          <span className="cursor-pointer hover:text-[#7A578D] transition-colors" onClick={() => navigate('/shop')}>Shop</span>
          <ChevronRight size={8} className="opacity-50" />
          <span className="text-gray-900 dark:text-gray-200">{product?.name?.slice(0, 20)}...</span>
        </div>

        <div className="grid lg:grid-cols-[55%_1fr] lg:gap-16 gap-8 items-start">
          <div className="flex flex-col">
            <ProductGallery 
              images={images} 
              selectedImage={selectedImage} 
              setSelectedImage={setSelectedImage} 
              productName={product.name} 
            />
          </div>
            
          <div className="flex flex-col lg:sticky lg:top-24 h-fit pb-10">
            <ProductInfo 
              product={product} 
              quantity={quantity} 
              setQuantity={setQuantity} 
              selectedVariant={selectedVariant}
              setSelectedVariant={(v: any) => { 
                handleVariantSelect(v);
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
                isSubmitting={isSubmittingReview} 
                handleReviewSubmit={handleReviewSubmit} 
              />
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-4 pt-4">
          <ProductSection 
            title="MORE ITEMS" 
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
