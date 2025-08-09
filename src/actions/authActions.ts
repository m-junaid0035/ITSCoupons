// actions/userActions.ts or actions/authActions.ts
"use server";

import { loginUser } from "@/functions/authFunctions";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";

export type AuthFormState = {
  error?: { message?: string[] };
  data?: any;
};

/**
 * LOGIN User
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
    const cookieStore = await cookies(); // FIX: await here
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

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}