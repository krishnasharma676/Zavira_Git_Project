import { prisma } from "../config/prisma";

export class CouponRepository {
  async findAll() {
    return await prisma.coupon.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string) {
    return await prisma.coupon.findFirst({
      where: { id, isDeleted: false }
    });
  }

  async findByCode(code: string) {
    return await prisma.coupon.findFirst({
      where: { code, isDeleted: false }
    });
  }

  async create(data: any) {
    return await prisma.coupon.create({
      data
    });
  }

  async update(id: string, data: any) {
    return await prisma.coupon.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string) {
    return await prisma.coupon.update({
      where: { id },
      data: { isDeleted: true, isActive: false }
    });
  }
}

export const couponRepository = new CouponRepository();
