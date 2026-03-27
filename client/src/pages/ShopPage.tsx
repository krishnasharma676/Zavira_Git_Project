import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useWishlist } from '../store/useWishlist';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../store/useCart';
import { expandProductsByVariant } from '../utils/productHelpers';
import { useCatalogStore } from '../store/useCatalogStore';
import SEOMeta from '../components/SEOMeta';

import ShopHeader from '../components/shop/ShopHeader';
import ProductGrid from '../components/shop/ProductGrid';
import FilterDrawer from '../components/shop/FilterDrawer';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { allProducts, categories, loading: catalogLoading, isInitialLoaded } = useCatalogStore();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // ── FILTER CONSTANTS (Derived from URL) ──
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search')?.toLowerCase() || '';
  const isHotDealsRoot = location.pathname === '/hot-deals';
  const hotDealsParam = searchParams.get('hotDeals') === 'true';
  const hotDeals = isHotDealsRoot || hotDealsParam;
  const stockStatus = searchParams.get('stockStatus') || '';
  const color = searchParams.get('color') || '';
  const size = searchParams.get('size') || '';
  const attributesParam = searchParams.get('attributes') || '{}';
  const priceRange = Number(searchParams.get('maxPrice')) || 20000;
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  // ── LOCAL UI STATES (For the Filter Drawer temporary selection) ──
  const [localPrice, setLocalPrice] = useState(priceRange);
  const [localStock, setLocalStock] = useState(stockStatus);
  const [localColor, setLocalColor] = useState(color);
  const [localSize, setLocalSize] = useState(size);
  const [localAttrs, setLocalAttrs] = useState<any>(JSON.parse(attributesParam));

  // Sync local UI states with URL when drawer opens or params change
  useEffect(() => {
    setLocalPrice(priceRange);
    setLocalStock(stockStatus);
    setLocalColor(color);
    setLocalSize(size);
    setLocalAttrs(JSON.parse(attributesParam));
  }, [priceRange, stockStatus, color, size, attributesParam, isFilterOpen]);

  // ── CORE DATA FILTERING (In-Memory) ──
  const products = useMemo(() => {
    if (!isInitialLoaded) return [];

    let list = [...allProducts];

    // Filter: Category
    if (category) {
      list = list.filter(p => p.categoryId === category || p.category?.slug === category || p.category?.id === category);
    }

    // Filter: Search
    if (search) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description?.toLowerCase().includes(search)
      );
    }

    // Filter: Hot Deals
    if (hotDeals) {
      list = list.filter(p => p.hotDeals === true);
    }

    // Filter: Price
    list = list.filter(p => {
      const price = p.discountedPrice || p.basePrice || 0;
      return price <= priceRange;
    });

    // Filter: Stock
    if (stockStatus === 'inStock') {
      list = list.filter(p => (p.inventory?.stock || 0) > 0);
    } else if (stockStatus === 'outOfStock') {
       list = list.filter(p => (p.inventory?.stock || 0) <= 0);
    }

    // Filter: Color (Checking variants)
    if (color) {
      list = list.filter(p => p.variants?.some((v: any) => v.color?.toLowerCase().includes(color.toLowerCase())));
    }

    // Filter: Size (Checking variants and plain sizes)
    if (size) {
      list = list.filter(p => 
        p.sizes?.toLowerCase().includes(size.toLowerCase()) ||
        p.variants?.some((v: any) => v.sizes?.some((s: any) => s.size === size))
      );
    }

    // Sort
    list.sort((a: any, b: any) => {
      let valA, valB;
      if (sortBy === 'basePrice') {
        valA = a.discountedPrice || a.basePrice || 0;
        valB = b.discountedPrice || b.basePrice || 0;
      } else {
        valA = a[sortBy];
        valB = b[sortBy];
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return expandProductsByVariant(list);
  }, [allProducts, isInitialLoaded, category, search, hotDeals, priceRange, stockStatus, color, size, sortBy, sortOrder]);

  const sortOptions = [
    { label: 'Newest Arrivals', val: 'createdAt', order: 'desc' },
    { label: 'Price: Low to High', val: 'basePrice', order: 'asc' },
    { label: 'Price: High to Low', val: 'basePrice', order: 'desc' },
    { label: 'Alphabetical: A-Z', val: 'name', order: 'asc' },
    { label: 'Alphabetical: Z-A', val: 'name', order: 'desc' },
  ];

  const updateSort = (option: any) => {
    const next = new URLSearchParams(searchParams);
    next.set('sortBy', option.val);
    next.set('sortOrder', option.order);
    setSearchParams(next);
  };

  const applyFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.set('maxPrice', localPrice.toString());
    
    if (localStock) next.set('stockStatus', localStock);
    else next.delete('stockStatus');
    
    if (localColor) next.set('color', localColor);
    else next.delete('color');

    if (localSize) next.set('size', localSize);
    else next.delete('size');
    
    if (Object.keys(localAttrs).length > 0) {
      next.set('attributes', JSON.stringify(localAttrs));
    } else {
      next.delete('attributes');
    }
    
    setSearchParams(next);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSearchParams({});
    setIsFilterOpen(false);
  };

  return (
    <div className="pt-8 pb-16 bg-transparent dark:bg-[#121212] min-h-screen font-sans transition-colors duration-300">
      <SEOMeta
        title={category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : (hotDeals ? 'Hot Deals' : 'Shop All')}
        description={`Browse our ${category || 'full'} jewellery collection. Premium quality rings, bangles, earrings and more at Zaviraa.`}
      />
      <div className="container mx-auto px-4">
        
        <ShopHeader 
          category={category}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          setIsFilterOpen={setIsFilterOpen}
          sortBy={sortBy}
          sortOrder={sortOrder}
          updateSort={updateSort}
          sortOptions={sortOptions}
        />

        {search && (
          <div className="mb-8 flex items-center text-gray-500 text-sm font-medium italic">
            <Search size={14} className="mr-2" />
            Showing results for "{search}"
          </div>
        )}

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
          stockStatus={localStock}
          setStockStatus={setLocalStock}
          selectedColor={localColor}
          setSelectedColor={setLocalColor}
          selectedSize={localSize}
          setSelectedSize={setLocalSize}
          selectedAttrs={localAttrs}
          setSelectedAttrs={setLocalAttrs}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
        />

      </div>
    </div>
  );
};

export default ShopPage;
