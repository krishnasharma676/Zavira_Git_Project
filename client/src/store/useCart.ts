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
  slug?: string;
  colorCode?: string;
}


interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;

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

        // Guest logic - check uniqueness by ID, size AND variant
        const isDuplicate = state.items.some(i => i.id === item.id && i.selectedSize === item.selectedSize && i.variantId === item.variantId);
        
        if (isDuplicate) {
          set({
            items: state.items.map((i) =>
              (i.id === item.id && i.selectedSize === item.selectedSize && i.variantId === item.variantId) 
                ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...state.items, { 
             ...item, 
             cartItemId: item.cartItemId || Date.now().toString(),
             colorCode: item.colorCode 
          }] });
        }
      },
      removeItem: async (cartItemId) => {
        const state = get();
        const isAuthenticated = useAuth.getState().isAuthenticated;

        if (isAuthenticated) {
          try {
            await api.delete(`/cart/remove/${cartItemId}`);
            await get().syncCart();
            return;
          } catch (err) {
            toast.error('Failed to remove item');
            return;
          }
        }

        // Guest logic
        set({
          items: state.items.filter((i) => (i.cartItemId || i.id) !== cartItemId),
        });
      },
      updateQuantity: async (cartItemId, quantity) => {
        const state = get();
        const isAuthenticated = useAuth.getState().isAuthenticated;
        
        const item = state.items.find((i) => (i.cartItemId || i.id) === cartItemId);
        if (item && quantity > item.stock) {
          toast.error(`Stock limit reached: ${item.stock} pieces`);
          return;
        }

        if (isAuthenticated) {
          try {
            // Updated to use the specific cartItemId for patch
            await api.patch('/cart/update', { cartItemId, quantity });
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
            (i.cartItemId || i.id) === cartItemId ? { ...i, quantity } : i
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
                  cartItemId: si.id,
                  name: si.product.name,
                  price: si.product.discountedPrice || si.product.basePrice,
                  quantity: si.quantity,
                  image: si.variant?.images?.[0]?.imageUrl || si.product.images?.[0]?.imageUrl || '',
                  stock: si.variant?.stock || si.product.inventory?.stock || 0,
                  selectedSize: si.selectedSize,
                  variantId: si.variantId,
                  slug: si.product.slug,
                  taxRate: si.product.taxRate,
                  colorCode: si.variant?.colorCode || si.variant?.colorRel?.hexCode || null,
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
            quantity: item.quantity,
            variantId: item.variantId,
            selectedSize: item.selectedSize
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
                  image: si.variant?.images?.[0]?.imageUrl || si.product.images?.[0]?.imageUrl || '',
                  stock: si.variant?.stock || si.product.inventory?.stock || 0,
                  selectedSize: si.selectedSize,
                  variantId: si.variantId,
                  slug: si.product.slug,
                  taxRate: si.product.taxRate,
                  colorCode: si.variant?.colorCode || si.variant?.colorRel?.hexCode || null,
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
