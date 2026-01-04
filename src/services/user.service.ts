import bcrypt from "bcryptjs";
import { ApiError } from "../utils/apiError";
import { User, IUser } from "../models/user.model";
import { authService } from "../services/auth.service";

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

  const { accessToken, refreshToken } = await authService.createTokens(
    user._id.toString()
  );

  // save RT in DB
  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email },
  };
}
