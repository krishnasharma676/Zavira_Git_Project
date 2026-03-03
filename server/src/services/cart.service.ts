import { cartRepository } from "../repositories/cart.internal";
import { productRepository } from "../repositories/product.internal";
import { ApiError } from "../utils/ApiError";

export class CartService {
  async getCart(userId: string) {
    return await cartRepository.getCart(userId);
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await productRepository.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    
    // Check stock
    if (product.inventory && product.inventory.stock < quantity) {
      throw new ApiError(400, "Insufficient stock");
    }

    return await cartRepository.addItem(userId, productId, quantity);
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const product = await productRepository.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    if (product.inventory && product.inventory.stock < quantity) {
      throw new ApiError(400, "Insufficient stock");
    }

    return await cartRepository.updateQuantity(userId, productId, quantity);
  }

  async removeItem(userId: string, productId: string) {
    return await cartRepository.removeItem(userId, productId);
  }

  async clearCart(userId: string) {
    return await cartRepository.clearCart(userId);
  }
}

export const cartService = new CartService();
