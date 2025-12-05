import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.util";
import { User, IUser } from "../models/user.model";

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<IUser> {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  return user.save();
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id.toString());

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
}
