/**
 * Shared utility to expand a product list so each variant appears
 * as its own card with the correct images and sizes.
 * Used by: HomePage, ShopPage, HotDeals, CartDrawer, etc.
 */
export function expandProductsByVariant(products: any[]): any[] {
  const list: any[] = [];
  products.forEach((p) => {
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach((v: any) => {
        list.push({
          ...p,
          _cardKey: `${p.id}-${v.id}`,
          currentVariantId: v.id,
          currentVariantSizes: v.sizes || [],
          images:
            v.images && v.images.length > 0 ? v.images : p.images,
          isVariantCard: true,
        });
      });
    } else {
      list.push(p);
    }
  });
  return list;
}

/**
 * Derive the primary display image for a product or variant card.
 */
export function getPrimaryImage(product: any, fallback = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop'): string {
  if (!product) return fallback;
  return (
    product.image || // Check for pre-formatted single image (Wishlist/Cart)
    product.images?.find((img: any) => img.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    product.variants?.[0]?.images?.find((img: any) => img.isPrimary)?.imageUrl ||
    product.variants?.[0]?.images?.[0]?.imageUrl ||
    fallback
  );
}
