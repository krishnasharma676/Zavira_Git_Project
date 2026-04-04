import { Router } from "express";
import { 
  placeOrder, 
  getMyOrders, 
  getOrderDetails, 
  verifyPayment,
  getAllOrders, 
  updateOrderStatus,
  triggerShipment,
  generateLabel,
  updateOrderNotes,
  refundOrder,
  requestReturn,
  approveReturn,
  uploadReturnImages,
  resetForReshipment,
  getPublicTrackingDetails,
  syncShiprocketStatuses,
  generateAWB,
  cancelShipment
} from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";
import { validate } from "../middleware/validate.middleware";
import { checkoutSchema, orderIdSchema, updateOrderStatusSchema } from "../validations/order.validation";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.get("/public/track/:id", getPublicTrackingDetails);

router.use(authenticate);

// User routes
router.post("/checkout", validate(checkoutSchema), placeOrder);
router.post("/verify-payment/:orderId", verifyPayment);
router.get("/my-orders", getMyOrders);
router.get("/:id", validate(orderIdSchema), getOrderDetails);
router.post("/:id/return", upload.array("images", 4), requestReturn);
router.post("/upload-return-images", upload.array("images", 4), uploadReturnImages);


// Admin routes
router.get("/admin/all", isAdmin, getAllOrders);
router.patch("/admin/:id/status", isAdmin, validate(updateOrderStatusSchema), updateOrderStatus);
router.patch("/admin/:id/notes", isAdmin, updateOrderNotes);
router.post("/admin/:id/trigger-shipment", isAdmin, triggerShipment);
router.post("/admin/:id/generate-label", isAdmin, generateLabel);
router.post("/admin/:id/refund", isAdmin, refundOrder);
router.post("/admin/:id/approve-return", isAdmin, approveReturn);
router.post("/admin/:id/reset-reship", isAdmin, resetForReshipment);
router.post("/admin/sync-shiprocket", isAdmin, syncShiprocketStatuses);
router.post("/admin/:id/generate-awb", isAdmin, generateAWB);
router.post("/admin/:id/cancel-shipment", isAdmin, cancelShipment);

export default router;
