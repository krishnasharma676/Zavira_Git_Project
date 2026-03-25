import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { cartService } from "../services/cart.service";
import { ApiResponse } from "../utils/ApiResponse";

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const cart = await cartService.getCart(userId);
  return res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { productId, quantity, variantId, selectedSize } = req.body;
  const item = await cartService.addItem(userId, productId, quantity, variantId, selectedSize);
  return res.status(200).json(new ApiResponse(200, item, "Item added to cart"));
});

export const updateQuantity = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { cartItemId, quantity } = req.body;
  const item = await cartService.updateQuantity(userId, cartItemId, quantity);
  return res.status(200).json(new ApiResponse(200, item, "Cart updated"));
});


export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const cartItemId = req.params.cartItemId as string;
  await cartService.removeItem(userId, cartItemId);
  return res.status(200).json(new ApiResponse(200, {}, "Item removed from cart"));
});


export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await cartService.clearCart(userId);
  return res.status(200).json(new ApiResponse(200, {}, "Cart cleared"));
});

export const syncCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const cart = await cartService.syncCart(userId);
  return res.status(200).json(new ApiResponse(200, cart, "Cart synced"));
});

export const bulkSync = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { items } = req.body;
  
  if (!Array.isArray(items)) {
    return res.status(400).json(new ApiResponse(400, null, "Items array is required"));
  }

  const mergedCart = await cartService.bulkSync(userId, items);
  return res.status(200).json(new ApiResponse(200, mergedCart, "Cart merged successfully"));
});


