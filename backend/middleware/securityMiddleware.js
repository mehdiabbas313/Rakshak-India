import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

export const helmetMiddleware = helmet({
  crossOriginResourcePolicy: {
    policy: "cross-origin",
  },
});

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: "Too many login or registration attempts. Please try again later.",
  },
});

export const hppMiddleware = hpp();