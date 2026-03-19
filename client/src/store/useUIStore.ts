import { create } from 'zustand';

interface UIStore {
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  isCheckoutModalOpen: boolean;
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  openCheckoutModal: () => void;
  closeCheckoutModal: () => void;
  setAuthModalTab: (tab: 'login' | 'register') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isAuthModalOpen: false,
  authModalTab: 'login',
  isCheckoutModalOpen: false,
  openAuthModal: (tab = 'login') => set({ isAuthModalOpen: true, authModalTab: tab }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  openCheckoutModal: () => set({ isCheckoutModalOpen: true }),
  closeCheckoutModal: () => set({ isCheckoutModalOpen: false }),
  setAuthModalTab: (tab) => set({ authModalTab: tab }),
}));
