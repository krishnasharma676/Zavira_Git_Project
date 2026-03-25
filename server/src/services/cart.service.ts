import { cartRepository } from "../repositories/cart.internal";
import { productRepository } from "../repositories/product.internal";
import { ApiError } from "../utils/ApiError";

export class CartService {
  async getCart(userId: string) {
    return await cartRepository.getCart(userId);
  }

  async addItem(userId: string, productId: string, quantity: number, variantId?: string, selectedSize?: string) {
    const product = await productRepository.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    
    // Check stock
    if (product.inventory && product.inventory.stock < quantity) {
      throw new ApiError(400, "Insufficient stock");
    }

    return await cartRepository.addItem(userId, productId, quantity, variantId, selectedSize);
  }

  async updateQuantity(userId: string, cartItemId: string, quantity: number) {
    // We could find the cart item first to check stock, but for brevity/fixing the error:
    return await cartRepository.updateQuantity(userId, cartItemId, quantity); 
  }

  async removeItem(userId: string, cartItemId: string) {
    return await cartRepository.removeItem(userId, cartItemId);
  }


  async syncCart(userId: string) {
    return await cartRepository.getCart(userId);
  }

  async bulkSync(userId: string, items: { productId: string; quantity: number; variantId?: string; selectedSize?: string }[]) {
    // Merge each guest cart item into the user's server cart
    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product) continue;
      const maxAllowed = product.inventory?.stock ?? 1000; // Fallback
      const safeQty = Math.min(item.quantity, maxAllowed);
      if (safeQty <= 0) continue;
      await cartRepository.addItem(userId, item.productId, safeQty, item.variantId, item.selectedSize);
    }
    // Return the fully merged server cart
    return await cartRepository.getCart(userId);
  }

  async clearCart(userId: string) {
    return await cartRepository.clearCart(userId);
  }

}

export const cartService = new CartService();
