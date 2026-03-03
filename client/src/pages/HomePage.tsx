import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useCart } from '../store/useCart';
import { useWishlist } from '../store/useWishlist';

import HeroCarousel from '../components/home/HeroCarousel';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductSection from '../components/home/ProductSection';
import PromoBanner from '../components/home/PromoBanner';
import Testimonials from '../components/home/Testimonials';
import FaqSection from '../components/home/FaqSection';

const HomePage = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, trendRes, catRes, bannerRes] = await Promise.all([
          api.get('/products', { params: { featured: true, limit: 8 } }),
          api.get('/products', { params: { trending: true, limit: 8 } }),
          api.get('/categories'),
          api.get('/banners')
        ]);
        
        const cats = catRes.data.data;
        setFeaturedProducts(featRes.data.data.products);
        setTrendingProducts(trendRes.data.data.products);
        setCategories(cats);

        // Fetch products for each category (latest 4)
        const catProds: any = {};
        await Promise.all(cats.slice(0, 5).map(async (cat: any) => {
          try {
            const { data } = await api.get('/products', { 
              params: { category: cat.slug, limit: 4 } 
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
        setHeroSlides(heroBanners.length > 0 ? heroBanners : getDefaultSlides());
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

  const getDefaultSlides = () => [
    {
      imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2000',
      subtitle: "Spring Collection '26",
      title: 'Everyday Elegance',
      description: 'Minimalist designs that make a definitive statement.',
      link: '/shop'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2000',
      subtitle: 'Bridal Series',
      title: 'The Royal Edition',
      description: 'Intricately crafted masterpiece to make you shine on your day.',
      link: '/shop'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2000',
      subtitle: 'Precious Stones',
      title: 'Radiant Gems',
      description: 'Sourced gracefully to bring the natural beauty to your vault.',
      link: '/shop'
    }
  ];

  return (
    <div className="bg-[#F9F9F9] dark:bg-[#121212] transition-colors duration-300 min-h-screen">
      <HeroCarousel 
        slides={heroSlides} 
        currentSlide={currentSlide} 
        setCurrentSlide={setCurrentSlide} 
      />
      
      <CategoryGrid categories={categories} />

      <ProductSection 
        title="WHAT'S NEW IN STORE" 
        products={featuredProducts} 
        viewAllLink="/shop?featured=true" 
        loading={loading}
        toggleItem={toggleItem}
        isInWishlist={isInWishlist}
        addItem={addItem}
      />

      <ProductSection 
        title="TRENDING NOW" 
        products={trendingProducts} 
        viewAllLink="/shop?trending=true" 
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

      <PromoBanner />

      <Testimonials 
        scrollRef={reviewScrollRef} 
        scrollReviews={scrollReviews} 
      />

      <FaqSection 
        activeFaq={activeFaq} 
        setActiveFaq={setActiveFaq} 
      />
    </div>
  );
};

export default HomePage;

