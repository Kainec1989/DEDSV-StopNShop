import { httpLogStream } from "../utils/logger.js";

let morgan;
try {
  ({ default: morgan } = await import("morgan"));
} catch {
  morgan = null;
}

/**
 * HTTP request logger. Uses Apache combined format in production-friendly files.
 */
export const requestLogger = morgan
  ? morgan("combined", {
      stream: httpLogStream,
      skip: (req) => req.path === "/health",
    })
  : (req, res, next) => {
      if (req.path === "/health") {
        return next();
      }

      const startedAt = process.hrtime.bigint();
      res.on("finish", () => {
        const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
        httpLogStream.write(
          `${req.ip} "${req.method} ${req.originalUrl} HTTP/${req.httpVersion}" ${res.statusCode} ${res.get("content-length") || 0} "${req.get("referer") || "-"}" "${req.get("user-agent") || "-"}" ${durationMs.toFixed(2)}ms`,
        );
      });

      next();
    };
