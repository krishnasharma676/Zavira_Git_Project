import { orderRepository } from "../repositories/order.internal";
import { cartRepository } from "../repositories/cart.internal";
import { productRepository } from "../repositories/product.internal";
import { ApiError } from "../utils/ApiError";
import { v4 as uuidv4 } from 'uuid';

export class OrderService {
  async placeOrder(userId: string, data: any) {
    const { addressId, paymentMethod, items } = data;
    
    // 1. Determine items to process
    let baseItems = [];
    if (items && Array.isArray(items) && items.length > 0) {
      baseItems = items.map(i => ({ productId: i.id || i.productId, quantity: i.quantity }));
    } else {
      const cart = await cartRepository.getCart(userId);
      if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty");
      }
      baseItems = cart.items;
    }

    // 2. Validate Inventory & Calculate Totals
    let totalAmount = 0;
    const itemsToOrder = [];

    for (const item of baseItems) {
      const product = await productRepository.findById(item.productId);
      if (!product || !product.inventory || product.inventory.stock < item.quantity) {
        throw new ApiError(400, `Product ${product?.name || "ID: " + item.productId} is out of stock`);
      }
      
      const price = product.discountedPrice || product.basePrice;
      totalAmount += price * item.quantity;
      itemsToOrder.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price
      });
    }


    const payableAmount = totalAmount;
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 4. Create Order
    const order = await orderRepository.createOrder({
      orderNumber,
      userId,
      addressId,
      totalAmount,
      discountAmount: 0,
      payableAmount,
      paymentMethod,
    }, itemsToOrder);

    // 5. Clear Cart
    await cartRepository.clearCart(userId);

    return order;
  }

  async getMyOrders(userId: string) {
    return await orderRepository.findByUserId(userId);
  }

  async getOrderDetails(id: string, userId: string, role: string) {
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(404, "Order not found");
    
    // Auth check
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN' && order.userId !== userId) {
      throw new ApiError(403, "Access denied");
    }

    return order;
  }

  async updateOrderStatus(id: string, status: any) {
    return await orderRepository.updateStatus(id, status);
  }

  async getAllOrders(filters: any) {
    return await orderRepository.findAllAdmin(filters);
  }
}

export const orderService = new OrderService();
