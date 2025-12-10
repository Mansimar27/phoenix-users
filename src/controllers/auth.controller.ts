import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { authService } from "../services/auth.service";
import { Request, Response, NextFunction } from "express";
import { RefreshToken } from "../models/refreshToken.model";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user }: any = req; // user validated in userService login()

    const tokens = await authService.createTokens(user.id);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/auth/refresh-token",
    });

    return ApiResponse.success(res, "Login successful", {
      accessToken: tokens.accessToken,
      user,
    });
  } catch (error: any) {
    next(ApiError.internal(error.message));
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return next(ApiError.unauthorized("No refresh token"));

    const tokens = await authService.rotateRefreshToken(refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/auth/refresh-token",
    });

    return ApiResponse.success(res, "Token refreshed", {
      accessToken: tokens.accessToken,
    });
  } catch (error: any) {
    return next(ApiError.unauthorized(error.message));
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await RefreshToken.deleteOne({ token });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return ApiResponse.success(res, "Logged out successfully");
  } catch (err: any) {
    next(ApiError.internal(err.message));
  }
};
