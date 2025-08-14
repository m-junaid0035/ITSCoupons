// actions/authActions.ts
"use server";

import { loginUser, getCurrentUser as getCurrentUserFn } from "@/functions/authFunctions";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";

export type AuthFormState = {
  error?: { message?: string[] };
  data?: any;
};

/**
 * LOGIN User (Server Action)
 */
export async function loginUserAction(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  await connectToDatabase();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: { message: ["Email and password are required"] } };
  }

  try {
    const { token, user } = await loginUser(email, password);

    // Save token in cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { data: { user } };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Login failed"] },
    };
  }
}

/**
 * LOGOUT User (Server Action)
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return { success: true };
}

/**
 * Get CURRENT logged-in user (Server Action)
 */
export async function getCurrentUserAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const user = await getCurrentUserFn(token);
    return user;
  } catch (err) {
    console.error("Failed to get current user:", err);
    return null;
  }
}
