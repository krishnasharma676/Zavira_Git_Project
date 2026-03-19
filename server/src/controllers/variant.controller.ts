import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { variantService } from '../services/variant.service';

// Create variants for a product (bulk upload with images)
export const createVariants = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.productId as string;
  const filesArray = (req.files as Express.Multer.File[]) || [];
  const filesMap: { [fieldname: string]: Express.Multer.File[] } = {};
  filesArray.forEach(file => {
    if (!filesMap[file.fieldname]) filesMap[file.fieldname] = [];
    filesMap[file.fieldname].push(file);
  });
  
  let variantsData = [];
  if (req.body.variants) {
    if (typeof req.body.variants === 'string') {
      variantsData = JSON.parse(req.body.variants);
    } else {
      variantsData = req.body.variants;
    }
  }

  const variants = await variantService.createVariants(productId, variantsData, filesMap);
  res.status(201).json(new ApiResponse(201, variants, 'Variants created successfully'));
});

// Get all variants for a product
export const getVariants = asyncHandler(async (req: Request, res: Response) => {
  const productId = req.params.productId as string;
  const variants = await variantService.getVariants(productId);
  res.json(new ApiResponse(200, variants, 'Variants fetched'));
});

// Delete a variant
export const deleteVariant = asyncHandler(async (req: Request, res: Response) => {
  const variantId = req.params.variantId as string;
  await variantService.deleteVariant(variantId);
  res.json(new ApiResponse(200, null, 'Variant deleted'));
});

// Update size stock
export const updateSizeStock = asyncHandler(async (req: Request, res: Response) => {
  const sizeId = req.params.sizeId as string;
  const { stock } = req.body;
  const updated = await variantService.updateSizeStock(sizeId, Number(stock));
  res.json(new ApiResponse(200, updated, 'Stock updated'));
});
