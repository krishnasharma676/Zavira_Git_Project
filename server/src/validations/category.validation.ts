import { z } from "zod";

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(50),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    isActive: z.union([z.boolean(), z.string()]).transform((val) => val === "true" || val === true).optional(),
  })
});

export const updateCategorySchema = z.object({
  body: categorySchema.shape.body.partial(),
  params: z.object({
    id: z.string().uuid().optional()
  })
});
