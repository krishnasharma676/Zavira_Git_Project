
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

/**
 * Shorthand for standard Admin access.
 * Matches both ADMIN and SUPER_ADMIN roles.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const role = (req as any).user?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    throw new ApiError(403, "Access denied: Administrative privileges required.");
  }
  next();
};
