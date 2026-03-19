import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";
import { userRepository } from "../repositories/user.internal";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Extract token from multiple candidates (Cookies, Headers)
    let token = req.cookies?.accessToken;
    
    const authHeader = req.header("Authorization") || req.header("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized request: No access token provided.");
    }

    // 2. Verify token
    let decodedToken: any;
    try {
      decodedToken = verifyToken(token, process.env.ACCESS_TOKEN_SECRET!);
    } catch (err: any) {
      console.error(`[AUTH] Verification failed: ${err.message}`);
      throw new ApiError(401, "Expired or invalid Access Token.");
    }

    if (!decodedToken) {
      throw new ApiError(401, "Authentication failed.");
    }

    // 3. Find user in the database
    const user = await userRepository.findById(decodedToken.id);

    if (!user) {
      throw new ApiError(401, "User session no longer exists.");
    }

    if (user.status === "BLOCKED") {
      throw new ApiError(403, "Access denied: Your account is blocked.");
    }

    // 4. Attach to request object for downstream middlewares
    (req as any).user = user;
    next();
  }
);

/**
 * Validates if the user has at least one of the required roles.
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      throw new ApiError(403, "Access denied: Insufficient permissions.");
    }
    next();
  };
};

export { isAdmin } from "./admin.middleware";
