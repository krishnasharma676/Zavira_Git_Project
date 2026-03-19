import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { inventoryService } from "../services/inventory.service";

export const getInventoryList = asyncHandler(async (req: Request, res: Response) => {
  const result = await inventoryService.getInventory(req.query);
  return res.status(200).json(new ApiResponse(200, result, "Inventory fetched"));
});

export const updateStock = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { stock } = req.body;
  const result = await inventoryService.updateSingleStock(productId as string, stock);
  return res.status(200).json(new ApiResponse(200, result, "Stock updated"));
});

export const updateSKU = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { sku } = req.body;
  const result = await inventoryService.updateSingleSKU(productId as string, sku);
  return res.status(200).json(new ApiResponse(200, result, "SKU updated"));
});

export const bulkUpdateInventory = asyncHandler(async (req: Request, res: Response) => {
  const { updates } = req.body;
  await inventoryService.bulkSyncStock(updates);
  return res.status(200).json(new ApiResponse(200, {}, "Bulk inventory updated"));
});
