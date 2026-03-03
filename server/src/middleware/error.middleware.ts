import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("✘ API Error:", err);

  // ── Prisma known errors ─────────────────────────────────────────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        // Unique constraint — extract the field name cleanly
        const fields = (err.meta?.target as string[])?.join(', ') || 'field';
        return res.status(409).json({
          success: false,
          message: `A record with this ${fields} already exists.`,
          data: null,
        });
      }
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Record not found.',
          data: null,
        });
      case 'P2003':
        return res.status(400).json({
          success: false,
          message: 'Invalid reference — related record does not exist.',
          data: null,
        });
      default:
        return res.status(500).json({
          success: false,
          message: 'Database error. Please try again.',
          data: null,
        });
    }
  }

  // ── Prisma validation errors ─────────────────────────────────────────────────
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data provided.',
      data: null,
    });
  }

  // ── Our ApiError ─────────────────────────────────────────────────────────────
  const statusCode = err.statusCode || err.status || 500;
  const message    = err.statusCode ? err.message : 'Something went wrong. Please try again.';

  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    ...(process.env.NODE_ENV === 'development' ? { _debug: err.message } : {}),
  });
};
