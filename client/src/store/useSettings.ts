import { create } from 'zustand';
import api from '../api/axios';

interface SettingsState {
  settings: Record<string, any>;
  loading: boolean;
  fetchSettings: (force?: boolean) => Promise<void>;
  updateSettings: (newSettings: Record<string, any>) => void;
  setGlobalData: (data: Record<string, any>) => void;
}

export const useSettings = create<SettingsState>((set, get) => ({
  settings: {},
  loading: false,
  fetchSettings: async (force = false) => {
    // If already loaded and not forcing, don't fetch again
    if (!force && Object.keys(get().settings).length > 0) return;
    
    set({ loading: true });
    try {
      const settingsRes = await api.get('/settings');
      set({ settings: settingsRes.data.data || {} });
    } catch (e) {
      console.error('Failed to fetch store settings');
    } finally {
      set({ loading: false });
    }
  },
  updateSettings: (newSettings) => {
    set({ settings: newSettings });
  },
  setGlobalData: (data) => {
    set((state) => ({ ...state, ...data }));
  }
}));
