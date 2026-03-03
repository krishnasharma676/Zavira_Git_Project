import { z } from "zod";

export const brandSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(50),
    description: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
    imageUrl: z.string().optional(),
  })
});

export const updateBrandSchema = z.object({
  body: brandSchema.shape.body.partial(),
  params: z.object({
    id: z.string().uuid()
  })
});
