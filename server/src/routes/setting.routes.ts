import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/setting.controller";
import { authenticate, isAdmin, optionalAuthenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", optionalAuthenticate, getSettings);
router.patch("/", authenticate, isAdmin, updateSettings);

export default router;
