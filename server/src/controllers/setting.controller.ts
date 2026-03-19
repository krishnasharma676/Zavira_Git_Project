import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { settingService } from "../services/setting.service";

export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await settingService.getAllSettings();
  return res.status(200).json(new ApiResponse(200, settings, "Settings fetched"));
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  await settingService.updateSettings(req.body);
  return res.status(200).json(new ApiResponse(200, {}, "Settings updated successfully"));
});
