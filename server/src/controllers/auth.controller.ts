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
  const userAgent = req.headers["user-agent"];
  const deviceInfo = Array.isArray(userAgent) ? userAgent[0] : (userAgent || "Unknown");

  const { user, accessToken, refreshToken } = await authService.verifyOtpAndLogin(
    phone,
    code,
    deviceInfo,
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
  const userAgent = req.headers["user-agent"];
  const deviceInfo = Array.isArray(userAgent) ? userAgent[0] : (userAgent || "Unknown");

  const { user, accessToken, refreshToken } = await authService.login(
    email,
    password,
    deviceInfo,
    req.ip
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(200, { user, accessToken, refreshToken }, "Login successful"));
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Verification code sent to email"));
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
  const { accessToken, refreshToken } = await authService.refreshAccessToken(oldRefreshToken as string);

  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed"));
});

export const verifyEmailLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const userAgent = req.headers["user-agent"];
  const deviceInfo = Array.isArray(userAgent) ? userAgent[0] : (userAgent || "Unknown");

  const { user, accessToken, refreshToken } = await authService.verifyEmailOtpAndLogin(
    email,
    code,
    deviceInfo,
    req.ip
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(200, { user, accessToken, refreshToken }, "Login successful"));
});

export const verifyEmailRegister = asyncHandler(async (req: Request, res: Response) => {
  const { data, code } = req.body;
  const userAgent = req.headers["user-agent"];
  const deviceInfo = Array.isArray(userAgent) ? userAgent[0] : (userAgent || "Unknown");

  const { user, accessToken, refreshToken } = await authService.completeRegistration(
    data,
    code,
    deviceInfo,
    req.ip
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(201, { user, accessToken, refreshToken }, "Registration successful"));
});

export const blockUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await authService.blockUser(id as string);
  return res.status(200).json(new ApiResponse(200, {}, "User blocked successfully"));
});

export const unblockUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await authService.unblockUser(id as string);
  return res.status(200).json(new ApiResponse(200, {}, "User unblocked successfully"));
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
