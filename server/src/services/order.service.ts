import { orderRepository } from "../repositories/order.internal";
import { cartRepository } from "../repositories/cart.internal";
import { productRepository } from "../repositories/product.internal";
import { ApiError } from "../utils/ApiError";
import { razorpay } from "../config/razorpay";
import { shiprocketService } from "./shiprocket.service";
import crypto from "crypto";
import { settingService } from "./setting.service";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export class OrderService {
  async placeOrder(userId: string, data: any) {
    const { addressId, paymentMethod, items } = data;
    
    // ... (rest of the logic remains same until order creation)
    let baseItems: any[] = [];
    if (items && Array.isArray(items) && items.length > 0) {
      baseItems = items.map(i => ({ 
        productId: i.id || i.productId, 
        quantity: i.quantity,
        selectedSize: i.selectedSize,
        variantId: i.variantId
      }));
    } else {
      const cart = await cartRepository.getCart(userId);
      if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty");
      }
      baseItems = cart.items.map((i: any) => ({
         productId: i.productId,
         quantity: i.quantity,
         selectedSize: i.selectedSize,
         variantId: i.variantId
      }));
    }

    let totalAmount = 0;
    let taxAmount = 0;
    const itemsToOrder = [];
    
    console.log("📦 NEW ORDER REQUEST - USER:", userId);
    console.log("🛒 BASE ITEMS RECEIVED:", JSON.stringify(baseItems, null, 2));
    
    console.log('[ORDER_DEBUG] Items to Order Array Building:');
    for (const item of baseItems) {
      console.log(` - Product: ${item.productId}, Qty: ${item.quantity}, VariantId: ${item.variantId}, Size: ${item.selectedSize}`);
      const product = await productRepository.findById(item.productId);
      if (!product || !product.inventory || product.inventory.stock < item.quantity) {
        throw new ApiError(400, `Product ${product?.name || "ID: " + item.productId} is out of stock`);
      }
      const price = product.discountedPrice || product.basePrice;
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;
      
      // Calculate tax component assuming price is inclusive of GST
      // Formula: (Price * TaxRate) / (100 + TaxRate)
      const taxRate = product.taxRate || 0;
      const itemTax = (itemTotal * taxRate) / (100 + taxRate);
      taxAmount += itemTax;

      itemsToOrder.push({ 
         productId: item.productId, 
         quantity: item.quantity, 
         price: price,
         selectedSize: item.selectedSize,
         variantId: item.variantId
      });
    }

    console.log("🚚 ITEMS PREPARED FOR DATABASE:", JSON.stringify(itemsToOrder, null, 2));

    // Get shipping and COD settings
    const settings = await settingService.getAllSettings();
    const flatRate = Number(settings.shipping_flat_rate) || 50;
    const codCharge = Number(settings.cod_charge) || 39;

    let shippingCharges = flatRate;
    let codAmount = paymentMethod === 'COD' ? codCharge : 0;
    
    const payableAmount = totalAmount + shippingCharges + codAmount;
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let razorpayOrder = null;
    if (paymentMethod === "ONLINE") {
      const options = {
        amount: Math.round(payableAmount * 100),
        currency: "INR",
        receipt: orderNumber,
      };
      razorpayOrder = await razorpay.orders.create(options);
    }

    const order = await orderRepository.createOrder({
      orderNumber,
      userId,
      addressId,
      totalAmount,
      taxAmount,
      shippingCharges,
      discountAmount: 0,
      payableAmount,
      paymentMethod,
      status: paymentMethod === "ONLINE" ? OrderStatus.PENDING : OrderStatus.CONFIRMED,
    }, itemsToOrder);

    if (paymentMethod === "ONLINE" && razorpayOrder) {
      await orderRepository.updatePaymentStatus(order.id, PaymentStatus.PENDING, undefined, { 
        razorpay_order_id: razorpayOrder.id 
      });
      return { ...order, razorpay_order_id: razorpayOrder.id };
    }

    // For COD, do NOT trigger shipment immediately; let admin do it manually
    // if (paymentMethod === "COD") {
    //   this.triggerShipment(order.id);
    // }

    await cartRepository.clearCart(userId);
    return order;
  }

  async verifyPayment(orderId: string, paymentData: any) {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentData;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await orderRepository.updateStatus(orderId, OrderStatus.PENDING);
      await orderRepository.updatePaymentStatus(orderId, PaymentStatus.FAILED, razorpay_payment_id);
      throw new ApiError(400, "Invalid payment signature");
    }

    const order = await orderRepository.updateStatus(orderId, OrderStatus.CONFIRMED);
    await orderRepository.updatePaymentStatus(orderId, PaymentStatus.COMPLETED, razorpay_payment_id, {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    });

    // Do NOT trigger shipment after successful payment automatically; let admin pack it first
    // this.triggerShipment(order.id);

    return order;
  }

  async manualTriggerShipment(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    
    const shipment = await shiprocketService.createShipment(order);
    if (!shipment) throw new ApiError(500, "Shiprocket creation failed");

    let awbDetails = null;
    try {
      awbDetails = await shiprocketService.generateAWB(shipment.shipment_id);
    } catch (e) {}

    return await orderRepository.updateShipmentDetails(orderId, {
      shipmentId: String(shipment.shipment_id),
      awbNumber: awbDetails?.response?.data?.awb_code || null,
      courierName: awbDetails?.response?.data?.courier_name || null,
      shippingStatus: "AWB Generated",
      trackingUrl: awbDetails?.response?.data?.tracking_url || null
    });
  }

  private async triggerShipment(orderId: string) {
    try {
      const order = await orderRepository.findById(orderId);
      if (!order) return;

      const shipment = await shiprocketService.createShipment(order);
      if (shipment) {
        let awbDetails = null;
        try {
          awbDetails = await shiprocketService.generateAWB(shipment.shipment_id);
        } catch (e) {}

        await orderRepository.updateShipmentDetails(orderId, {
          shipmentId: String(shipment.shipment_id),
          awbNumber: awbDetails?.response?.data?.awb_code || null,
          courierName: awbDetails?.response?.data?.courier_name || null,
          shippingStatus: "AWB Generated",
          trackingUrl: awbDetails?.response?.data?.tracking_url || null
        });
      }
    } catch (error) {
      console.error("Async Shipment Trigger Failed:", error);
    }
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

  async updateAdminNotes(id: string, notes: string) {
    return await orderRepository.updateAdminNotes(id, notes);
  }

  async getAllOrders(filters: any) {
    return await orderRepository.findAllAdmin(filters);
  }

  async initiateRefund(orderId: string, notes: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.status === OrderStatus.REFUNDED) throw new ApiError(400, "Order already refunded");

    const payment = order.payment;
    if (!payment || payment.status !== PaymentStatus.COMPLETED) {
      // If it was COD or failed online, we just mark as Refunded manually in DB
      await orderRepository.updateStatus(orderId, OrderStatus.REFUNDED);
      await orderRepository.updateAdminNotes(orderId, `[REFUND LOG]: ${notes}`);
      return { success: true, message: "Order marked as refunded manually" };
    }

    // ONLINE payment - try Razorpay refund if transaction ID exists
    if (payment.paymentMethod === "ONLINE" && payment.transactionId) {
      try {
        const refund = await razorpay.payments.refund(payment.transactionId, {
          amount: Math.round(payment.amount * 100),
          notes: { admin_reason: notes }
        });
        
        await orderRepository.updateStatus(orderId, OrderStatus.REFUNDED);
        await orderRepository.updatePaymentStatus(orderId, PaymentStatus.REFUNDED, undefined, refund);
        await orderRepository.updateAdminNotes(orderId, `[RAZORPAY REFUND]: ${refund.id} | ${notes}`);
        
        return { success: true, refundId: refund.id };
      } catch (err: any) {
        throw new ApiError(500, `Razorpay Refund Failed: ${err.message}`);
      }
    }

    // Default fallback
    await orderRepository.updateStatus(orderId, OrderStatus.REFUNDED);
    await orderRepository.updatePaymentStatus(orderId, PaymentStatus.REFUNDED);
    return { success: true };
  }

  async requestReturn(orderId: string, userId: string, returnReason: string, returnImages: string[] = []) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.userId !== userId) throw new ApiError(403, "Access denied");
    
    // Can only return if DELIVERED
    if (order.status !== OrderStatus.DELIVERED) {
      throw new ApiError(400, "Only delivered orders can be returned");
    }

    return await orderRepository.updateReturnInfo(orderId, returnReason, returnImages, OrderStatus.RETURN_REQUESTED);
  }

  async approveReturn(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    
    // Must be in RETURN_REQUESTED originally
    if (order.status !== OrderStatus.RETURN_REQUESTED) {
      throw new ApiError(400, "No return request active for this order");
    }

    return await orderRepository.updateStatus(orderId, OrderStatus.RETURNED);
  }

  async syncShiprocketStatuses() {
    const activeOrders = await orderRepository.findAllAdmin({ limit: 100 });
    const ordersToSync = activeOrders.orders.filter((o: any) => 
      o.shipmentId && !['DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'].includes(o.status)
    );

    for (const order of ordersToSync) {
      if (!order.shipmentId) continue;
      try {
        const tracking = await shiprocketService.getTrackingDetails(order.shipmentId!);
        if (tracking && tracking.status) {
          const srStatus = tracking.status.toLowerCase();
          let newStatus: OrderStatus | null = null;
          let newShippingStatus = tracking.current_status || tracking.status;

          if (srStatus.includes('delivered')) newStatus = OrderStatus.DELIVERED;
          else if (srStatus.includes('shipped') || srStatus.includes('transit') || srStatus.includes('out for delivery')) newStatus = OrderStatus.SHIPPED;
          else if (srStatus.includes('canceled')) newStatus = OrderStatus.CANCELLED;

          if (newStatus || newShippingStatus !== order.shippingStatus) {
            await orderRepository.updateShipmentDetails(order.id, {
               ...(newStatus && { status: newStatus }),
               shippingStatus: newShippingStatus
            });
          }
        }
      } catch (err) {
        console.error(`Status sync failed for order ${order.id}:`, err);
      }
    }
    return { success: true };
  }
}

export const orderService = new OrderService();
