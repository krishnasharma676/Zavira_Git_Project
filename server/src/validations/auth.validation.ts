import { z } from "zod";

export const sendOtpSchema = z.object({
  body: z.object({
    phone: z.string().min(10).max(10).regex(/^\d+$/, "Invalid phone number"),
  })
});

export const verifyOtpSchema = z.object({
  body: z.object({
    phone: z.string().min(10).max(10).regex(/^\d+$/, "Invalid phone number"),
    code: z.string().min(6).max(6).regex(/^\d+$/, "OTP must be 6 digits"),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10).max(10).regex(/^\d+$/, "Invalid phone number"),
    password: z.string().min(6),
  })
});

export const refreshAccessTokenSchema = z.object({
  // Accept from body or cookies. Validator will check body if we use the validate middleware standardly.
  // Actually, standard validate middleware checks req.body. 
  // If we only use cookies, we might not need body validation.
  // But let's allow body refresh token if cookies fail.
  body: z.object({
    refreshToken: z.string().optional()
  })
});
