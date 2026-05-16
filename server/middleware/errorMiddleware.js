import mongoose from "mongoose";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

/**
 * Converts Zod validation issues into stable field-level errors.
 *
 * @param {ZodError} err
 * @returns {{ field: string, message: string }[]}
 */
function formatZodIssues(err) {
  return err.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join(".") : "body",
    message: issue.message,
  }));
}

/**
 * Converts Mongoose validation paths into stable field-level errors.
 *
 * @param {mongoose.Error.ValidationError} err
 * @returns {{ field: string, message: string }[]}
 */
function formatMongooseValidation(err) {
  return Object.values(err.errors).map((fieldError) => ({
    field: fieldError.path || "body",
    message: fieldError.message,
  }));
}

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

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Invalid request body.",
      message: "Invalid request body.",
      details: formatZodIssues(err),
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      error: "Invalid identifier format.",
      message: "Invalid identifier format.",
      details: [{ field: err.path || "id", message: `${err.value} is not a valid identifier.` }],
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: "Validation failed.",
      message: "Validation failed.",
      details: formatMongooseValidation(err),
    });
  }

  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    return res.status(409).json({
      error: "Duplicate key violation.",
      message: "Duplicate key violation.",
      details: fields.map((field) => ({
        field,
        message: `${field} already exists.`,
      })),
    });
  }

  if (err instanceof AppError && err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
      message: err.message,
    });
  }

  if (
    err.name === "MongoServerSelectionError" ||
    err.name === "MongoNetworkError" ||
    err.name === "MongooseServerSelectionError"
  ) {
    return res.status(503).json({
      error: "Database is currently unavailable.",
      message: "Database is currently unavailable.",
    });
  }

  return res.status(500).json({
    error: "Internal server error.",
    message: "Internal server error.",
  });
};
