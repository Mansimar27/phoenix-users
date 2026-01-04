import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import rateLimit from "express-rate-limit";

export const applySecurityMiddlewares = (app: Express) => {
  // Body parsing and limiting.
  app.use(cookieParser());
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: false, limit: "100kb" }));

  // Secure headers and prevents XSS attacks.
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "PUT", "POST", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Rate limit: 30 requests in 1 minute per IP
  app.use(
    "/api",
    rateLimit({
      max: 30,
      windowMs: 1 * 60 * 1000,
      message: "Too many requests, please try again later.",
    })
  );

  // Compress responses
  app.use(compression());

  // Logging
  app.use(morgan("dev"));
};
