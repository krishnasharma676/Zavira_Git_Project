import { Router } from "express";
import { 
  getCategories, 
  createCategory, 
  updateCategory,
  deleteCategory
} from "../controllers/category.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";
import { validate } from "../middleware/validate.middleware";
import { categorySchema, updateCategorySchema } from "../validations/category.validation";

const router = Router();

router.get("/", getCategories);
router.post("/", authenticate, isAdmin, upload.single("image"), validate(categorySchema), createCategory);
router.patch("/:id", authenticate, isAdmin, upload.single("image"), validate(updateCategorySchema), updateCategory);
router.delete("/:id", authenticate, isAdmin, deleteCategory);

export default router;

