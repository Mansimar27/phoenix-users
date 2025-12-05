import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export interface JwtPayload {
  userId: string;
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
}
