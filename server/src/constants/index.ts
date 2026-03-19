// ─── Application Constants ─────────────────────────────────────────────────────

export const APP_NAME = 'KrishJwels';
export const APP_VERSION = '1.0.0';

// ─── Token Expiry ──────────────────────────────────────────────────────────────

export const TOKEN_EXPIRY = {
  ACCESS_TOKEN_MS: 15 * 60 * 1000,         // 15 minutes
  REFRESH_TOKEN_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

// ─── Pagination Defaults ───────────────────────────────────────────────────────

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// ─── Upload Limits ─────────────────────────────────────────────────────────────

export const UPLOAD = {
  MAX_FILE_SIZE_MB: 5,
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  MAX_IMAGES_PER_PRODUCT: 5,
} as const;

// ─── Cloudinary Folders ────────────────────────────────────────────────────────

export const CLOUDINARY_FOLDERS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BANNERS: 'banners',
  AVATARS: 'avatars',
} as const;

// ─── Order / Payment ───────────────────────────────────────────────────────────

export const PAYMENT_METHODS = {
  COD: 'COD',
  ONLINE: 'ONLINE',
  RAZORPAY: 'RAZORPAY',
} as const;

export const FREE_SHIPPING_THRESHOLD = 1000;
export const SHIPPING_FEE = 49;
export const TAX_RATE = 0.03; // 3% luxury surcharge

// ─── HTTP Status Codes ─────────────────────────────────────────────────────────

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ─── Cookie Options ────────────────────────────────────────────────────────────

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

export const ACCESS_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: TOKEN_EXPIRY.ACCESS_TOKEN_MS,
};

export const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: TOKEN_EXPIRY.REFRESH_TOKEN_MS,
};

// ─── Admin Roles ────────────────────────────────────────────────────────────────

export const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'] as const;
export type AdminRole = typeof ADMIN_ROLES[number];
