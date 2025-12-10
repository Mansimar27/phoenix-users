import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: 15 * 60, // 15 minutes
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, ENV.JWT_SECRET);
};
