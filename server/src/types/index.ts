import { UserRole, AccountStatus, OrderStatus, PaymentStatus } from '@prisma/client';

// ─── User Types ───────────────────────────────────────────────────────────────

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Express.Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
    status: AccountStatus;
    name: string;
  };
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// ─── Product Types ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  featured?: string;
  trending?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: string;
  limit?: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  basePrice: string | number;
  discountedPrice?: string | number | null;
  categoryId: string;
  subCategoryId?: string;
  brandId?: string;
  stock: string | number;
  sku?: string;
  featured?: boolean | string;
  trending?: boolean | string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface ProductImageData {
  cloudinaryPublicId: string;
  imageUrl: string;
  width?: number;
  height?: number;
  format?: string;
  isPrimary?: boolean;
}

// ─── Order Types ───────────────────────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface PlaceOrderInput {
  addressId: string;
  paymentMethod: string;
  items?: Array<{ id?: string; productId?: string; quantity: number }>;
}

// ─── Pagination ────────────────────────────────────────────────────────────────

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── API ───────────────────────────────────────────────────────────────────────

export type SortOrder = 'asc' | 'desc';
