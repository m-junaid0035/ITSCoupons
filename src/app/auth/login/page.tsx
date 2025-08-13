"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { loginUserAction } from "../../../actions/authActions";
import type { AuthFormState } from "../../../actions/authActions";

const initialState: AuthFormState = {
  error: undefined,
  data: undefined,
};

export default function LoginPage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (prevState: AuthFormState, formData: FormData): Promise<AuthFormState> => {
      const result = await loginUserAction(prevState, formData);
      if (result?.data) {
        router.push("/admin");
      }
      return result;
    },
    initialState
  );

  // Extract field error (if present)
  const errorFor = (field: string): string | null => {
    if (
      state.error &&
      typeof state.error === "object" &&
      field in state.error
    ) {
      return (state.error as Record<string, string[]>)[field]?.[0] || null;
    }
    return null;
  };

  return (
    <form action={formAction} className="space-y-6 max-w-sm mt-10 mx-auto">
      <h1 className="text-2xl font-bold">Admin Login</h1>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
        {errorFor("email") && <p className="text-sm text-red-500">{errorFor("email")}</p>}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
        {errorFor("password") && (
          <p className="text-sm text-red-500">{errorFor("password")}</p>
        )}
      </div>

      {/* General Error */}
      {"message" in (state.error ?? {}) && (
        <p className="text-sm text-red-500">
          {(state.error as any).message?.[0]}
        </p>
      )}

      {/* Submit */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
