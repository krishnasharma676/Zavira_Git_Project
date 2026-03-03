import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { bannerService } from "../services/banner.service";

export const getBanners = asyncHandler(async (req: Request, res: Response) => {
  const banners = await bannerService.getActiveBanners();
  return res.status(200).json(new ApiResponse(200, banners, "Banners fetched successfully"));
});

export const getAllBanners = asyncHandler(async (req: Request, res: Response) => {
  const banners = await bannerService.getAllBanners();
  return res.status(200).json(new ApiResponse(200, banners, "All banners fetched successfully"));
});

export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await bannerService.createBanner(req.body, req.file);
  return res.status(201).json(new ApiResponse(201, banner, "Banner created successfully"));
});

export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await bannerService.updateBanner(req.params.id as string, req.body, req.file);
  return res.status(200).json(new ApiResponse(200, banner, "Banner updated successfully"));
});

export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  await bannerService.deleteBanner(req.params.id as string);
  return res.status(200).json(new ApiResponse(200, {}, "Banner deleted successfully"));
});

export const incrementBannerClick = asyncHandler(async (req: Request, res: Response) => {
  await bannerService.trackClick(req.params.id as string);
  return res.status(200).json(new ApiResponse(200, {}, "Click counted"));
});


