import { Router } from "express";
import { getCart, addItem, updateQuantity, removeItem, clearCart } from "../controllers/cart.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { addToCartSchema, updateCartItemSchema, removeCartItemSchema } from "../validations/cart.validation";

const router = Router();

router.use(authenticate);

router.get("/", getCart);
router.post("/add", validate(addToCartSchema), addItem);
router.patch("/update", validate(updateCartItemSchema), updateQuantity);
router.delete("/remove/:productId", validate(removeCartItemSchema), removeItem);
router.delete("/clear", clearCart);

export default router;
