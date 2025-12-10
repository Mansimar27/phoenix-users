import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5555,
  JWT_SECRET: process.env.JWT_SECRET || "Test-JWT",
  MONGO_CONNECTION: process.env.MONGO_CONNECTION || "",
};
