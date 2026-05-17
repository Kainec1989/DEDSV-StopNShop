let helmet;
let rateLimit;

try {
  ({ default: helmet } = await import("helmet"));
} catch {
  helmet = null;
}

try {
  ({ rateLimit } = await import("express-rate-limit"));
} catch {
  rateLimit = null;
}

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 100;
const fallbackBuckets = new Map();

/**
 * Setzt Sicherheits-Header, die Browser gegen Clickjacking, MIME-Sniffing
 * und unsichere Cross-Origin-Nutzung haerten. Wenn `helmet` installiert ist,
 * uebernimmt Helmet diese Header zentral; sonst bleibt ein kleiner Fallback.
 */
export const securityHeaders = helmet
  ? helmet()
  : (_req, res, next) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "SAMEORIGIN");
      res.setHeader("Referrer-Policy", "no-referrer");
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      next();
    };

/**
 * Begrenzt API-Anfragen pro IP, um Brute-Force-Versuche, Scraping und einfache
 * Denial-of-Service-Spitzen zu reduzieren. In Produktion sollte bei mehreren
 * Server-Instanzen ein geteilter Store wie Redis genutzt werden.
 */
export const apiRateLimiter = rateLimit
  ? rateLimit({
      windowMs: FIFTEEN_MINUTES_MS,
      max: MAX_REQUESTS_PER_WINDOW,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: "Too many requests. Please try again later.",
      },
    })
  : (req, res, next) => {
      const now = Date.now();
      const key = req.ip || req.socket.remoteAddress || "unknown";
      const bucket = fallbackBuckets.get(key);

      if (!bucket || bucket.resetAt <= now) {
        fallbackBuckets.set(key, {
          count: 1,
          resetAt: now + FIFTEEN_MINUTES_MS,
        });
        return next();
      }

      bucket.count += 1;
      if (bucket.count > MAX_REQUESTS_PER_WINDOW) {
        return res.status(429).json({
          error: "Too many requests. Please try again later.",
        });
      }

      next();
    };
