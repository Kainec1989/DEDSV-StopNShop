import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.resolve(__dirname, "../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

let winston;
try {
  ({ default: winston } = await import("winston"));
} catch {
  winston = null;
}

/**
 * Appends a fallback JSON log line when Winston is not installed yet.
 *
 * @param {string} level - Log severity.
 * @param {string} message - Human-readable message.
 * @param {object} [meta] - Additional structured metadata.
 */
function writeFallbackLog(level, message, meta = {}) {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    service: "stopnshop-api",
    ...meta,
  });

  fs.appendFileSync(path.join(logDirectory, "combined.log"), `${entry}\n`);

  if (level === "error") {
    fs.appendFileSync(path.join(logDirectory, "error.log"), `${entry}\n`);
  }

  if (process.env.NODE_ENV !== "production") {
    const output = level === "error" ? console.error : console.log;
    output(entry);
  }
}

/**
 * Application logger with production file transports and readable local console output.
 */
export const logger = winston
  ? winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      defaultMeta: { service: "stopnshop-api" },
      transports: [
        new winston.transports.File({
          filename: path.join(logDirectory, "error.log"),
          level: "error",
        }),
        new winston.transports.File({
          filename: path.join(logDirectory, "combined.log"),
        }),
      ],
      exceptionHandlers: [
        new winston.transports.File({
          filename: path.join(logDirectory, "exceptions.log"),
        }),
      ],
      rejectionHandlers: [
        new winston.transports.File({
          filename: path.join(logDirectory, "rejections.log"),
        }),
      ],
    })
  : {
      info: (message, meta) => writeFallbackLog("info", message, meta),
      warn: (message, meta) => writeFallbackLog("warn", message, meta),
      error: (message, meta) => writeFallbackLog("error", message, meta),
    };

if (winston && process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

/**
 * Morgan-compatible stream that forwards HTTP access logs into Winston.
 */
export const httpLogStream = {
  write: (message) => {
    logger.info(message.trim());
  },
};
