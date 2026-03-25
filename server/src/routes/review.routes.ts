import { Router } from "express";
import { 
  addReview, 
  getProductReviews, 
  getAllReviews, 
  approveReview, 
  deleteReview 
} from "../controllers/review.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { addReviewSchema, getProductReviewsSchema, reviewIdSchema } from "../validations/review.validation";

import { upload } from "../middleware/multer.middleware";

const router = Router();

// Public routes
router.get("/product/:productId", validate(getProductReviewsSchema), getProductReviews);

// Protected routes
router.post("/product/:productId", authenticate, upload.array("images", 2), validate(addReviewSchema), addReview);


// Admin routes
router.get("/admin/all", authenticate, isAdmin, getAllReviews);
router.patch("/admin/:id/approve", authenticate, isAdmin, validate(reviewIdSchema), approveReview);
router.delete("/admin/:id", authenticate, isAdmin, validate(reviewIdSchema), deleteReview);

export default router;
