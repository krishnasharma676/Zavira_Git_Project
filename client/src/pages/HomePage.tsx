import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useCart } from '../store/useCart';
import { useWishlist } from '../store/useWishlist';
import { expandProductsByVariant } from '../utils/productHelpers';
import SEOMeta from '../components/SEOMeta';

import HeroCarousel from '../components/home/HeroCarousel';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductSection from '../components/home/ProductSection';
import PromoBanner from '../components/home/PromoBanner';
import Testimonials from '../components/home/Testimonials';

import { useCatalogStore } from '../store/useCatalogStore';

const HomePage = () => {
  const { allProducts, categories, banners, testimonials: reviews, loading: catalogLoading } = useCatalogStore();
  const loading = catalogLoading;
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0); // Keep local state for carousel current slide

  // Derive all data from the global store
  const heroSlides = useMemo(() => banners.filter((b: any) => b.type === 'HERO'), [banners]);
  const promoBanners = useMemo(() => banners.filter((b: any) => b.type === 'PROMO'), [banners]);
  const featuredProducts = useMemo(() =>
    expandProductsByVariant(allProducts.filter(p => p.featured).slice(0, 12)),
    [allProducts]
  );

  // Categorize products locally for categories
  const categoryProducts = useMemo(() => {
    const res: any = {};
    // Limit to top 3 categories for display on homepage, adjust as needed
    categories.slice(0, 3).forEach((cat: any) => {
      const prods = allProducts.filter(p => p.categoryId === cat.id).slice(0, 8); // Limit products per category
      if (prods.length > 0) {
        res[cat.id] = expandProductsByVariant(prods);
      }
    });
    return res;
  }, [allProducts, categories]);

  // Auto-advance hero carousel
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides]);

  // Memoized to avoid creating a new function on every render
  const scrollReviews = useCallback((direction: 'left' | 'right') => {
    if (reviewScrollRef.current) {
      const { scrollLeft, clientWidth } = reviewScrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      reviewScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, []);

  // Only re-compute category sections when data changes
  const categorySections = useMemo(() =>
    categories.filter((cat) => !!categoryProducts[cat.id]),
    [categories, categoryProducts]
  );

  return (
    <div className="bg-transparent dark:bg-[#121212] transition-colors duration-300 min-h-screen">
      <SEOMeta
        title="Home"
        description="Discover Zaviraa's premium jewellery — rings, bangles, earrings and more. Curated collections for every occasion."
      />
      <HeroCarousel 
        slides={heroSlides} 
        currentSlide={currentSlide} 
        setCurrentSlide={setCurrentSlide} 
      />
      
      <CategoryGrid categories={categories} />

      <ProductSection 
        title="WHAT'S NEW IN STORE" 
        products={featuredProducts} 
        viewAllLink="/shop?sortBy=createdAt&sortOrder=desc" 
        loading={loading}
        toggleItem={toggleItem}
        isInWishlist={isInWishlist}
        addItem={addItem}
      />

      {categorySections.map((cat) => (
        <ProductSection 
          key={cat.id}
          title={cat.name} 
          products={categoryProducts[cat.id]} 
          viewAllLink={`/shop?category=${cat.slug}`}
          toggleItem={toggleItem}
          isInWishlist={isInWishlist}
          addItem={addItem}
        />
      ))}

      <PromoBanner banners={promoBanners} />

      {reviews.length > 0 && (
        <Testimonials 
          reviews={reviews}
          scrollRef={reviewScrollRef} 
          scrollReviews={scrollReviews} 
        />
      )}
    </div>
  );
};

export default HomePage;
