import { Router } from "express";
import { getDashboardStats, getLowStockItemsDetailed } from "../controllers/dashboard.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/stats", authenticate, isAdmin, getDashboardStats);
router.get("/low-stock", authenticate, isAdmin, getLowStockItemsDetailed);

export default router;
