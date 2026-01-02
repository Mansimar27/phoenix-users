import express from "express";
import { ENV } from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { applySecurityMiddlewares } from "./middlewares/apiSecurity";

// Express App init.
const app = express();
const { PORT } = ENV || 5555;

// Security Middlewares for All APIs.
applySecurityMiddlewares(app);

// Shared Routes.
app.get(["/", "/api", "/health"], (_req, res) => {
  res.status(200).send({
    success: true,
    message: "User Service is running.",
  });
});

// Auth Routes.
app.use("/api/auth", authRoutes);

// User Routes.
app.use("/api/users", userRoutes);

// Other Middlewares here...
app.use(errorHandler);

async function startServer() {
  // First Connect to DB.
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✅Server started on port- ${PORT}.`);
  });
}

// Start Express App Server.
startServer();
