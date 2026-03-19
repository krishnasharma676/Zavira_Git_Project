import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { getAnalytics } from "../controllers/report.controller";

const router = Router();

router.use(authenticate, isAdmin);

router.get("/analytics", getAnalytics);

export default router;
