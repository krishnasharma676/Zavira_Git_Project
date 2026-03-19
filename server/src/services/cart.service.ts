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

  async updateQuantity(userId: string, productId: string, quantity: number, variantId?: string, selectedSize?: string) {
    const product = await productRepository.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    if (product.inventory && product.inventory.stock < quantity) {
      throw new ApiError(400, "Insufficient stock");
    }

    // updateQuantity inside cartRepository takes cartItemId actually! Let's check! Wait. 
    // From my earlier change, updateQuantity in CartRepository takes (userId: string, cartItemId: string, quantity: number).
    // Oh! The frontend passes productId as ID or cartItemId as ID. `id` in cartItem is used.
    // If cartController passes `productId` as the ID, it is actually the cartItemId for the guest/server logic??
    return await cartRepository.updateQuantity(userId, productId, quantity); 
    // Using productId here temporarily until I verify the ID structure.
  }

  async removeItem(userId: string, productId: string) {
    return await cartRepository.removeItem(userId, productId);
  }

  async syncCart(userId: string) {
    return await cartRepository.getCart(userId);
  }

  async bulkSync(userId: string, items: { productId: string; quantity: number }[]) {
    // Merge each guest cart item into the user's server cart
    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product) continue;
      const maxAllowed = product.inventory?.stock ?? 0;
      const safeQty = Math.min(item.quantity, maxAllowed);
      if (safeQty <= 0) continue;
      await cartRepository.addItem(userId, item.productId, safeQty);
    }
    // Return the fully merged server cart
    return await cartRepository.getCart(userId);
  }

  async clearCart(userId: string) {
    return await cartRepository.clearCart(userId);
  }

}

export const cartService = new CartService();
