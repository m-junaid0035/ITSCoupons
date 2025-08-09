"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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

interface FormState {
  error?: Record<string, string[]>;
  data?: any;
}

const initialState: FormState = {
  error: {},
};

interface RoleFormProps {
  initialData?: {
    name: string;
    displayName: string;
    permissions: string[];
  };
  action: (
    prevState: FormState,
    formData: FormData
  ) => Promise<FormState>;
  buttonLabel?: string;
}

export default function RoleForm({
  initialData,
  action,
  buttonLabel = "Save Role",
}: RoleFormProps) {
  const [formState, dispatch, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (formState.data?.redirectTo) {
      window.location.href = formState.data.redirectTo;
    }
  }, [formState.data]);

  return (
    <form action={dispatch} className="space-y-6 max-w-xl">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Role Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={initialData?.name || ""}
          required
        />
        {formState.error?.name && (
          <p className="text-sm text-red-500">{formState.error.name?.[0]}</p>
        )}
      </div>

      {/* Display Name Field */}
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          name="displayName"
          defaultValue={initialData?.displayName || ""}
          required
        />
        {formState.error?.displayName && (
          <p className="text-sm text-red-500">
            {formState.error.displayName?.[0]}
          </p>
        )}
      </div>

      {/* Permissions */}
      <div className="space-y-2">
        <Label>Permissions</Label>
        <div className="grid grid-cols-2 gap-2">
          {permissionEnumValues.map((permission) => (
            <div key={permission} className="flex items-center space-x-2">
              <Checkbox
                id={permission}
                name="permissions"
                value={permission}
                defaultChecked={initialData?.permissions?.includes(permission)}
              />
              <Label htmlFor={permission}>{permission}</Label>
            </div>
          ))}
        </div>
        {formState.error?.permissions && (
          <p className="text-sm text-red-500">
            {formState.error.permissions?.[0]}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : buttonLabel}
      </Button>

      {/* General Error */}
      {formState.error?.message && (
        <p className="text-sm text-red-500">{formState.error.message?.[0]}</p>
      )}
    </form>
  );
}
