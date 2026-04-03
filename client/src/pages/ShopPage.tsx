import { ShopSkeleton } from '../components/common/Skeleton';
import SEOMeta from '../components/SEOMeta';

import ShopHeader from '../components/shop/ShopHeader';
import ProductGrid from '../components/shop/ProductGrid';
import FilterDrawer from '../components/shop/FilterDrawer';
import { useShop } from '../hooks/useShop';

const ShopPage = () => {
  const {
    searchParams,
    setSearchParams,
    allProducts,
    categories,
    catalogLoading,
    isInitialLoaded,
    isFilterOpen,
    setIsFilterOpen,
    categoriesParam,
    hotDeals,
    sortBy,
    sortOrder,
    products,
    sortOptions,
    updateSort,
    applyFilters,
    clearFilters,
    localPrice,
    setLocalPrice,
    localStock,
    setLocalStock,
    localCategories,
    setLocalCategories,
    localColors,
    setLocalColors,
    localSize,
    setLocalSize,
    toggleItem,
    isInWishlist,
    addItem
  } = useShop();

  if (catalogLoading && !isInitialLoaded) return <ShopSkeleton />;

  return (
    <div className="pt-8 pb-16 bg-transparent dark:bg-[#121212] min-h-screen font-sans transition-colors duration-300">
      <SEOMeta
        title={categoriesParam ? "Filtered Boutique" : (hotDeals ? 'Exclusive Deals' : 'Shop All')}
        description="Browse our curated premium jewellery. Filter by category, color, and price to find your perfect match."
      />
      <div className="container mx-auto px-4">
        
        <ShopHeader 
          category={categoriesParam} 
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          setIsFilterOpen={setIsFilterOpen}
          sortBy={sortBy}
          sortOrder={sortOrder}
          updateSort={updateSort}
          sortOptions={sortOptions} 
        />

        <ProductGrid 
          products={products}
          loading={false}
          toggleItem={toggleItem}
          isInWishlist={isInWishlist}
          addItem={addItem}
          setSearchParams={setSearchParams}
        />

        <FilterDrawer 
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          priceRange={localPrice}
          setPriceRange={setLocalPrice}
          products={allProducts}
          categories={categories}
          stockStatus={localStock}
          setStockStatus={setLocalStock}
          selectedCategories={localCategories}
          setSelectedCategories={setLocalCategories}
          selectedColors={localColors}
          setSelectedColors={setLocalColors}
          selectedSize={localSize}
          setSelectedSize={setLocalSize}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
        />
      </div>
    </div>
  );
};

export default ShopPage;
