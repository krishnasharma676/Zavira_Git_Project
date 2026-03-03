import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '../config/firebase';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * verifyFirebaseToken
 * 
 * Middleware that reads the Firebase ID Token from the Authorization header,
 * verifies it with Firebase Admin SDK, and attaches the decoded token to req.
 * 
 * Usage:
 *   router.post('/firebase/sync', verifyFirebaseToken, firebaseSyncController);
 */
export const verifyFirebaseToken = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Missing or malformed Authorization header. Expected: Bearer <firebase_id_token>');
    }

    const idToken = authHeader.replace('Bearer ', '').trim();

    if (!idToken) {
      throw new ApiError(401, 'Firebase ID token is empty');
    }

    let decodedToken;
    try {
      // checkRevoked: true ensures logged-out / revoked tokens are rejected
      decodedToken = await firebaseAuth.verifyIdToken(idToken, true);
    } catch (err: any) {
      const code: string = err?.code || '';

      if (code === 'auth/id-token-expired') {
        throw new ApiError(401, 'Firebase token has expired. Please re-authenticate.');
      }
      if (code === 'auth/id-token-revoked') {
        throw new ApiError(401, 'Firebase token has been revoked. Please re-authenticate.');
      }
      if (code === 'auth/argument-error') {
        throw new ApiError(401, 'Invalid Firebase token format.');
      }

      throw new ApiError(401, `Firebase token verification failed: ${err.message}`);
    }

    // Attach decoded Firebase token to request for downstream use
    (req as any).firebaseUser = {
      uid:          decodedToken.uid,
      email:        decodedToken.email        ?? null,
      phone:        decodedToken.phone_number  ?? null,
      name:         decodedToken.name          ?? null,
      picture:      decodedToken.picture       ?? null,
      emailVerified: decodedToken.email_verified ?? false,
      provider:     decodedToken.firebase?.sign_in_provider ?? 'unknown',
    };

    next();
  }
);
