import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod/v3";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({ message: "Validation failed", errors });
    }

    // If validation passes
    // assign the validated data back to req.body
    // and proceed to the next middleware/route handler
    req.body = result.data;
    next();
  };
}
