import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { productService } from "../services/product.service";
import { ApiResponse } from "../utils/ApiResponse";

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.getAllProducts(req.query);
  return res.status(200).json(new ApiResponse(200, result, "Products fetched successfully"));
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductBySlug(req.params.slug as string);
  return res.status(200).json(new ApiResponse(200, product, "Product details fetched"));
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const product = await productService.createProduct(req.body, files);
  return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const product = await productService.updateProduct(req.params.id as string, req.body, files);
  return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.id as string);
  return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
});

export const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const product = await productService.uploadProductImages(req.params.id as string, files);
  return res.status(200).json(new ApiResponse(200, product, "Images uploaded successfully"));
});

export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  await productService.deleteProductImage(req.params.productId as string, req.params.imageId as string);
  return res.status(200).json(new ApiResponse(200, {}, "Image deleted successfully"));
});
