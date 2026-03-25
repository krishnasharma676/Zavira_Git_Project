import { useState, useEffect, useCallback, useRef } from 'react';
import { Search } from 'lucide-react';
import { useWishlist } from '../store/useWishlist';
import { useSearchParams, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../store/useCart';
import { expandProductsByVariant } from '../utils/productHelpers';
import SEOMeta from '../components/SEOMeta';

import ShopHeader from '../components/shop/ShopHeader';
import ProductGrid from '../components/shop/ProductGrid';
import FilterDrawer from '../components/shop/FilterDrawer';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter States from URL
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const isHotDealsRoot = location.pathname === '/hot-deals';
  const hotDealsParam = searchParams.get('hotDeals') === 'true';
  const hotDeals = isHotDealsRoot || hotDealsParam;
  
  // Dynamic New Filters
  const stockStatus = searchParams.get('stockStatus') || '';
  const color = searchParams.get('color') || '';
  const size = searchParams.get('size') || '';
  const attributesParam = searchParams.get('attributes') || '{}';

  const [priceRange, setPriceRange] = useState(parseInt(searchParams.get('maxPrice') || '20000'));
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();


  const fetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(() => {
    // Debounce: wait 300ms after the last filter change before firing
    if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
    fetchTimerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params: any = {
          limit: 40,
          category: category || undefined,
          search: search || undefined,
          maxPrice: priceRange,
          sortBy,
          sortOrder,
          hotDeals: hotDeals || undefined,
          stockStatus: stockStatus || undefined,
          color: color || undefined,
          size: size || undefined,
          attributes: attributesParam !== '{}' ? attributesParam : undefined
        };
        const { data } = await api.get('/products', { params });
        setProducts(expandProductsByVariant(data.data.products));
      } catch {
        // Silent fail — grid stays intact
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [category, search, priceRange, sortBy, sortOrder, hotDeals, stockStatus, color, size, attributesParam]);

  useEffect(() => {
    fetchProducts();
    return () => {
      if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
    };
  }, [fetchProducts]);

  const sortOptions = [
    { label: 'Newest Arrivals', val: 'createdAt', order: 'desc' },
    { label: 'Price: Low to High', val: 'basePrice', order: 'asc' },
    { label: 'Price: High to Low', val: 'basePrice', order: 'desc' },
    { label: 'Alphabetical: A-Z', val: 'name', order: 'asc' },
    { label: 'Alphabetical: Z-A', val: 'name', order: 'desc' },
  ];

  const updateSort = (option: any) => {
    setSortBy(option.val);
    setSortOrder(option.order);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', option.val);
    newParams.set('sortOrder', option.order);
    setSearchParams(newParams);
  };

  const [stockStatusState, setStockStatusState] = useState(searchParams.get('stockStatus') || '');
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [selectedAttrs, setSelectedAttrs] = useState<any>(JSON.parse(searchParams.get('attributes') || '{}'));

  useEffect(() => {
    setStockStatusState(searchParams.get('stockStatus') || '');
    setSelectedColor(searchParams.get('color') || '');
    setSelectedSize(searchParams.get('size') || '');
    setSelectedAttrs(JSON.parse(searchParams.get('attributes') || '{}'));
  }, [searchParams]);

  const applyFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.set('maxPrice', priceRange.toString());
    
    if (stockStatusState) next.set('stockStatus', stockStatusState);
    else next.delete('stockStatus');
    
    if (selectedColor) next.set('color', selectedColor);
    else next.delete('color');

    if (selectedSize) next.set('size', selectedSize);
    else next.delete('size');
    
    if (Object.keys(selectedAttrs).length > 0) {
      next.set('attributes', JSON.stringify(selectedAttrs));
    } else {
      next.delete('attributes');
    }
    
    setSearchParams(next);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSearchParams({});
    setIsFilterOpen(false);
    setPriceRange(20000);
    setStockStatusState('');
    setSelectedColor('');
    setSelectedSize('');
    setSelectedAttrs({});
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
          loading={loading}
          toggleItem={toggleItem}
          isInWishlist={isInWishlist}
          addItem={addItem}
          setSearchParams={setSearchParams}
        />

        <FilterDrawer 
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          products={products}
          stockStatus={stockStatusState}
          setStockStatus={setStockStatusState}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedAttrs={selectedAttrs}
          setSelectedAttrs={setSelectedAttrs}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
        />

      </div>
    </div>
  );
};

export default ShopPage;

