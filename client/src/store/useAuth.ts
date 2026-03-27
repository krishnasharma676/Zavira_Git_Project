import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCart } from './useCart';

interface User {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: async (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
        
        const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
        
        if (!isAdmin) {
          // After auth is active, merge any guest cart items and sync from server
          const cartItems = useCart.getState().items;
          if (cartItems.length > 0) {
            await useCart.getState().bulkSync(cartItems);
          } else {
            await useCart.getState().syncCart();
          }
        }
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        // Make sure to completely clear the cart storage locally
        useCart.setState({ items: [] });
        localStorage.removeItem('cart-storage');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
