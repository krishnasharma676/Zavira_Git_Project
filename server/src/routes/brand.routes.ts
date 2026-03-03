import { Router } from "express";
import { 
  getBrands, 
  createBrand, 
  updateBrand, 
  deleteBrand 
} from "../controllers/brand.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";
import { validate } from "../middleware/validate.middleware";
import { brandSchema, updateBrandSchema } from "../validations/brand.validation";

const router = Router();

// Public routes
router.get("/", getBrands);

// Admin routes
router.post("/", authenticate, isAdmin, upload.single("image"), validate(brandSchema), createBrand);
router.patch("/:id", authenticate, isAdmin, upload.single("image"), validate(updateBrandSchema), updateBrand);
router.delete("/:id", authenticate, isAdmin, deleteBrand);

export default router;

