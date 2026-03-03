import { prisma } from '../config/prisma';
import { UserRole } from '@prisma/client';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FirebaseUserPayload {
  uid:           string;
  email:         string | null;
  phone:         string | null;
  name:          string | null;
  picture:       string | null;
  emailVerified: boolean;
  provider:      string;
}

export interface FirebaseUpsertResult {
  user:      ReturnType<typeof prisma.user.findFirst> extends Promise<infer U> ? NonNullable<U> : never;
  isNewUser: boolean;
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class FirebaseUserRepository {

  /**
   * upsertByFirebaseUid
   *
   * Core operation:
   *  - If firebaseUid exists → update `updatedAt` (last_login proxy) only.
   *  - If not → create new user with all Firebase-provided fields.
   *
   * The `phoneNumber` field in the schema is UNIQUE and required.
   * For email/Google-only users (no phone), we use `firebase:<uid>` as a
   * stable, unique placeholder. This keeps the schema constraint satisfied
   * without storing a fake phone that could confuse lookups.
   */
  async upsertByFirebaseUid(payload: FirebaseUserPayload) {
    const {
      uid,
      email,
      phone,
      name,
      picture,
      emailVerified,
    } = payload;

    // Stable phone placeholder for non-phone logins
    const phoneNumber = phone ?? `firebase:${uid}`;

    const existingUser = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    // ── EXISTS: touch updatedAt (last_login proxy) ──
    if (existingUser) {
      const updated = await prisma.user.update({
        where: { firebaseUid: uid },
        data:  { updatedAt: new Date() },
        select: this.#safeSelect(),
      });
      return { user: updated, isNewUser: false };
    }

    // ── NEW: insert with ON CONFLICT guard via Prisma's upsert ──
    // We use `upsert` so even under race conditions only one row is inserted.
    const created = await prisma.user.upsert({
      where:  { firebaseUid: uid },
      update: { updatedAt: new Date() },          // race-condition fallback
      create: {
        firebaseUid:     uid,
        email:           email,
        phoneNumber:     phoneNumber,
        name:            name,
        avatar:          picture,
        role:            UserRole.USER,
        isEmailVerified: emailVerified,
        isPhoneVerified: !!phone,
        isActive:        true,
        isDeleted:       false,
      },
      select: this.#safeSelect(),
    });

    return { user: created, isNewUser: !existingUser };
  }

  /**
   * findByFirebaseUid — lightweight lookup for protected routes.
   */
  async findByFirebaseUid(uid: string) {
    return prisma.user.findUnique({
      where:  { firebaseUid: uid },
      select: this.#safeSelect(),
    });
  }

  /**
   * #safeSelect — never return password hash or internal flags via firebase flow.
   */
  #safeSelect() {
    return {
      id:              true,
      publicId:        true,
      firebaseUid:     true,
      name:            true,
      email:           true,
      phoneNumber:     true,
      avatar:          true,
      role:            true,
      status:          true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt:       true,
      updatedAt:       true,
    } as const;
  }
}

export const firebaseUserRepository = new FirebaseUserRepository();
