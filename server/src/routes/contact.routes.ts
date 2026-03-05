import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { 
  submitMessage, 
  getMessages, 
  replyToMessage, 
  deleteMessage,
  markAsRead
} from "../controllers/contact.controller";

const router = Router();

// Public route
router.post("/submit", submitMessage);

// Admin routes
router.use(authenticate, isAdmin);
router.get("/all", getMessages);
router.post("/:id/reply", replyToMessage);
router.post("/:id/read", markAsRead);
router.delete("/:id", deleteMessage);

export default router;
