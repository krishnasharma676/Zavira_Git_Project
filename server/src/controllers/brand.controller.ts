import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { brandService } from "../services/brand.service";

export const getBrands = asyncHandler(async (req: Request, res: Response) => {
  const brands = await brandService.getAllBrands();
  return res.status(200).json(new ApiResponse(200, brands, "Brands fetched successfully"));
});

export const createBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await brandService.createBrand(req.body, req.file);
  return res.status(201).json(new ApiResponse(201, brand, "Brand created successfully"));
});

export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await brandService.updateBrand(req.params.id as string, req.body, req.file);
  return res.status(200).json(new ApiResponse(200, brand, "Brand updated successfully"));
});

export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  await brandService.deleteBrand(req.params.id as string);
  return res.status(200).json(new ApiResponse(200, {}, "Brand deleted successfully"));
});

