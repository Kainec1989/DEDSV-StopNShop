import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";

/**
 * Express error-handling middleware (must be registered after all routes).
 * Maps known error types to HTTP responses; logs technical details on the server only.
 *
 * @param {Error} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */
export const errorMiddleware = (err, req, res, _next) => {
  console.error("Request error:", {
    message: err.message,
    name: err.name,
    path: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      error: "Invalid identifier format.",
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: "Duplicate key violation.",
    });
  }

  if (err instanceof AppError && err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    error: "Internal server error.",
  });
};
