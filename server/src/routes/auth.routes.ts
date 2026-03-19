import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = Router();

// ── Public Routes ──────────────────────────────────────────────────────────
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtpAndLogin);
router.post('/login', authController.login);
router.post('/verify-email-otp', authController.verifyEmailOtpAndLogin);
router.post('/register', authController.register);
router.post('/complete-registration', authController.completeRegistration);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// ── Admin Routes (Note: Path relative to /api/v1/auth) ──────────────────────
router.get('/admin/users', authenticate, isAdmin, authController.getUsers);
router.patch('/admin/users/:id/block', authenticate, isAdmin, authController.blockUser);
router.patch('/admin/users/:id/unblock', authenticate, isAdmin, authController.unblockUser);
router.delete('/admin/users/:id', authenticate, isAdmin, authController.deleteUser);

// ── Profile Route ────────────────────────────────────────────────────────────
router.get('/profile', authenticate, authController.getProfile);

export default router;
