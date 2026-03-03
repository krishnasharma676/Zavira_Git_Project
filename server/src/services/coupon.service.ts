import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export class CouponService {
  async getAllCoupons() {
    return await prisma.coupon.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createCoupon(data: any) {
    const { code, discountType, discountValue, minOrderAmount, maxDiscount, startDate, endDate, usageLimit } = data;

    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) throw new ApiError(400, 'Coupon code already exists');

    return await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageLimit: usageLimit ? parseInt(usageLimit) : null
      }
    });
  }

  async updateCoupon(id: string, data: any) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new ApiError(404, 'Coupon not found');

    const { code, discountType, discountValue, minOrderAmount, maxDiscount, startDate, endDate, usageLimit, isActive } = data;

    return await prisma.coupon.update({
      where: { id },
      data: {
        code: code ? code.toUpperCase() : undefined,
        discountType,
        discountValue: discountValue ? parseFloat(discountValue) : undefined,
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : undefined,
        maxDiscount: maxDiscount !== undefined ? (maxDiscount ? parseFloat(maxDiscount) : null) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
        isActive
      }
    });
  }

  async deleteCoupon(id: string) {
    return await prisma.coupon.update({ where: { id }, data: { isDeleted: true } });
  }

  async validateCoupon(code: string, orderAmount: number) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) throw new ApiError(404, 'Invalid coupon code');
    if (!coupon.isActive) throw new ApiError(400, 'Coupon is inactive');

    const now = new Date();
    if (now < coupon.startDate) throw new ApiError(400, 'Coupon is not yet active');
    if (now > coupon.endDate) throw new ApiError(400, 'Coupon has expired');

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new ApiError(400, 'Coupon usage limit reached');
    }

    if (orderAmount < coupon.minOrderAmount) {
      throw new ApiError(400, `Minimum order amount of ₹${coupon.minOrderAmount} required`);
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return {
      couponId: coupon.id,
      code: coupon.code,
      discountAmount,
      payableAmount: orderAmount - discountAmount
    };
  }
}

export const couponService = new CouponService();
