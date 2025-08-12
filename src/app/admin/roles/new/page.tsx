"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react"; // assuming this is where useActionState is from
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const permissionEnumValues = [
  "blog",
  "roles",
  "users",
  "settings",
  "categories",
  "stores",
  "coupons",
  "events",
  "subscribers",
] as const;

interface FieldErrors {
  [key: string]: string[];
}

interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

import { createRoleAction } from "@/actions/roleActions";

export default function RoleForm() {
  const router = useRouter();
  const [formState, dispatch, isPending] = useActionState(
    createRoleAction,
    initialState
  );

  // Helper to get the first error message for a field
  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  // Redirect after successful role creation
  useEffect(() => {
    if (formState.data && !formState.error) {
      router.push("/admin/roles");
    }
  }, [formState, router]);

  return (
    <Card className="max-w-3xl mx-auto shadow-lg bg-white">
      <CardHeader className="flex items-center justify-between border-none">
        <CardTitle>Create Role</CardTitle>
        <Button variant="secondary" onClick={() => router.push("/admin/roles")}>
          Back to Roles
        </Button>
      </CardHeader>

      <CardContent>
        <form action={dispatch} className="space-y-6 max-w-xl">
          {/* Role Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
            <Input id="name" name="name" required className="border-none shadow-sm" />
            {errorFor("name") && (
              <p className="text-sm text-red-500">{errorFor("name")}</p>
            )}
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" name="displayName" required className="border-none shadow-sm" />
            {errorFor("displayName") && (
              <p className="text-sm text-red-500">{errorFor("displayName")}</p>
            )}
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2">
              {permissionEnumValues.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox id={permission} name="permissions" value={permission} />
                  <Label htmlFor={permission}>{permission}</Label>
                </div>
              ))}
            </div>
            {errorFor("permissions") && (
              <p className="text-sm text-red-500">{errorFor("permissions")}</p>
            )}
          </div>

          {/* General Error */}
          {"message" in (formState.error ?? {}) && (
            <p className="text-sm text-red-500">{(formState.error as any).message?.[0]}</p>
          )}

          <CardFooter className="flex justify-end border-none">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : "Save Role"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
