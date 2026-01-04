import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/user.service";

export async function registerUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return ApiError.badRequest("All fields are required");
    }

    const user = await registerUser(name, email, password);
    return ApiResponse.success(res, "User registered successfully", {
      id: user._id,
      email: user.email,
    });
  } catch (error: any) {
    return next(ApiError.internal(error.message));
  }
}

export async function loginUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiError.badRequest("Email and password are required");
    }

    const result = await loginUser(email, password);

    res.cookie("refreshToken", result.refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      path: "/api/auth/refresh-token",
    });

    return ApiResponse.success(res, "Login successful", result);
  } catch (error: any) {
    return next(ApiError.internal(error.message));
  }
}

export const getProfile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select([
      "-password",
      "-refreshToken",
    ]);
    if (!user) return next(ApiError.notFound("User not found"));

    return ApiResponse.success(res, "Profile fetched", user);
  } catch (err: any) {
    next(ApiError.internal(err.message));
  }
};

export const updateProfile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const { name } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    ).select(["-password", "-refreshToken"]);

    return ApiResponse.success(res, "Profile updated", updated);
  } catch (err: any) {
    next(ApiError.internal(err.message));
  }
};

export const changePassword = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return next(ApiError.notFound("User not found"));

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return next(ApiError.badRequest("Old password is incorrect"));

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return ApiResponse.success(res, "Password changed successfully");
  } catch (err: any) {
    next(ApiError.internal(err.message));
  }
};
