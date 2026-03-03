import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { orderService } from "../services/order.service";
import { ApiResponse } from "../utils/ApiResponse";

export const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const order = await orderService.placeOrder(userId, req.body);
  return res.status(201).json(new ApiResponse(201, order, "Order placed successfully"));
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const orders = await orderService.getMyOrders(userId);
  return res.status(200).json(new ApiResponse(200, orders, "My orders fetched"));
});

export const getOrderDetails = asyncHandler(async (req: Request, res: Response) => {
  const { id, role } = (req as any).user;
  const order = await orderService.getOrderDetails(req.params.id as string, id, role);
  return res.status(200).json(new ApiResponse(200, order, "Order details fetched"));
});

// Admin Controllers
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await orderService.getAllOrders(req.query);
  return res.status(200).json(new ApiResponse(200, result, "All orders fetched"));
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.updateOrderStatus(req.params.id as string, req.body.status);
  return res.status(200).json(new ApiResponse(200, order, "Order status updated"));
});
