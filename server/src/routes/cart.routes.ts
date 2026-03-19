import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";
import { 
  getCart, 
  addItem, 
  updateQuantity, 
  removeItem, 
  clearCart, 
  syncCart, 
  bulkSync, 
  getAbandonedCarts 
} from "../controllers/cart.controller";
import { validate } from "../middleware/validate.middleware";
import { 
  addToCartSchema, 
  updateCartItemSchema, 
  removeCartItemSchema 
} from "../validations/cart.validation";

const router = Router();

router.use(authenticate);

router.get("/", getCart);
router.post("/add", validate(addToCartSchema), addItem);
router.patch("/update", validate(updateCartItemSchema), updateQuantity);
router.delete("/remove/:productId", validate(removeCartItemSchema), removeItem);
router.delete("/clear", clearCart);
router.get("/sync", syncCart);
router.post("/bulk-sync", bulkSync);


export default router;
