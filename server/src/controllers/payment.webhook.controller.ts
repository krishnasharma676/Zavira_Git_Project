import { Request, Response } from "express";
import crypto from "crypto";
import { orderRepository } from "../repositories/order.internal";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";

import { settingService } from "../services/setting.service";

export const handleRazorpayWebhook = asyncHandler(async (req: Request, res: Response) => {
  const secret = await settingService.getSetting('razorpay_webhook_secret') || process.env.RAZORPAY_WEBHOOK_SECRET || "razorpay_secret";
  const signature = req.headers["x-razorpay-signature"] as string;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (expectedSignature !== signature) {
    return res.status(400).json({ status: "invalid_signature" });
  }

  const { event, payload } = req.body;

  if (event === "payment.captured") {
    const payment = payload.payment.entity;
    const razorpay_order_id = payment.order_id;
    const razorpay_payment_id = payment.id;

    const order = await orderRepository.findByRazorpayOrderId(razorpay_order_id);
    
    if (order && order.status === OrderStatus.PENDING) {
      await orderRepository.updateStatus(order.id, OrderStatus.CONFIRMED);
      await orderRepository.updatePaymentStatus(order.id, PaymentStatus.COMPLETED, razorpay_payment_id, {
        razorpay_payment_id,
        razorpay_order_id,
        method: payment.method,
        amount: payment.amount / 100
      });
      console.log(`✔ [RAZORPAY WEBHOOK] Order ${order.orderNumber} confirmed via webhook.`);
    }
  }

  return res.status(200).json({ status: "ok" });
});
