import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { 
  getInventoryList, 
  updateStock, 
  updateSKU, 
  bulkUpdateInventory 
} from "../controllers/inventory.controller";

const router = Router();

router.use(authenticate, isAdmin);

router.get("/", getInventoryList);
router.patch("/:productId/stock", updateStock);
router.patch("/:productId/sku", updateSKU);
router.post("/bulk", bulkUpdateInventory);

export default router;
