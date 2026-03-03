import { z } from "zod";

export const addressSchema = z.object({
  body: z.object({
    type: z.enum(["HOME", "WORK", "OTHER"]).default("HOME"),
    name: z.string().min(2).max(100),
    phone: z.string().min(10).max(15),
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(6).max(6),
    country: z.string().default("India"),
    isDefault: z.boolean().optional(),
  })
});

export const addressIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
