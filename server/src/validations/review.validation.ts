import { z } from "zod";

export const addReviewSchema = z.object({
  params: z.object({
    productId: z.string().uuid()
  }),
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5),

    comment: z.string().min(5).max(1000),
  })
});

export const getProductReviewsSchema = z.object({
  params: z.object({
    productId: z.string().uuid()
  })
});

export const reviewIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
