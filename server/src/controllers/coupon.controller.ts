import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { couponService } from "../services/coupon.service";

export const getCoupons = asyncHandler(async (req: Request, res: Response) => {
  const coupons = await couponService.getAllCoupons();
  return res.status(200).json(new ApiResponse(200, coupons, "Coupons fetched successfully"));
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await couponService.createCoupon(req.body);
  return res.status(201).json(new ApiResponse(201, coupon, "Coupon created successfully"));
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await couponService.updateCoupon(req.params.id as string, req.body);
  return res.status(200).json(new ApiResponse(200, coupon, "Coupon updated successfully"));
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  await couponService.deleteCoupon(req.params.id as string);
  return res.status(200).json(new ApiResponse(200, {}, "Coupon deleted successfully"));
});

export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, orderAmount } = req.body;
  const result = await couponService.validateCoupon(code, orderAmount);
  return res.status(200).json(new ApiResponse(200, result, "Coupon validated"));
});

