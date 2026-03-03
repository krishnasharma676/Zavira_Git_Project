import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authService } from "../services/auth.service";
import { ApiResponse } from "../utils/ApiResponse";

const cookieOptions: any = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone } = req.body;
  const result = await authService.sendOtp(phone);
  return res.status(200).json(new ApiResponse(200, result, "OTP sent successfully"));
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone, code } = req.body;
  const { user, accessToken, refreshToken } = await authService.verifyOtpAndLogin(
    phone,
    code,
    req.headers["user-agent"],
    req.ip
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(200, { user, accessToken, refreshToken }, "Login successful"));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(
    email,
    password,
    req.headers["user-agent"],
    req.ip
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(200, { user, accessToken, refreshToken }, "Login successful"));
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.register(
    req.body,
    req.headers["user-agent"],
    req.ip
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(201, { user, accessToken, refreshToken }, "Registration successful"));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  const { accessToken, refreshToken } = await authService.refreshAccessToken(oldRefreshToken);

  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed"));
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await authService.getUsers();
  return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const user = await authService.getProfile(userId);
  return res.status(200).json(new ApiResponse(200, user, "Profile fetched successfully"));
});
