import { userRepository } from "../repositories/user.internal";
import { ApiError } from "../utils/ApiError";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { otpService } from "./otp.service";
import bcrypt from "bcryptjs";

export class AuthService {
  async sendOtp(phone: string) {
    if (!phone) throw new ApiError(400, "Phone number is required");
    return await otpService.sendOtp(phone);
  }

  async verifyOtpAndLogin(phone: string, code: string, deviceInfo?: string, ip?: string) {
    if (!phone || !code) throw new ApiError(400, "Phone and OTP are required");

    const otpVerification = await otpService.verifyOtp(phone, code);
    if (!otpVerification.success) {
      throw new ApiError(401, otpVerification.message);
    }

    // 1. Check if user exists
    let user = await userRepository.findByPhone(phone);

    // 2. If not, create user (Signup)
    if (!user) {
      user = await userRepository.create({
        phoneNumber: phone,
        isPhoneVerified: true,
        cart: { create: {} },
        wishlist: { create: {} },
      });
    } else {
      // Update phone verification status if not already
      if (!(user as any).isPhoneVerified) {
        await userRepository.update(user.id, { isPhoneVerified: true });
      }
    }

    // 3. Login - Create tokens & session
    const accessToken = generateAccessToken({ 
      id: user.id, 
      phone: (user as any).phoneNumber, 
      role: user.role 
    });
    
    const refreshToken = generateRefreshToken({ id: user.id });

    await userRepository.createSession({
      userId: user.id,
      refreshToken,
      deviceInfo,
      ipAddress: ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const { password: _, ...userWithoutPassword } = user as any;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async login(email: string, password: string, deviceInfo?: string, ip?: string) {
    if (!email || !password) throw new ApiError(400, "Email and password are required");

    const user = await userRepository.findByEmail(email);
    if (!user || user.isDeleted) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Use bcrypt to compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
       throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = generateAccessToken({ 
      id: user.id, 
      phone: (user as any).phoneNumber, 
      email: user.email,
      role: user.role 
    });
    
    const refreshToken = generateRefreshToken({ id: user.id });

    await userRepository.createSession({
      userId: user.id,
      refreshToken,
      deviceInfo,
      ipAddress: ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const { password: _, ...userWithoutPassword } = user as any;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async register(data: any, deviceInfo?: string, ip?: string) {
    const { name, email, phone, password } = data;
    
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new ApiError(400, "User with this email already exists");
    
    const existingPhone = await userRepository.findByPhone(phone);
    if (existingPhone) throw new ApiError(400, "User with this phone already exists");

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userRepository.create({
      name,
      email,
      phoneNumber: phone,
      password: hashedPassword,
      isPhoneVerified: false,
      cart: { create: {} },
      wishlist: { create: {} },
    });

    const accessToken = generateAccessToken({ 
      id: user.id, 
      phone: (user as any).phoneNumber, 
      email: user.email,
      role: user.role 
    });
    
    const refreshToken = generateRefreshToken({ id: user.id });

    await userRepository.createSession({
      userId: user.id,
      refreshToken,
      deviceInfo,
      ipAddress: ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const { password: _, ...userWithoutPassword } = user as any;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    await userRepository.deleteSession(refreshToken);
  }

  async logoutAll(userId: string) {
    await userRepository.deleteUserSessions(userId);
  }

  async refreshAccessToken(oldRefreshToken: string) {
    const session = await userRepository.findSession(oldRefreshToken);
    if (!session || session.expiresAt < new Date()) {
      if (session) await userRepository.deleteSession(oldRefreshToken);
      throw new ApiError(401, "Refresh token expired or invalid");
    }

    const newAccessToken = generateAccessToken({ 
      id: session.user.id, 
      phone: session.user.phoneNumber, 
      role: session.user.role 
    });
    
    const newRefreshToken = generateRefreshToken({ id: session.user.id });

    await userRepository.deleteSession(oldRefreshToken);
    await userRepository.createSession({
      userId: session.user.id,
      refreshToken: newRefreshToken,
      deviceInfo: session.deviceInfo || undefined,
      ipAddress: session.ipAddress || undefined,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async getUsers() {
    return await userRepository.findAll();
  }

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    const { password: _, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();
