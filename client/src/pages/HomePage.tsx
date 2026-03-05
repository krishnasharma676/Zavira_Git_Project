import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useCart } from '../store/useCart';
import { useWishlist } from '../store/useWishlist';

import HeroCarousel from '../components/home/HeroCarousel';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductSection from '../components/home/ProductSection';
import PromoBanner from '../components/home/PromoBanner';
import Testimonials from '../components/home/Testimonials';

const HomePage = () => {
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [promoBanners, setPromoBanners] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<any>({});
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, catRes, bannerRes, reviewRes] = await Promise.all([
          api.get('/products', { params: { limit: 4, sortBy: 'createdAt', sortOrder: 'desc' } }),
          api.get('/categories'),
          api.get('/banners'),
          api.get('/testimonials').catch(() => ({ data: { data: [] } }))
        ]);
        
        const cats = catRes.data.data;
        setFeaturedProducts(featRes.data.data.products);
        setCategories(cats);
        setReviews(reviewRes.data.data);

        // Fetch products for each category (latest 4)
        const catProds: any = {};
        await Promise.all(cats.map(async (cat: any) => {
          try {
            const { data } = await api.get('/products', { 
              params: { category: cat.id, limit: 4 } 
            });
            if (data.data.products.length > 0) {
              catProds[cat.id] = data.data.products;
            }
          } catch {
            // silently skip unavailable category
          }
        }));
        setCategoryProducts(catProds);

        const heroBanners = bannerRes.data.data.filter((b: any) => b.type === 'HERO');
        setHeroSlides(heroBanners);
        setPromoBanners(bannerRes.data.data.filter((b: any) => b.type === 'PROMO'));
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides]);

  const scrollReviews = (direction: 'left' | 'right') => {
    if (reviewScrollRef.current) {
      const { scrollLeft, clientWidth } = reviewScrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      reviewScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Static fallback removed as per user request

  return (
    <div className="bg-transparent dark:bg-[#121212] transition-colors duration-300 min-h-screen">
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

      {categories.map((cat) => (
        categoryProducts[cat.id] && (
          <ProductSection 
            key={cat.id}
            title={cat.name} 
            products={categoryProducts[cat.id]} 
            viewAllLink={`/shop?category=${cat.slug}`}
            toggleItem={toggleItem}
            isInWishlist={isInWishlist}
            addItem={addItem}
          />
        )
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

