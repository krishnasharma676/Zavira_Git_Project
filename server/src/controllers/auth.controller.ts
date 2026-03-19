import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone } = req.body;
  const result = await authService.sendOtp(phone);
  res.status(200).json({ success: true, message: 'OTP sent successfully', data: result });
});

export const verifyOtpAndLogin = asyncHandler(async (req: Request, res: Response) => {
  const { phone, code } = req.body;
  const ip = req.ip;
  const deviceInfo = req.headers['user-agent'];
  const result = await authService.verifyOtpAndLogin(phone, code, deviceInfo, ip);
  
  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(200).json({ success: true, message: 'Login successful', data: result });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const ip = req.ip;
  const deviceInfo = req.headers['user-agent'];
  const result = await authService.login(email, password, deviceInfo, ip);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({ success: true, message: 'Login successful', data: result });
});

export const verifyEmailOtpAndLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const ip = req.ip;
  const deviceInfo = req.headers['user-agent'];
  const result = await authService.verifyEmailOtpAndLogin(email, code, deviceInfo, ip);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({ success: true, message: 'Login successful', data: result });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(200).json({ success: true, message: result.message, data: result.data });
});

export const completeRegistration = asyncHandler(async (req: Request, res: Response) => {
  const { data, code } = req.body;
  const ip = req.ip;
  const deviceInfo = req.headers['user-agent'];
  const result = await authService.completeRegistration(data, code, deviceInfo, ip);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({ success: true, message: 'Registration complete', data: result });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies.refreshToken;
  const result = await authService.refreshAccessToken(oldRefreshToken);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({ success: true, data: result });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  await authService.logout(refreshToken);
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await authService.getProfile(userId);
  res.status(200).json({ success: true, data: result });
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.getUsers();
  res.status(200).json({ success: true, data: result });
});

export const blockUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await authService.blockUser(id);
  res.status(200).json({ success: true, message: 'User blocked successfully' });
});

export const unblockUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await authService.unblockUser(id);
  res.status(200).json({ success: true, message: 'User unblocked successfully' });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await authService.deleteUser(id);
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});
