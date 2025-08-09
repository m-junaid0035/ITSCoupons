"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { createUserAction } from "@/actions/userActions";
import { fetchAllRolesAction } from "@/actions/roleActions";

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

interface Role {
  _id: string;
  name: string;
}

export default function UserForm() {
  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      // Here we ensure file is present and valid
      const file = formData.get("image") as File;

      if (file && file.size > 0) {
        // Optional: check file type or size
        formData.set("image", file);
      } else {
        formData.delete("image"); // Remove if not a valid file
      }

      return await createUserAction(prevState, formData);
    },
    initialState
  );

  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    async function loadRoles() {
      const result = await fetchAllRolesAction();
      if (result.data && Array.isArray(result.data)) {
        setRoles(result.data);
      }
    }
    loadRoles();
  }, []);

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  return (
    <form action={dispatch} className="space-y-6 max-w-2xl" encType="multipart/form-data">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
        {errorFor("name") && <p className="text-sm text-red-500">{errorFor("name")}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
        {errorFor("email") && <p className="text-sm text-red-500">{errorFor("email")}</p>}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
        {errorFor("password") && (
          <p className="text-sm text-red-500">{errorFor("password")}</p>
        )}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          name="role"
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          ))}
        </select>
        {errorFor("role") && <p className="text-sm text-red-500">{errorFor("role")}</p>}
      </div>

      {/* Image File Upload */}
      <div className="space-y-2">
        <Label htmlFor="image">Profile Image</Label>
        <Input id="image" name="image" type="file" accept="image/*" />
        {errorFor("image") && <p className="text-sm text-red-500">{errorFor("image")}</p>}
      </div>

      {/* isActive */}
      <div className="space-y-2">
        <Label htmlFor="isActive">Status</Label>
        <select
          id="isActive"
          name="isActive"
          className="w-full border rounded px-3 py-2"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        {errorFor("isActive") && (
          <p className="text-sm text-red-500">{errorFor("isActive")}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Create User"}
      </Button>

      {/* General Error */}
      {"message" in (formState.error ?? {}) && (
        <p className="text-sm text-red-500">
          {(formState.error as any).message?.[0]}
        </p>
      )}
    </form>
  );
}
