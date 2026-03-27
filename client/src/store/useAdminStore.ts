import { create } from 'zustand';
import api from '../api/axios';

interface AdminStore {
  categories: any[];
  colors: any[];
  loading: boolean;
  isInitialLoaded: boolean;
  isColorsLoaded: boolean;
  setCategories: (categories: any[]) => void;
  fetchMetadata: () => Promise<void>;
  refreshMetadata: () => Promise<void>;
  fetchColors: () => Promise<void>;
  refreshColors: () => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  categories: [],
  colors: [],
  loading: false,
  isInitialLoaded: false,
  isColorsLoaded: false,

  setCategories: (categories) => set({ categories }),

  fetchMetadata: async () => {
    if (get().loading || get().isInitialLoaded) return;
    await get().refreshMetadata();
  },

  refreshMetadata: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/categories');
      set({ 
        categories: data.data, 
        isInitialLoaded: true 
      });
    } catch (error) {
      console.error('Failed to load admin metadata:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchColors: async () => {
    if (get().loading || get().isColorsLoaded) return;
    await get().refreshColors();
  },

  refreshColors: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/colors');
      set({ 
        colors: data.data, 
        isColorsLoaded: true 
      });
    } catch (error) {
      console.error('Failed to load colors:', error);
    } finally {
      set({ loading: false });
    }
  }
}));
