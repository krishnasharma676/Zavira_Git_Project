import { Router } from "express";
import { 
  getCoupons, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon, 
  validateCoupon 
} from "../controllers/coupon.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { couponSchema, updateCouponSchema, validateCouponSchema } from "../validations/coupon.validation";

const router = Router();

// Public routes
router.post("/validate", authenticate, validate(validateCouponSchema), validateCoupon);

// Admin routes
router.get("/", authenticate, isAdmin, getCoupons);
router.post("/", authenticate, isAdmin, validate(couponSchema), createCoupon);
router.patch("/:id", authenticate, isAdmin, validate(updateCouponSchema), updateCoupon);
router.delete("/:id", authenticate, isAdmin, deleteCoupon);

export default router;

