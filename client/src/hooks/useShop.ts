import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useWishlist } from '../store/useWishlist';
import { useCart } from '../store/useCart';
import { expandProductsByVariant } from '../utils/productHelpers';
import { useCatalogStore } from '../store/useCatalogStore';

export const useShop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { allProducts, categories, loading: catalogLoading, isInitialLoaded } = useCatalogStore();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categoriesParam = searchParams.get('category') || '';
  const search = searchParams.get('search')?.toLowerCase() || '';
  const isHotDealsRoot = location.pathname === '/hot-deals';
  const hotDealsParam = searchParams.get('hotDeals') === 'true';
  const hotDeals = isHotDealsRoot || hotDealsParam;
  const stockStatus = searchParams.get('stockStatus') || '';
  const colorsParam = searchParams.get('colors') || '';
  const size = searchParams.get('size') || '';
  const priceRange = Number(searchParams.get('maxPrice')) || 50000;
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const [localPrice, setLocalPrice] = useState(priceRange);
  const [localStock, setLocalStock] = useState(stockStatus);
  const [localCategories, setLocalCategories] = useState<string[]>(categoriesParam ? categoriesParam.split(',') : []);
  const [localColors, setLocalColors] = useState<string[]>(colorsParam ? colorsParam.split(',') : []);
  const [localSize, setLocalSize] = useState(size);

  useEffect(() => {
    setLocalPrice(priceRange);
    setLocalStock(stockStatus);
    setLocalCategories(categoriesParam ? categoriesParam.split(',') : []);
    setLocalColors(colorsParam ? colorsParam.split(',') : []);
    setLocalSize(size);
  }, [priceRange, stockStatus, categoriesParam, colorsParam, size, isFilterOpen]);

  const products = useMemo(() => {
    if (!isInitialLoaded) return [];

    let list = [...allProducts];

    // 1. Initial Filtering (Base level)
    if (localCategories.length > 0) {
      list = list.filter(p => 
        localCategories.includes(p.categoryId) || 
        (p.category?.slug && localCategories.includes(p.category.slug)) ||
        (p.category?.name && localCategories.includes(p.category.name))
      );
    }

    if (search) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description?.toLowerCase().includes(search)
      );
    }

    if (hotDeals) {
      list = list.filter(p => p.hotDeals === true);
    }

    // 2. Expand to Variant Cards (Individual cards for each color)
    let expanded = expandProductsByVariant(list);

    // 3. Variant Level Filtering (Color/Size/Stock/Price)
    
    // Filter: Price
    expanded = expanded.filter(p => {
       const price = p.discountedPrice || p.basePrice || 0;
       return price <= priceRange;
    });

    // Filter: Stock
    if (stockStatus === 'inStock') {
      expanded = expanded.filter(p => (p.inventory?.stock || 0) > 0 || (p.currentVariantSizes?.some((s: any) => s.stock > 0)));
    } else if (stockStatus === 'outOfStock') {
       expanded = expanded.filter(p => !((p.inventory?.stock || 0) > 0 || p.currentVariantSizes?.some((s: any) => s.stock > 0)));
    }

    // Filter: Colors (Deduplicated Names)
    if (localColors.length > 0) {
      const normalizedSelected = localColors.map(c => c.trim().toUpperCase().replace(/\s+/g, ''));
      expanded = expanded.filter(p => {
        // If product has variants, expansion creates 'isVariantCard' objects
        // We find the specific variant that matches this card
        if (p.isVariantCard) {
           const v = p.variants?.find((varItem: any) => varItem.id === p.currentVariantId);
           if (!v) return false;
           const vColor = (v.color?.name || v.color || '').trim().toUpperCase().replace(/\s+/g, '');
           return normalizedSelected.includes(vColor);
        }
        // For products without variants, they don't have color filters anyway
        return false;
      });
    }

    // Filter: Size
    if (size) {
      expanded = expanded.filter(p => {
        const prodSizeMatch = p.sizes && p.sizes.toLowerCase().includes(size.toLowerCase());
        const varSizeMatch = p.currentVariantSizes?.some((sz: any) => sz.size.trim().toLowerCase() === size.toLowerCase());
        return prodSizeMatch || varSizeMatch;
      });
    }

    // Sort Logic
    expanded.sort((a: any, b: any) => {
      let valA, valB;
      if (sortBy === 'basePrice') {
        valA = a.discountedPrice || a.basePrice || 0;
        valB = b.discountedPrice || b.basePrice || 0;
      } else {
        valA = a[sortBy === 'id' ? 'createdAt' : sortBy] || 0;
        valB = b[sortBy === 'id' ? 'createdAt' : sortBy] || 0;
      }
      
      const res = valA < valB ? -1 : valA > valB ? 1 : 0;
      return sortOrder === 'asc' ? res : -res;
    });

    return expanded;
  }, [allProducts, isInitialLoaded, localCategories, localColors, search, hotDeals, priceRange, stockStatus, size, sortBy, sortOrder]);

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
    
    if (localCategories.length > 0) next.set('category', localCategories.join(','));
    else next.delete('category');

    if (localColors.length > 0) next.set('colors', localColors.join(','));
    else next.delete('colors');

    if (localSize) next.set('size', localSize);
    else next.delete('size');
    
    setSearchParams(next);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSearchParams({});
    setIsFilterOpen(false);
  };

  return {
    searchParams,
    setSearchParams,
    navigate,
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
  };
};
