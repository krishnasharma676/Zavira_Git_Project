import { create } from 'zustand';
import api from '../api/axios';

interface CatalogStore {
  allProducts: any[];
  categories: any[];
  banners: any[];
  testimonials: any[];
  loading: boolean;
  isInitialLoaded: boolean;
  loadCatalog: () => Promise<void>;
  getProductBySlug: (slug: string) => any;
}

export const useCatalogStore = create<CatalogStore>((set, get) => ({
  allProducts: [],
  categories: [],
  banners: [],
  testimonials: [],
  loading: false,
  isInitialLoaded: false,
  
  loadCatalog: async () => {
    // Already loading or loaded
    if (get().loading || get().isInitialLoaded) return;
    
    set({ loading: true });
    try {
      const { data } = await api.get('/products/home-data');
      const homeData = data.data;
      
      set({
        allProducts: homeData.allProducts || [],
        categories: homeData.categories || [],
        banners: homeData.banners || [],
        testimonials: homeData.testimonials || [],
        isInitialLoaded: true
      });
    } catch (e) {
      console.error('Core catalog fetch failed');
    } finally {
      set({ loading: false });
    }
  },
  
  getProductBySlug: (slug: string) => {
    return get().allProducts.find((p: any) => p.slug === slug);
  }
}));
