import bcrypt from "bcryptjs";
import { ApiError } from "../utils/apiError";
import { authService } from "./auth.service";
import { User, IUser } from "../models/user.model";

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<IUser> {
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.badRequest("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  return user.save();
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.badRequest("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw ApiError.badRequest("Invalid credentials");
  }

  // 🔥 Now use refresh-token logic
  const tokens = await authService.createTokens(user._id.toString());

  return {
    ...tokens,
    user: { id: user._id, name: user.name, email: user.email },
  };
}
