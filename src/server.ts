import express from "express";
import { ENV } from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { applySecurityMiddlewares } from "./middlewares/apiSecurity";

// Express App.
const app = express();
app.use(express.json());
const { PORT } = ENV || 5555;

// Security Middlewares for All APIs.
applySecurityMiddlewares(app);

// Base Route.
app.get("/", (_req, res) => {
  res.send("User Service is running.");
});
// Health Check Route.
app.get("/health", (_req, res) => {
  res.send("Ok!");
});

// Auth Routes.
app.use("/api/auth", authRoutes);

// User Routes.
app.use("/api/users", userRoutes);

// Other Middlewares here...
app.use(errorHandler);

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✅ Server started on port- ${PORT}.`);
  });
}

startServer();
