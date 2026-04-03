import SEOMeta from '../components/SEOMeta';

import HeroCarousel from '../components/home/HeroCarousel';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductSection from '../components/home/ProductSection';
import PromoBanner from '../components/home/PromoBanner';
import Testimonials from '../components/home/Testimonials';

import { HomeSkeleton } from '../components/common/Skeleton';
import { useHome } from '../hooks/useHome';

const HomePage = () => {
  const {
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
  } = useHome();

  // Early return MUST be after all Hooks for Rules of Hooks compliance
  if (catalogLoading) return <HomeSkeleton />;

  return (
    <div className="bg-transparent dark:bg-[#121212] transition-colors duration-300 min-h-screen">
      <SEOMeta
        title="Home"
        description="Shop high quality jewellery — rings, bangles, earrings and more. Best collections for every occasion."
      />
      <HeroCarousel 
        slides={heroSlides} 
        currentSlide={currentSlide} 
        setCurrentSlide={setCurrentSlide} 
      />
      
      <CategoryGrid categories={categories} />

      <ProductSection 
        title="NEW ITEMS" 
        products={featuredProducts} 
        viewAllLink="/shop?sortBy=createdAt&sortOrder=desc" 
        loading={catalogLoading}
        toggleItem={toggleItem}
        isInWishlist={isInWishlist}
        addItem={addItem}
        limit={5}
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
          limit={5}
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
