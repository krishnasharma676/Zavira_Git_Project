import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { reportService } from "../services/report.service";

export const getAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const result = await reportService.getAdvancedAnalytics();
  return res.status(200).json(new ApiResponse(200, result, "Analytics synchronized"));
});
