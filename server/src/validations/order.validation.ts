import { z } from "zod";

export const checkoutSchema = z.object({
  body: z.object({
    addressId: z.string().uuid(),
    paymentMethod: z.enum(["COD", "ONLINE"]),
    items: z.array(z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive()
    })).optional()
  })
});

export const orderIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
  })
});
