import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate = (schema: ZodSchema) => {

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData: any = await schema.parseAsync({
        body: req.body || {},
        query: req.query || {},
        params: req.params || {},
      });
      
      // Update request with validated and transformed data
      if (validatedData.body) req.body = validatedData.body;
      if (validatedData.query) Object.assign(req.query, validatedData.query);
      if (validatedData.params) Object.assign(req.params, validatedData.params);

      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        return next(new ApiError(400, errorMessage));
      }
      next(error);
    }
  };
};

