import { Router } from "express";
import { 
  getBanners, 
  getAllBanners, 
  createBanner, 
  updateBanner, 
  deleteBanner,
  incrementBannerClick
} from "../controllers/banner.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";
import { validate } from "../middleware/validate.middleware";
import { bannerSchema, updateBannerSchema } from "../validations/banner.validation";

const router = Router();

// Public routes
router.get("/", getBanners);
router.patch("/:id/click", incrementBannerClick);

// Admin routes
router.get("/all", authenticate, isAdmin, getAllBanners);
router.post("/", authenticate, isAdmin, upload.single("image"), validate(bannerSchema), createBanner);
router.patch("/:id", authenticate, isAdmin, upload.single("image"), validate(updateBannerSchema), updateBanner);
router.delete("/:id", authenticate, isAdmin, deleteBanner);

export default router;

