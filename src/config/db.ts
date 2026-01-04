import { ENV } from "./env";
import mongoose from "mongoose";

const { MONGO_CONNECTION } = ENV;

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGO_CONNECTION);
    console.log("✅MongoDB connected successfully!");
  } catch (error) {
    console.error("❌MongoDB connection error- ", error);
    process.exit(1); // stop the app if DB connection fails.
  }
}
