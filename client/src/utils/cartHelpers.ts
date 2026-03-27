import toast from 'react-hot-toast';
import { getPrimaryImage } from './productHelpers';

/**
 * Formats a product for the cart
 */
export const formatCartItem = (product: any, selectedVariant: any, selectedSize: string, quantity: number) => {
  const hasVariants = product.variants && product.variants.length > 0;
  
  const primaryImage = getPrimaryImage(selectedVariant || product);
  const price = product.discountedPrice || product.discountPrice || product.basePrice || 0;
  
  const stock = hasVariants 
    ? (selectedVariant?.sizes?.find((s: any) => s.size === selectedSize)?.stock || 0)
    : (product.inventory?.stock || 0);

  const sku = hasVariants
    ? (selectedVariant?.sizes?.find((s: any) => s.size === selectedSize)?.sku || selectedVariant?.sku)
    : (product.inventory?.sku || String(product.id || '').slice(0, 6).toUpperCase());

  return {
    id: product.id,
    variantId: selectedVariant?.id,
    name: product.name,
    price: price,
    quantity: quantity,
    image: primaryImage,
    stock: stock,
    selectedSize: selectedSize || undefined,
    slug: product.slug,
    sku: sku,
    cartItemId: `${product.id}-${selectedVariant?.id || 'base'}-${selectedSize || 'none'}`
  };
};

/**
 * Common Add to Cart Logic with validation and toasts
 */
export const performAddToCart = (
  product: any, 
  selectedVariant: any, 
  selectedSize: string, 
  quantity: number, 
  addItem: (item: any) => void
) => {
  const hasVariants = product.variants && product.variants.length > 0;

  // Validation
  if (hasVariants && !selectedVariant) {
    toast.error("Please select a color first");
    return false;
  }

  const stock = hasVariants 
    ? (selectedVariant?.sizes?.find((s: any) => s.size === selectedSize)?.stock || 0)
    : (product.inventory?.stock || 0);

  if (stock <= 0) {
    toast.error("This selection is currently out of stock");
    return false;
  }

  let availableSizes: string[] = [];
  if (hasVariants) {
    availableSizes = selectedVariant?.sizes?.map((s: any) => s.size) || [];
  } else if (product?.sizes) {
    if (typeof product.sizes === 'string') {
      availableSizes = product.sizes.split(',').map((s: string) => s.trim()).filter(Boolean);
    } else if (Array.isArray(product.sizes)) {
      availableSizes = product.sizes;
    }
  }

  if (availableSizes.length > 0 && !selectedSize) {
    toast.error("Please select a size first");
    return false;
  }

  if (quantity > stock) {
    toast.error(`Only ${stock} items available in stock`);
    return false;
  }

  // Execute
  const cartItem = formatCartItem(product, selectedVariant, selectedSize, quantity);
  addItem(cartItem);
  
  toast.success(`${product.name} added to cart`, {
    style: { background: '#000', color: '#fff', fontSize: '10px', fontWeight: '900', borderRadius: '12px' }
  });

  return true;
};
