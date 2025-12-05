import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("🔥 Error:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // fallback for unexpected errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
