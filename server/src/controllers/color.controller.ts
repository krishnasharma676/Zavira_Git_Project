import { Request, Response } from 'express';
import { colorService } from '../services/color.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getAllColors = asyncHandler(async (req: Request, res: Response) => {
  const colors = await colorService.getAllColors();
  res.status(200).json({ status: 'success', data: colors });
});

export const createColor = asyncHandler(async (req: Request, res: Response) => {
  const color = await colorService.createColor(req.body);
  res.status(201).json({ status: 'success', data: color });
});

export const deleteColor = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await colorService.deleteColor(id);
  res.status(204).json({ status: 'success', data: null });
});
