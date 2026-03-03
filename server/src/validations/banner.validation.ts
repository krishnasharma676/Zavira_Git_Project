import { z } from "zod";

export const bannerSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    // Accepts full URLs (https://...) OR internal relative paths (/shop?category=...)
    link: z.preprocess(
      (val) => (val === '' || val === null ? undefined : val),
      z.string().optional()
    ),
    type: z.enum(["HERO", "ANNOUNCEMENT", "BADGE"]).default("HERO"),
    isActive: z.union([z.boolean(), z.string()]).transform((val) => val === "true" || val === true).optional(),
  })
});

export const updateBannerSchema = z.object({
  body: bannerSchema.shape.body.partial(),
  params: z.object({
    id: z.string().uuid()
  })
});

