import {
  firebaseUserRepository,
  FirebaseUserPayload,
} from '../repositories/firebase.user.internal';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { userRepository } from '../repositories/user.internal';
import { ApiError } from '../utils/ApiError';

// ─── Response shape ───────────────────────────────────────────────────────────

export interface FirebaseSyncResult {
  user: {
    id:              string;
    publicId:        string;
    firebaseUid:     string | null;
    name:            string | null;
    email:           string | null;
    phoneNumber:     string;
    avatar:          string | null;
    role:            string;
    status:          string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    createdAt:       Date;
  };
  accessToken:  string;
  refreshToken: string;
  isNewUser:    boolean;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class FirebaseAuthService {

  /**
   * syncUser
   *
   * Called after the Firebase ID token has been verified by middleware.
   * Upserts the user in PostgreSQL and returns our own JWT pair so the
   * frontend can use the existing `authenticate` middleware on all other routes.
   */
  async syncUser(firebasePayload: FirebaseUserPayload): Promise<FirebaseSyncResult> {
    // Upsert in Postgres
    const { user, isNewUser } = await firebaseUserRepository.upsertByFirebaseUid(firebasePayload);

    // Guard: blocked / deleted accounts still get rejected
    if ((user as any).status === 'BLOCKED') {
      throw new ApiError(403, 'Your account has been suspended. Please contact support.');
    }
    if ((user as any).isDeleted) {
      throw new ApiError(403, 'Account not found.');
    }

    // Issue our own JWT pair — frontend uses these for all subsequent requests
    const tokenPayload = {
      id:    user.id,
      email: user.email,
      role:  user.role,
    };

    const accessToken  = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Persist refresh token as a session (reuse existing session infrastructure)
    await userRepository.createSession({
      userId:       user.id,
      refreshToken,
      expiresAt:    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      user: user as any,
      accessToken,
      refreshToken,
      isNewUser,
    };
  }

  /**
   * getFirebaseProfile
   *
   * Lightweight helper: returns the DB user for a given firebase UID.
   * Used by the /me endpoint on firebase-protected routes.
   */
  async getFirebaseProfile(uid: string) {
    const user = await firebaseUserRepository.findByFirebaseUid(uid);
    if (!user) {
      throw new ApiError(404, 'User not found. Please sync first.');
    }
    return user;
  }
}

export const firebaseAuthService = new FirebaseAuthService();
