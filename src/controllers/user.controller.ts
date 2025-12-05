import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { registerUser, loginUser } from "../services/user.service";

export async function registerUserController(req: Request, res: Response) {
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
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function loginUserController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const result = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
