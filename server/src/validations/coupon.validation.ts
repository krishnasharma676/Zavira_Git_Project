import { z } from "zod";

export const couponSchema = z.object({
  body: z.object({
    code: z.string().min(3).max(20),
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: z.preprocess((val) => parseFloat(val as string), z.number().positive()),
    minOrderAmount: z.preprocess((val) => parseFloat(val as string), z.number().nonnegative()).default(0),
    maxDiscount: z.preprocess((val) => (val ? parseFloat(val as string) : null), z.number().positive().nullable().optional()),
    startDate: z.string().transform((val) => new Date(val)),
    endDate: z.string().transform((val) => new Date(val)),
    usageLimit: z.preprocess((val) => (val ? parseInt(val as string) : null), z.number().positive().nullable().optional()),
    isActive: z.union([z.boolean(), z.string()]).transform((val) => val === "true" || val === true).optional(),
  })
});

export const updateCouponSchema = z.object({
  body: couponSchema.shape.body.partial(),
  params: z.object({
    id: z.string().uuid()
  })
});

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1),
    orderAmount: z.number().nonnegative(),
  })
});
