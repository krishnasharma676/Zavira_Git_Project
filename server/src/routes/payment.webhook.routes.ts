import { Router } from "express";
import { handleRazorpayWebhook } from "../controllers/payment.webhook.controller";

const router = Router();

// Public webhook endpoint (Razorpay sends requests here)
router.post("/razorpay", handleRazorpayWebhook);

export default router;
