/**
 * Wraps an async Express handler so rejected promises are forwarded to `next(err)`
 * and handled by the centralized error middleware.
 *
 * @param {import("express").RequestHandler} fn - Async route handler.
 * @returns {import("express").RequestHandler}
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
