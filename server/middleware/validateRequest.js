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
      return next(parsed.error);
    }

    req.body = parsed.data;
    next();
  };
}
