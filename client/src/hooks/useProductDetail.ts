import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProductBySlug, getSimilarProducts, submitProductReview } from '../services/productService';
import { useAuth } from '../store/useAuth';
import { useUIStore } from '../store/useUIStore';

export const useProductDetail = (slug: string | undefined, initialData: any) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const openAuthModal = useUIStore((s) => s.openAuthModal);

  const [product, setProduct] = useState<any>(initialData || null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(!initialData);
  
  const [selectedVariant, setSelectedVariant] = useState<any>(() => {
    if (initialData?.variants?.length > 0) return initialData.variants[0];
    return null;
  });

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    if (initialData) {
      if (initialData.variants?.length > 0) {
        const v = initialData.variants[0];
        return v.sizes?.find((s: any) => s.stock > 0)?.size || v.sizes?.[0]?.size || '';
      } else if (initialData.sizes) {
         return initialData.sizes.split(',').map((s: string) => s.trim()).filter(Boolean)[0] || '';
      }
    }
    return '';
  });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!initialData) setLoading(true);
      try {
        if (!slug) return;
        const p = await getProductBySlug(slug);
        setProduct(p);
        
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
          const filtered = await getSimilarProducts(product.categoryId, product.id);
          setSimilarProducts(filtered);
        } catch (error) {
          console.error("Failed to fetch similar products", error);
        }
      };
      fetchSimilar();
    }
  }, [product?.id, product?.categoryId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      openAuthModal('login');
      return;
    }
    if (!comment) { toast.error("Please enter a comment"); return; }

    setIsSubmittingReview(true);
    try {
      const formData = new FormData();
      formData.append('rating', rating.toString());
      formData.append('comment', comment);
      reviewImages.forEach((img) => formData.append('images', img));

      await submitProductReview(product.id, formData);

      toast.success("Review submitted! It will be visible after approval.");
      setComment('');
      setRating(5);
      setReviewImages([]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleVariantSelect = useCallback((v: any) => {
    setSelectedVariant(v); 
    const firstS = v.sizes?.find((s: any) => s.stock > 0)?.size || v.sizes?.[0]?.size;
    setSelectedSize(firstS || ''); 
  }, []);

  return {
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
  };
};
