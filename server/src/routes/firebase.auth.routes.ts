import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  firebaseSync,
  firebaseMe,
  firebaseProtectedDemo,
} from '../controllers/firebase.auth.controller';

const router = Router();

// ── Public (requires only a valid Firebase ID token) ──────────────────────────

/**
 * POST /api/v1/auth/firebase/sync
 *
 * The ONLY endpoint that accepts a Firebase ID token.
 * Returns our own JWT pair for all subsequent requests.
 *
 * Body: none
 * Headers: Authorization: Bearer <firebase_id_token>
 */
router.post('/sync', verifyFirebaseToken, firebaseSync);

/**
 * GET /api/v1/auth/firebase/me
 *
 * Returns the DB profile for the Firebase-authenticated user.
 * Headers: Authorization: Bearer <firebase_id_token>
 */
router.get('/me', verifyFirebaseToken, firebaseMe);

// ── Protected (uses OUR JWT issued after /sync) ───────────────────────────────

/**
 * GET /api/v1/auth/firebase/protected
 *
 * Example protected route — uses our JWT (issued post-sync), not Firebase token.
 * Once synced, ALL other routes use `authenticate` (our JWT), never Firebase directly.
 *
 * Headers: Authorization: Bearer <our_access_token>
 */
router.get('/protected', authenticate, firebaseProtectedDemo);

/**
 * GET /api/v1/auth/firebase/admin-only
 *
 * Example role-gated route.
 * Headers: Authorization: Bearer <our_access_token>  (must be ADMIN or SUPER_ADMIN)
 */
router.get('/admin-only', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), firebaseProtectedDemo);

export default router;
