import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";
import { userRepository } from "../repositories/user.internal";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken: any = verifyToken(token, process.env.ACCESS_TOKEN_SECRET!);

    if (!decodedToken) {
      throw new ApiError(401, "Invalid Access Token");
    }

    const user = await userRepository.findById(decodedToken.id);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    if (user.status === "BLOCKED") {
      throw new ApiError(403, "Your account has been blocked.");
    }

    (req as any).user = user;
    next();
  }
);

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;
    if (!roles.includes(userRole)) {
      throw new ApiError(403, "You do not have permission to perform this action");
    }
    next();
  };
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const role = (req as any).user?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    throw new ApiError(403, "Admin access required");
  }
  next();
};
