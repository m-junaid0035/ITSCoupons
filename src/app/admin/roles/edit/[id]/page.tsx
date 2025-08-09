"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter, useParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import {
  fetchRoleByIdAction,
  updateRoleAction,
} from "@/actions/roleActions";

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
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

export default function EditRoleForm() {
  const params = useParams(); // 👈 grab the id from URL
  const roleId = params.id as string;

  const router = useRouter();
  const [role, setRole] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateRoleAction(prevState, roleId, formData),
    initialState
  );

  useEffect(() => {
    async function fetchRole() {
      const result = await fetchRoleByIdAction(roleId);
      if (result?.data) {
        setRole(result.data);
      }
      setLoading(false);
    }
    fetchRole();
  }, [roleId]);

  if (loading) return <p>Loading...</p>;
  if (!role) return <p className="text-red-500">Role not found</p>;

  return (
    <form action={dispatch} className="space-y-6 max-w-xl">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Role Name</Label>
        <Input id="name" name="name" defaultValue={role.name} required />
        {"name" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).name?.[0]}
          </p>
        )}
      </div>

      {/* Display Name Field */}
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          name="displayName"
          defaultValue={role.displayName}
          required
        />
        {"displayName" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).displayName?.[0]}
          </p>
        )}
      </div>

      {/* Permissions */}
      <div className="space-y-2">
        <Label>Permissions</Label>
        <div className="grid grid-cols-2 gap-2">
          {permissionEnumValues.map((permission: string) => (
            <div key={permission} className="flex items-center space-x-2">
              <Checkbox
                id={permission}
                name="permissions"
                value={permission}
                defaultChecked={role.permissions.includes(permission)}
              />
              <Label htmlFor={permission}>{permission}</Label>
            </div>
          ))}
        </div>
        {"permissions" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).permissions?.[0]}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Update Role"}
      </Button>

      {/* General Error */}
      {"message" in (formState.error || {}) && (
        <p className="text-sm text-red-500">
          {(formState.error as { message?: string[] }).message?.[0]}
        </p>
      )}
    </form>
  );
}
