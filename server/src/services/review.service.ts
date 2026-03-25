import { reviewRepository } from "../repositories/review.internal";
import { productRepository } from "../repositories/product.internal";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../config/prisma";

export class ReviewService {
  async addReview(userId: string, productId: string, data: any) {
    const product = await productRepository.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    // Check if user already reviewed this product to avoid spam
    // This could be an optional rule
    
    return await reviewRepository.createReview({
      userId,
      productId,
      rating: parseInt(data.rating),
      comment: data.comment,
      images: data.images || [],
      isApproved: false, // Moderation required
    });

  }

  async getProductReviews(productId: string) {
    return await reviewRepository.getProductReviews(productId);
  }

  async approveReview(id: string) {
    const review = await reviewRepository.findById(id);
    if (!review) throw new ApiError(404, "Review not found");

    const updatedReview = await reviewRepository.updateReviewStatus(id, true);
    
    // Update product stats
    await this.updateProductRating(review.productId);

    return updatedReview;
  }

  async deleteReview(id: string) {
    const review = await reviewRepository.findById(id);
    if (!review) throw new ApiError(404, "Review not found");

    const result = await reviewRepository.deleteReview(id);
    
    // Update product stats if the deleted review was approved
    if (review.isApproved) {
      await this.updateProductRating(review.productId);
    }

    return result;
  }

  async getAllReviews() {
    return await reviewRepository.getAllReviewsAdmin();
  }

  private async updateProductRating(productId: string) {
    const stats = await reviewRepository.getRatingStats(productId);
    await prisma.product.update({
      where: { id: productId },
      data: {
        avgRating: stats.avgRating,
        totalReviews: stats.totalReviews
      }
    });
  }
}

export const reviewService = new ReviewService();
