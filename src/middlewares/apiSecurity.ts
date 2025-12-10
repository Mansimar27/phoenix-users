import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Express } from "express";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

export const applySecurityMiddlewares = (app: Express) => {
  // Secure headers also prevents XSS attacks.
  app.use(helmet());

  // Logging
  app.use(morgan("dev"));

  // Compress responses
  app.use(compression());

  // Prevent MongoDB operator injection
  app.use(mongoSanitize());

  // CORS
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "PUT", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Rate limit: 10 requests in 1 minute per IP
  app.use(
    rateLimit({
      max: 10,
      windowMs: 1 * 60 * 1000,
      message: "Too many requests, please try again later.",
    })
  );
};
