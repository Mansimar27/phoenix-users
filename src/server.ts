import express from "express";
import { ENV } from "./config/env";
import { connectDB } from "./config/db";
import userRoutes from "./routes/user.routes";

const app = express();
const { PORT } = ENV || 5555;

app.use(express.json());
app.get("/", (_req, res) => {
  res.send("User Service is running on port- " + PORT);
});
app.get("/health", (_req, res) => {
  res.send("OK");
});
app.use("/api/users", userRoutes);

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✅ Server started on port- ${PORT}.`);
  });
}

startServer();
