"use server";

import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

/**
 * Serialize user object for safe client usage
 */
const serializeUser = (user: IUser) => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role?.toString?.() || null,
  image: user.image || "",
  isActive: user.isActive,
  createdAt: user.createdAt?.toISOString?.() || null,
  updatedAt: user.updatedAt?.toISOString?.() || null,
});

/**
 * Login user with email and password
 */
export const loginUser = async (email: string, password: string) => {
  await connectToDatabase();

  const user = await User.findOne({ email }).select("+password") as IUser | null;

  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { _id: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: serializeUser(user),
  };
};

/**
 * Get current logged-in user from token
 */
export const getCurrentUser = async (token: string) => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string; email: string };
    await connectToDatabase();

    const user = await User.findById(decoded._id) as IUser | null;
    if (!user) return null;

    return serializeUser(user);
  } catch (err) {
    console.error("Invalid or expired token:", err);
    return null;
  }
};
