import { useCart } from '../store/useCart';

export const useCartPage = () => {
  const { items, removeItem, updateQuantity } = useCart();

  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
  const tax = subtotal * 0.03; // Luxury tax or GST
  const shipping = subtotal >= 1000 ? 0 : 49;
  const total = subtotal + tax + shipping;

  return {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    tax,
    shipping,
    total
  };
};
