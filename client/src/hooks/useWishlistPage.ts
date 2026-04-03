import { useCart } from '../store/useCart';
import { useWishlist } from '../store/useWishlist';

export const useWishlistPage = () => {
  const { addItem } = useCart();
  const { items, toggleItem, isInWishlist } = useWishlist();

  const mappedItems = items.map((item: any) => ({
    ...item,
    images: (item.images && item.images.length > 0) 
      ? item.images 
      : (item.image ? [{ imageUrl: item.image, isPrimary: true }] : []),
    discountedPrice: item.discountedPrice || item.price || 0,
    basePrice: item.basePrice || item.price || 0,
    category: item.category || 'Collection'
  }));

  return {
    items,
    mappedItems,
    addItem,
    toggleItem,
    isInWishlist
  };
};
