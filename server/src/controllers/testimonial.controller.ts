import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { testimonialService } from "../services/testimonial.service";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary";

export const createTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  if (req.file) {
    const uploadResult: any = await uploadOnCloudinary(req.file.buffer, "testimonials");
    data.imageUrl = uploadResult.secure_url;
    data.imagePublicId = uploadResult.public_id;
  }
  
  // Parse numeric values from FormData
  if (data.rating) data.rating = parseInt(data.rating);
  if (data.isActive === 'true') data.isActive = true;
  if (data.isActive === 'false') data.isActive = false;

  const testimonial = await testimonialService.createTestimonial(data);
  return res.status(201).json(new ApiResponse(201, testimonial, "Testimonial created successfully"));
});

export const getPublicTestimonials = asyncHandler(async (_req: Request, res: Response) => {
  const testimonials = await testimonialService.getAllPublic();
  return res.status(200).json(new ApiResponse(200, testimonials, "Testimonials fetched"));
});

export const getAllTestimonialsAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const testimonials = await testimonialService.getAllAdmin();
  return res.status(200).json(new ApiResponse(200, testimonials, "All testimonials fetched"));
});

export const updateTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const id = req.params.id as string;
  const oldTestimonial: any = await testimonialService.getById(id);

  if (req.file) {
    // Delete old image if exists
    if (oldTestimonial?.imagePublicId) {
      await deleteFromCloudinary(oldTestimonial.imagePublicId);
    }
    const uploadResult: any = await uploadOnCloudinary(req.file.buffer, "testimonials");
    data.imageUrl = uploadResult.secure_url;
    data.imagePublicId = uploadResult.public_id;
  }

  if (data.rating) data.rating = parseInt(data.rating);
  if (data.isActive === 'true') data.isActive = true;
  if (data.isActive === 'false') data.isActive = false;

  const testimonial = await testimonialService.updateTestimonial(id, data);
  return res.status(200).json(new ApiResponse(200, testimonial, "Testimonial updated"));
});

export const deleteTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const testimonial: any = await testimonialService.getById(id);
  if (testimonial?.imagePublicId) {
    await deleteFromCloudinary(testimonial.imagePublicId);
  }
  await testimonialService.deleteTestimonial(id);
  return res.status(200).json(new ApiResponse(200, {}, "Testimonial deleted"));
});
