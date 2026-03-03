import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useWishlist } from '../store/useWishlist';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../store/useCart';
import toast from 'react-hot-toast';

import ShopHeader from '../components/shop/ShopHeader';
import ProductGrid from '../components/shop/ProductGrid';
import FilterDrawer from '../components/shop/FilterDrawer';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter States from URL
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const [priceRange, setPriceRange] = useState(parseInt(searchParams.get('maxPrice') || '10000'));
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        limit: 20,
        category: category || undefined,
        search: search || undefined,
        maxPrice: priceRange,
        sortBy,
        sortOrder
      };
      
      const { data } = await api.get('/products', { params });
      setProducts(data.data.products);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [category, search, priceRange, sortBy, sortOrder]);

  useEffect(() => {
    fetchProducts();
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

  const applyFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.set('maxPrice', priceRange.toString());
    setSearchParams(next);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSearchParams({});
    setIsFilterOpen(false);
    setPriceRange(10000);
  };

  return (
    <div className="pt-8 pb-16 bg-white dark:bg-[#121212] min-h-screen font-sans transition-colors duration-300">
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
          applyFilters={applyFilters}
          clearFilters={clearFilters}
        />

      </div>
    </div>
  );
};

export default ShopPage;

