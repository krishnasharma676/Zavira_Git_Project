import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { reviewService } from "../services/review.service";
import { ApiResponse } from "../utils/ApiResponse";

export const addReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const productId = req.params.productId as string;
  const review = await reviewService.addReview(userId, productId, req.body);
  return res.status(201).json(new ApiResponse(201, review, "Review added successfully"));
});

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.productId as string;
  const reviews = await reviewService.getProductReviews(productId);
  return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

export const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await reviewService.getAllReviews();
  return res.status(200).json(new ApiResponse(200, reviews, "All reviews fetched"));
});

export const approveReview = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const review = await reviewService.approveReview(id);
  return res.status(200).json(new ApiResponse(200, review, "Review approved"));
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await reviewService.deleteReview(id);
  return res.status(200).json(new ApiResponse(200, {}, "Review deleted"));
});
