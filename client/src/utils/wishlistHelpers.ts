import toast from 'react-hot-toast';
import { getPrimaryImage } from './productHelpers';

export const formatWishlistItem = (product: any, primaryPrice: number) => {
  return {
    id: product.id,
    name: product.name,
    price: primaryPrice || product.discountedPrice || product.basePrice || 0,
    category: product.category?.name || product.category || 'Collection',
    image: getPrimaryImage(product, 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop'),
    slug: product.slug,
    discountedPrice: product.discountedPrice,
    basePrice: product.basePrice,
    images: (product.images && product.images.length > 0) ? product.images : (product.image ? [{ imageUrl: product.image, isPrimary: true }] : [])
  };
};

export const performToggleWishlist = (
  product: any,
  primaryPrice: number,
  toggleItem: (item: any) => void,
  isInWishlist: (id: string) => boolean
) => {
  const item = formatWishlistItem(product, primaryPrice);
  toggleItem(item);
  
  if (!isInWishlist(product.id)) {
    toast.success('SAVED TO VAULT', {
      style: { background: '#7A578D', color: '#fff', fontSize: '10px', fontWeight: '900', borderRadius: '12px' }
    });
  }
};
