import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useCart } from '../store/useCart';
import { useWishlist } from '../store/useWishlist';
import { expandProductsByVariant } from '../utils/productHelpers';
import { useCatalogStore } from '../store/useCatalogStore';

export const useHome = () => {
  const { allProducts, categories, banners, testimonials: reviews, loading: catalogLoading } = useCatalogStore();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = useMemo(() => banners.filter((b: any) => b.type === 'HERO'), [banners]);
  const promoBanners = useMemo(() => banners.filter((b: any) => b.type === 'PROMO'), [banners]);
  
  const featuredProducts = useMemo(() =>
    expandProductsByVariant(allProducts.filter(p => p.featured).slice(0, 12)),
    [allProducts]
  );

  const categoryProducts = useMemo(() => {
    const res: any = {};
    categories.forEach((cat: any) => {
      const prods = allProducts.filter(p => p.categoryId === cat.id).slice(0, 8);
      if (prods.length > 0) {
        res[cat.id] = expandProductsByVariant(prods);
      }
    });
    return res;
  }, [allProducts, categories]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides]);

  const scrollReviews = useCallback((direction: 'left' | 'right') => {
    if (reviewScrollRef.current) {
      const { scrollLeft, clientWidth } = reviewScrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      reviewScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, []);

  const categorySections = useMemo(() =>
    categories.filter((cat) => !!categoryProducts[cat.id]),
    [categories, categoryProducts]
  );

  return {
    heroSlides,
    promoBanners,
    featuredProducts,
    categoryProducts,
    categorySections,
    categories,
    reviews,
    catalogLoading,
    addItem,
    toggleItem,
    isInWishlist,
    reviewScrollRef,
    currentSlide,
    setCurrentSlide,
    scrollReviews
  };
};
