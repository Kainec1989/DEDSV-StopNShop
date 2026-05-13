/**
 * Operational error with an explicit HTTP status code.
 * Used by services so the global error middleware can return safe, consistent responses.
 */
export class AppError extends Error {
  /**
   * @param {string} message - Human-readable error description (exposed to the client when appropriate).
   * @param {number} [statusCode=500] - HTTP status code.
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    /** Marks errors that are expected (validation, not found), not programming bugs. */
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
