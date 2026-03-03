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
  const { productId, quantity } = req.body;
  const item = await cartService.addItem(userId, productId, quantity);
  return res.status(200).json(new ApiResponse(200, item, "Item added to cart"));
});

export const updateQuantity = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { productId, quantity } = req.body;
  const item = await cartService.updateQuantity(userId, productId, quantity);
  return res.status(200).json(new ApiResponse(200, item, "Cart updated"));
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const productId = req.params.productId as string;
  await cartService.removeItem(userId, productId);
  return res.status(200).json(new ApiResponse(200, {}, "Item removed from cart"));
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await cartService.clearCart(userId);
  return res.status(200).json(new ApiResponse(200, {}, "Cart cleared"));
});
