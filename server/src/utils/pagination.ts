import { PAGINATION } from '../constants';

export interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Parses and clamps pagination query params into safe integers.
 */
export const parsePagination = (options: PaginationOptions): { page: number; limit: number; skip: number } => {
  const page = Math.max(1, parseInt(String(options.page ?? PAGINATION.DEFAULT_PAGE), 10) || 1);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(String(options.limit ?? PAGINATION.DEFAULT_LIMIT), 10) || PAGINATION.DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Builds a standard pagination meta object.
 */
export const buildPaginationMeta = (total: number, page: number, limit: number): PaginationMeta => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});
