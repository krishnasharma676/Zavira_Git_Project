import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from './useAuth';

interface CartItem {
  id: string; // This is the old productId
  cartItemId?: string; // unique local ID if needed
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  discountedPrice?: number;
  selectedSize?: string;
  variantId?: string;
  taxRate?: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>; // Fetch from server
  bulkSync: (localItems: CartItem[]) => Promise<void>; // Merge local into server on login
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: async (item) => {
        const state = get();
        const isAuthenticated = useAuth.getState().isAuthenticated;
        
        const existingItem = state.items.find((i) => i.id === item.id);
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const newQuantity = currentQuantity + item.quantity;

        if (newQuantity > item.stock) {
          toast.error(`Only ${item.stock} pieces available in vault`);
          return;
        }

        // If authenticated, send to backend
        if (isAuthenticated) {
          try {
            await api.post('/cart/add', { 
              productId: item.id, 
              quantity: item.quantity,
              selectedSize: item.selectedSize,
              variantId: item.variantId
            });
            await get().syncCart();
            return;
          } catch (err) {
            toast.error('Failed to add item to cart');
            return;
          }
        }

        // Guest logic
        if (existingItem && existingItem.selectedSize === item.selectedSize && existingItem.variantId === item.variantId) {
          set({
            items: state.items.map((i) =>
              (i.id === item.id && i.selectedSize === item.selectedSize) 
                ? { ...i, quantity: newQuantity } : i
            ),
          });
        } else {
          set({ items: [...state.items, { ...item, cartItemId: item.cartItemId || Date.now().toString() }] });
        }
      },
      removeItem: async (id) => {
        const state = get();
        const isAuthenticated = useAuth.getState().isAuthenticated;

        if (isAuthenticated) {
          try {
            await api.delete(`/cart/remove/${id}`);
            await get().syncCart();
            return;
          } catch (err) {
            toast.error('Failed to remove item');
            return;
          }
        }

        // Guest logic
        set({
          items: state.items.filter((i) => i.cartItemId !== id),
        });
      },
      updateQuantity: async (id, quantity) => {
        const state = get();
        const isAuthenticated = useAuth.getState().isAuthenticated;
        
        const item = state.items.find((i) => i.id === id);
        if (item && quantity > item.stock) {
          toast.error(`Stock limit reached: ${item.stock} pieces`);
          return;
        }

        if (isAuthenticated) {
          try {
            await api.patch('/cart/update', { productId: id, quantity });
            await get().syncCart();
            return;
          } catch (err) {
            toast.error('Failed to update cart');
            return;
          }
        }

        // Guest logic
        set({
          items: state.items.map((i) =>
            i.cartItemId === id ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: async () => {
         const isAuthenticated = useAuth.getState().isAuthenticated;
         if (isAuthenticated) {
            try {
               await api.delete('/cart/clear');
            } catch (err) {
               console.error('Failed to clear server cart');
            }
         }
         set({ items: [] });
      },
      syncCart: async () => {
         try {
            const { data: res } = await api.get('/cart/sync');
            const serverCart = res.data;
            if (serverCart && serverCart.items) {
               const parsedItems = serverCart.items.map((si: any) => ({
                  id: si.product.id,
                  cartItemId: si.id, // backend cart item ID
                  name: si.product.name,
                  price: si.product.discountedPrice || si.product.basePrice,
                  quantity: si.quantity,
                  image: si.product.images?.[0]?.imageUrl || '',
                  stock: si.product.inventory?.stock || 0,
                  selectedSize: si.selectedSize,
                  variantId: si.variantId,
                  taxRate: si.product.taxRate,
               }));
               set({ items: parsedItems });
            } else {
               set({ items: [] });
            }
         } catch (err) {
            console.error('Failed to sync cart with server');
         }
      },
      bulkSync: async (localItems) => {
         if (localItems.length === 0) return;
         
         const payload = localItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
         }));

         try {
            const { data: res } = await api.post('/cart/bulk-sync', { items: payload });
            const serverCart = res.data;
            if (serverCart && serverCart.items) {
               const parsedItems = serverCart.items.map((si: any) => ({
                  id: si.product.id,
                  cartItemId: si.id,
                  name: si.product.name,
                  price: si.product.discountedPrice || si.product.basePrice,
                  quantity: si.quantity,
                  image: si.product.images?.[0]?.imageUrl || '',
                  stock: si.product.inventory?.stock || 0,
                  selectedSize: si.selectedSize,
                  variantId: si.variantId,
                  taxRate: si.product.taxRate,
               }));
               set({ items: parsedItems });
            }
         } catch (err) {
            console.error('Failed to bulk sync cart');
         }
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
