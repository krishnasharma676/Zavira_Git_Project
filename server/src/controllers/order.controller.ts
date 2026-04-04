import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { orderService } from "../services/order.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";

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
  const orderId = req.params.id;
  if (typeof orderId !== 'string') throw new ApiError(400, "Invalid order ID");
  const order = await orderService.getOrderDetails(orderId, id, role);
  return res.status(200).json(new ApiResponse(200, order, "Order details fetched"));
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  if (typeof orderId !== 'string') throw new ApiError(400, "Invalid order ID");
  const order = await orderService.verifyPayment(orderId, req.body);
  return res.status(200).json(new ApiResponse(200, order, "Payment verified successfully"));
});

// Admin Controllers
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await orderService.getAllOrders(req.query);
  return res.status(200).json(new ApiResponse(200, result, "All orders fetched"));
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== 'string') throw new ApiError(400, "Invalid order ID");
  const order = await orderService.updateOrderStatus(id, req.body.status);
  return res.status(200).json(new ApiResponse(200, order, "Order status updated"));
});

export const updateOrderNotes = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== 'string') throw new ApiError(400, "Invalid order ID");
  const order = await orderService.updateAdminNotes(id, req.body.adminNotes);
  return res.status(200).json(new ApiResponse(200, order, "Order notes updated"));
});

export const triggerShipment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== 'string') throw new ApiError(400, "Invalid order ID");
  const result = await orderService.manualTriggerShipment(id);
  return res.status(200).json(new ApiResponse(200, result, "Shipment triggered successfully"));
});

export const generateLabel = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== 'string') throw new ApiError(400, "Invalid order ID");
  const result = await orderService.getShipmentLabel(id);
  return res.status(200).json(new ApiResponse(200, result, "Label generated successfully"));
});

export const refundOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;
  if (typeof id !== 'string') throw new ApiError(400, "Invalid order ID");
  const result = await orderService.initiateRefund(id, notes || "Admin initiated refund");
  return res.status(200).json(new ApiResponse(200, result, "Refund initiated successfully"));
});

export const requestReturn = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  if (typeof id !== 'string') throw new ApiError(400, "Invalid order ID");

  const reason: string = req.body?.reason || '';

  // Upload any attached files to Cloudinary
  const files = (req as any).files as Express.Multer.File[] || [];
  const uploadedUrls: string[] = [];
  for (const file of files) {
    const result: any = await uploadOnCloudinary(file.buffer, 'returns');
    if (result?.secure_url) uploadedUrls.push(result.secure_url);
  }

  // Also accept pre-uploaded URLs sent as JSON
  const preUploadedImages: string[] = req.body?.images
    ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images])
    : [];

  const allImages = [...uploadedUrls, ...preUploadedImages];

  const order = await orderService.requestReturn(id, userId, reason, allImages);
  return res.status(200).json(new ApiResponse(200, order, "Return request submitted"));
});

export const uploadReturnImages = asyncHandler(async (req: Request, res: Response) => {
  const files = (req as any).files as Express.Multer.File[] || [];
  if (!files.length) throw new ApiError(400, "No images provided");
  const urls: string[] = [];
  for (const file of files) {
    const result: any = await uploadOnCloudinary(file.buffer, 'returns');
    if (result?.secure_url) urls.push(result.secure_url);
  }
  return res.status(200).json(new ApiResponse(200, { urls }, "Images uploaded successfully"));
});

export const approveReturn = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== 'string') throw new ApiError(400, "Invalid order ID");
  const order = await orderService.approveReturn(id);
  return res.status(200).json(new ApiResponse(200, order, "Return approved and reverse pickup initiated"));
});

export const resetForReshipment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== 'string') throw new ApiError(400, "Invalid order ID");
  const order = await orderService.resetForReshipment(id);
  return res.status(200).json(new ApiResponse(200, order, "Order reset for reshipment. You can now use SHIP NOW again."));
});
export const getPublicTrackingDetails = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Tracking ID is required");
  const result = await orderService.getPublicTracking(id as string);
  return res.status(200).json(new ApiResponse(200, result, "Tracking details fetched successfully"));
});

export const syncShiprocketStatuses = asyncHandler(async (req: Request, res: Response) => {
  const result = await orderService.syncShiprocketStatuses();
  return res.status(200).json(new ApiResponse(200, result, "Shiprocket statuses synced successfully"));
});

export const generateAWB = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== 'string') throw new ApiError(400, "Invalid order ID");
  const result = await orderService.generateAWB(id);
  return res.status(200).json(new ApiResponse(200, result, "AWB generated successfully"));
});

export const cancelShipment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== 'string') throw new ApiError(400, "Invalid order ID");
  const result = await orderService.cancelShipment(id);
  return res.status(200).json(new ApiResponse(200, result, "Shipment cancelled successfully"));
});
