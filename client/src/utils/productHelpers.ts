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
export function getPrimaryImage(product: any, fallback = ''): string {
  return (
    product.images?.find((img: any) => img.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    product.variants?.[0]?.images?.find((img: any) => img.isPrimary)?.imageUrl ||
    product.variants?.[0]?.images?.[0]?.imageUrl ||
    fallback
  );
}
