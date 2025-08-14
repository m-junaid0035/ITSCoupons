"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { loginUserAction } from "@/actions/authActions";
import type { AuthFormState } from "@/actions/authActions";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mt-3">
            ITSCoupons Admin Panel
          </h1>
          <p className="text-sm text-gray-500">Secure login to manage coupons</p>
        </div>

        <form action={formAction} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              className="w-full border-gray-300 focus:border-black focus:ring-black"
              required
            />
            {errorFor("email") && <p className="text-sm text-red-500">{errorFor("email")}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full border-gray-300 focus:border-black focus:ring-black"
              required
            />
            {errorFor("password") && (
              <p className="text-sm text-red-500">{errorFor("password")}</p>
            )}
          </div>

          {/* General Error */}
          {"message" in (state.error ?? {}) && (
            <p className="text-sm text-red-500 text-center">
              {(state.error as any).message?.[0]}
            </p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full py-2 text-white bg-black hover:bg-gray-800 transition rounded-lg"
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
