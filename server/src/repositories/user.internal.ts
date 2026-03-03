import { prisma } from "../config/prisma";
import { UserRole } from "@prisma/client";

export class UserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findFirst({
      where: { email, isDeleted: false },
    });
  }

  async findByPhone(phoneNumber: string) {
    return await prisma.user.findFirst({
      where: { phoneNumber, isDeleted: false },
    });
  }

  async findById(id: string) {
    return await prisma.user.findFirst({
      where: { id, isDeleted: false },
    });
  }

  async create(data: any) {
    return await prisma.user.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // OTP Methods
  async createOTP(data: { phone: string; code: string; expiresAt: Date }) {
    // Delete existing OTPs for this phone first
    await (prisma as any).otp.deleteMany({
      where: { phone: data.phone }
    });
    
    return await (prisma as any).otp.create({
      data,
    });
  }

  async findOTP(phone: string, code: string) {
    return await (prisma as any).otp.findFirst({
      where: { 
        phone, 
        code,
        expiresAt: { gte: new Date() }
      },
    });
  }

  async deleteOTP(phone: string) {
    return await (prisma as any).otp.deleteMany({
      where: { phone },
    });
  }

  async createSession(data: { userId: string; refreshToken: string; expiresAt: Date; deviceInfo?: string; ipAddress?: string }) {
    return await prisma.session.create({
      data,
    });
  }

  async findSession(refreshToken: string) {
    return await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });
  }

  async deleteSession(refreshToken: string) {
    return await prisma.session.delete({
      where: { refreshToken },
    });
  }

  async deleteUserSessions(userId: string) {
    return await prisma.session.deleteMany({
      where: { userId },
    });
  }

  async findAll() {
    return await prisma.user.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const userRepository = new UserRepository();
