import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/stats", authenticate, isAdmin, getDashboardStats);

export default router;
