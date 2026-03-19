import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/setting.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getSettings);
router.patch("/", authenticate, isAdmin, updateSettings);

export default router;
