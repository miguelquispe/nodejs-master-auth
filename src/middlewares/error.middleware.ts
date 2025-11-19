import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.log("Error capturado:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details ?? null,
    });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
}
