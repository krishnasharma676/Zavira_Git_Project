
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { orderRepository } from "../repositories/order.internal";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { ApiResponse } from "../utils/ApiResponse";

export const handleShiprocketWebhook = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  const { shipment_id, current_status, awb } = payload;

  if (!shipment_id) {
    return res.status(200).json({ status: "ignored", message: "No shipment ID" });
  }

  const order = await orderRepository.findByShipmentId(String(shipment_id));
  if (!order) {
    return res.status(200).json({ status: "not_found", shipment_id });
  }

  let newStatus: OrderStatus | null = null;
  const statusLower = current_status?.toLowerCase();

  // Map Shiprocket statuses to internal statuses
  if (statusLower.includes('delivered')) {
    newStatus = OrderStatus.DELIVERED;
  } else if (statusLower.includes('shipped') || statusLower.includes('in transit') || statusLower.includes('out for delivery')) {
    newStatus = OrderStatus.SHIPPED;
  } else if (statusLower.includes('canceled')) {
    newStatus = OrderStatus.CANCELLED;
  } else if (statusLower.includes('return') || statusLower.includes('rto')) {
    // Potentially a RETURNED status if we had one, for now maybe keep as SHIPPED or a custom one
    // For now skip or handle as needed
  }

  if (newStatus && newStatus !== order.status) {
    await orderRepository.updateStatus(order.id, newStatus);
    
    // If delivered, update payment for COD orders
    if (newStatus === OrderStatus.DELIVERED && order.payment?.paymentMethod === 'COD') {
      await orderRepository.updatePaymentStatus(order.id, PaymentStatus.COMPLETED);
    }

    await orderRepository.updateShipmentDetails(order.id, {
      shippingStatus: current_status,
      ...(awb && { awbNumber: awb })
    });
  }

  return res.status(200).json({ status: "success" });
});
