import { Router } from "express";
import { 
  getProducts, 
  getProductBySlug, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  uploadImages, 
  deleteImage,
  getHomeData
} from "../controllers/product.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";
import { validate } from "../middleware/validate.middleware";
import { productSchema, updateProductSchema, productSlugSchema } from "../validations/product.validation";

const router = Router();

// Public routes
router.get("/home-data", getHomeData);
router.get("/", getProducts);
router.get("/:slug", validate(productSlugSchema), getProductBySlug);

// Admin only routes
router.post("/", authenticate, isAdmin, upload.array("images", 5), validate(productSchema), createProduct);
router.patch("/:id", authenticate, isAdmin, upload.array("images", 5), validate(updateProductSchema), updateProduct);
router.delete("/:id", authenticate, isAdmin, deleteProduct);

router.post("/:id/images", authenticate, isAdmin, upload.array("images", 5), uploadImages);
router.delete("/:productId/images/:imageId", authenticate, isAdmin, deleteImage);

export default router;

