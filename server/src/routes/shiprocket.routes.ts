
import { Router } from "express";
import { handleShiprocketWebhook } from "../controllers/shiprocket.controller";

const router = Router();

// Public webhook endpoint (Shiprocket sends requests here)
router.post("/webhook", handleShiprocketWebhook);

export default router;
