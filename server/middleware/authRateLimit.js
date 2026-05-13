/**
 * Simple sliding-window rate limiter per IP for authentication routes.
 * In-memory only — use Redis or a gateway limiter in multi-instance production.
 *
 * @param {{ windowMs?: number, max?: number }} [options]
 * @returns {import("express").RequestHandler}
 */
export function authRateLimit(options = {}) {
  const windowMs = options.windowMs ?? 15 * 60 * 1000;
  const max = options.max ?? 30;

  /** @type {Map<string, { count: number, windowStart: number }>} */
  const buckets = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    const now = Date.now();
    let b = buckets.get(ip);
    if (!b || now - b.windowStart > windowMs) {
      b = { count: 0, windowStart: now };
      buckets.set(ip, b);
    }
    b.count += 1;
    if (b.count > max) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }
    next();
  };
}
