import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    variantId: z.string().uuid().optional().nullable(),
    selectedSize: z.string().optional().nullable(),
  })
});

export const updateCartItemSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().nonnegative(),
    variantId: z.string().uuid().optional().nullable(),
    selectedSize: z.string().optional().nullable(),
  })
});


export const removeCartItemSchema = z.object({
  params: z.object({
    cartItemId: z.string().uuid()
  })
});

