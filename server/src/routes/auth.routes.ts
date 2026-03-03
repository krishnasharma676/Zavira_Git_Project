import { Router } from "express";
import { 
  sendOtp, 
  verifyOtp, 
  login,
  register,
  logout, 
  refreshAccessToken, 
  getAllUsers, 
  getMe 
} from "../controllers/auth.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { sendOtpSchema, verifyOtpSchema, loginSchema, registerSchema, refreshAccessTokenSchema } from "../validations/auth.validation";

const router = Router();

router.post("/send-otp", validate(sendOtpSchema), sendOtp);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.get("/me", authenticate, getMe);
router.post("/refresh-token", validate(refreshAccessTokenSchema), refreshAccessToken);

// Protected routes
router.post("/logout", authenticate, logout);

// Admin routes
router.get("/admin/users", authenticate, isAdmin, getAllUsers);

export default router;
