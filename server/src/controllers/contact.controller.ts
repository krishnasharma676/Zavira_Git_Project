import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { contactService } from "../services/contact.service";

export const submitMessage = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  const result = await contactService.submitMessage({ name, email, subject, message });
  return res.status(201).json(new ApiResponse(201, result, "Message sent successfully"));
});

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const messages = await contactService.getAllMessages();
  return res.status(200).json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

export const replyToMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reply } = req.body;
  const message = await contactService.replyToMessage(id as string, reply);
  return res.status(200).json(new ApiResponse(200, message, "Reply sent successfully"));
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await contactService.deleteMessage(id as string);
  return res.status(200).json(new ApiResponse(200, {}, "Message deleted successfully"));
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await contactService.markAsRead(id as string);
  return res.status(200).json(new ApiResponse(200, result, "Message marked as read"));
});
