import { prisma } from "../config/prisma";

export class ReviewRepository {
  async createReview(data: any) {
    return await prisma.review.create({
      data,
      include: {
        user: {
          select: { name: true, avatar: true }
        }
      }
    });
  }

  async getProductReviews(productId: string) {
    return await prisma.review.findMany({
      where: { productId, isDeleted: false, isApproved: true },
      include: {
        user: {
          select: { name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateReviewStatus(id: string, isApproved: boolean) {
    return await prisma.review.update({
      where: { id },
      data: { isApproved }
    });
  }

  async deleteReview(id: string) {
    return await prisma.review.update({
      where: { id },
      data: { isDeleted: true }
    });
  }

  async getAllReviewsAdmin() {
    return await prisma.review.findMany({
      where: { isDeleted: false },
      include: {
        user: { select: { name: true, email: true, phoneNumber: true } },
        product: { select: { name: true, slug: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string) {
    return await prisma.review.findUnique({
      where: { id },
      include: { product: true }
    });
  }

  async getRatingStats(productId: string) {
    const stats = await prisma.review.aggregate({
      where: { productId, isApproved: true, isDeleted: false },
      _avg: { rating: true },
      _count: { rating: true }
    });
    return {
      avgRating: stats._avg.rating || 0,
      totalReviews: stats._count.rating || 0
    };
  }
}

export const reviewRepository = new ReviewRepository();
