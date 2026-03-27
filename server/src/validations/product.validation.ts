import { z } from "zod";

export const productSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(1),
    basePrice: z.preprocess((val) => parseFloat(val as string), z.number().positive()),
    discountedPrice: z.preprocess((val) => (val ? parseFloat(val as string) : null), z.number().positive().nullable().optional()),
    categoryId: z.string().uuid(),
    subCategoryId: z.string().uuid().optional().nullable(),
    stock: z.preprocess((val) => parseInt(val as string), z.number().int().nonnegative()).default(0),
    sku: z.string().optional().nullable(),
    featured: z.union([z.boolean(), z.string()]).transform((val) => val === "true" || val === true).optional(),
    trending: z.union([z.boolean(), z.string()]).transform((val) => val === "true" || val === true).optional(),
    hotDeals: z.union([z.boolean(), z.string()]).transform((val) => val === "true" || val === true).optional(),
    attributes: z.any().optional(),
    sizes: z.string().optional().nullable(),
    weight: z.preprocess((val) => (val ? parseFloat(val as string) : 0), z.number().nonnegative()).optional(),
    length: z.preprocess((val) => (val ? parseFloat(val as string) : 0), z.number().nonnegative()).optional(),
    width: z.preprocess((val) => (val ? parseFloat(val as string) : 0), z.number().nonnegative()).optional(),
    height: z.preprocess((val) => (val ? parseFloat(val as string) : 0), z.number().nonnegative()).optional(),
    hsnCode: z.string().optional().nullable(),
    taxRate: z.preprocess((val) => (val ? parseFloat(val as string) : 0), z.number().nonnegative()).optional(),
    weightUnit: z.string().optional().default("kg"),
    dimensionUnit: z.string().optional().default("cm"),
  })
});


export const updateProductSchema = z.object({
  body: productSchema.shape.body.partial(),
  params: z.object({
    id: z.string().uuid()
  })
});

export const productSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1)
  })
});
