import { Router } from "express";
import { 
  placeOrder, 
  getMyOrders, 
  getOrderDetails, 
  getAllOrders, 
  updateOrderStatus 
} from "../controllers/order.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { checkoutSchema, orderIdSchema, updateOrderStatusSchema } from "../validations/order.validation";

const router = Router();

router.use(authenticate);

// User routes
router.post("/checkout", validate(checkoutSchema), placeOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", validate(orderIdSchema), getOrderDetails);

// Admin routes
router.get("/admin/all", isAdmin, getAllOrders);
router.patch("/admin/:id/status", isAdmin, validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
