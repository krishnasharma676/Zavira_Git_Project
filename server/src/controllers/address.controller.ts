import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { addressService } from "../services/address.service";
import { ApiResponse } from "../utils/ApiResponse";

export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const address = await addressService.addAddress(userId, req.body);
  return res.status(201).json(new ApiResponse(201, address, "Address added successfully"));
});

export const getMyAddresses = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const addresses = await addressService.getMyAddresses(userId);
  return res.status(200).json(new ApiResponse(200, addresses, "Addresses fetched successfully"));
});

export const setDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const id = req.params.id as string;
  await addressService.setDefaultAddress(userId, id);
  return res.status(200).json(new ApiResponse(200, {}, "Default address updated"));
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const id = req.params.id as string;
  await addressService.deleteAddress(userId, id);
  return res.status(200).json(new ApiResponse(200, {}, "Address deleted successfully"));
});
