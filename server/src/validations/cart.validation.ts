import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })
});

export const updateCartItemSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().nonnegative(),
  })
});

export const removeCartItemSchema = z.object({
  params: z.object({
    productId: z.string().uuid()
  })
});
