import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { firebaseAuthService } from '../services/firebase.auth.service';

// ─── POST /api/v1/auth/firebase/sync ─────────────────────────────────────────

/**
 * firebaseSync
 *
 * Entry point for Firebase-authenticated users.
 * The `verifyFirebaseToken` middleware must run before this.
 *
 * Flow:
 *  1. Read decoded Firebase user from req.firebaseUser (set by middleware)
 *  2. Upsert in PostgreSQL
 *  3. Return OUR OWN JWT pair (accessToken + refreshToken)
 *  4. Frontend stores these and uses them for all other API calls
 *     via the existing `authenticate` middleware — Firebase is never
 *     touched again after this point.
 */
export const firebaseSync = asyncHandler(async (req: Request, res: Response) => {
  const firebaseUser = (req as any).firebaseUser;

  if (!firebaseUser?.uid) {
    throw new ApiError(401, 'Firebase user context missing. Ensure verifyFirebaseToken runs first.');
  }

  const result = await firebaseAuthService.syncUser(firebaseUser);

  // Set refresh token as httpOnly cookie (same pattern as existing auth)
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(result.isNewUser ? 201 : 200).json(
    new ApiResponse(
      result.isNewUser ? 201 : 200,
      {
        user:         result.user,
        accessToken:  result.accessToken,
        isNewUser:    result.isNewUser,
      },
      result.isNewUser
        ? 'Account created successfully via Firebase.'
        : 'Signed in successfully via Firebase.'
    )
  );
});

// ─── GET /api/v1/auth/firebase/me ─────────────────────────────────────────────

/**
 * firebaseMe
 *
 * Returns the DB profile for the currently authenticated Firebase user.
 * Protected by `verifyFirebaseToken` middleware.
 */
export const firebaseMe = asyncHandler(async (req: Request, res: Response) => {
  const firebaseUser = (req as any).firebaseUser;

  if (!firebaseUser?.uid) {
    throw new ApiError(401, 'Firebase user context missing.');
  }

  const user = await firebaseAuthService.getFirebaseProfile(firebaseUser.uid);

  return res.status(200).json(
    new ApiResponse(200, { user }, 'Profile fetched successfully.')
  );
});

// ─── GET /api/v1/auth/firebase/protected-demo ────────────────────────────────

/**
 * firebaseProtectedDemo
 *
 * Example of a route that accepts EITHER:
 *  A) Firebase ID Token  → via verifyFirebaseToken middleware
 *  B) Our own JWT        → via authenticate middleware
 * This shows how both auth flows can coexist on the same route.
 */
export const firebaseProtectedDemo = asyncHandler(async (req: Request, res: Response) => {
  // req.user is set by `authenticate` (our JWT middleware)
  // req.firebaseUser is set by `verifyFirebaseToken`
  const user = (req as any).user || (req as any).firebaseUser;

  return res.status(200).json(
    new ApiResponse(200, { user }, 'Access granted to protected resource.')
  );
});
