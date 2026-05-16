import { ZodError } from "zod";

/**
 * Formats Zod validation issues into stable client-facing field errors.
 *
 * @param {ZodError} error - Zod validation error.
 * @returns {{ field: string, message: string }[]}
 */
function formatZodErrors(error) {
  return error.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join(".") : "body",
    message: issue.message,
  }));
}

/**
 * Validates `req.body` against a strict Zod schema before the route handler runs.
 *
 * @param {import("zod").ZodTypeAny} schema - Request body schema.
 * @returns {import("express").RequestHandler}
 */
export function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request body.",
        details: formatZodErrors(parsed.error),
      });
    }

    req.body = parsed.data;
    next();
  };
}
