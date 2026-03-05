import { Router } from "express";
import { 
  createTestimonial, 
  getPublicTestimonials, 
  getAllTestimonialsAdmin, 
  updateTestimonial, 
  deleteTestimonial 
} from "../controllers/testimonial.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

const router = Router();

// Public routes
router.get("/", getPublicTestimonials);

// Admin routes
router.post("/", authenticate, isAdmin, upload.single("image"), createTestimonial);
router.get("/admin/all", authenticate, isAdmin, getAllTestimonialsAdmin);
router.patch("/:id", authenticate, isAdmin, upload.single("image"), updateTestimonial);
router.delete("/:id", authenticate, isAdmin, deleteTestimonial);

export default router;
