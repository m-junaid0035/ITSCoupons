"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { updateUserAction, fetchUserByIdAction } from "@/actions/userActions";
import { fetchAllRolesAction } from "@/actions/roleActions";

interface FormState {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

interface Role {
  _id: string;
  name: string;
}

export default function EditUserForm() {
  const params = useParams();
  const userId = params.id as string;

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      // Ensure file is present
      const file = formData.get("image") as File;

      if (file && file.size > 0) {
        formData.set("image", file);
      } else {
        formData.delete("image"); // Don't send empty file
      }

      return await updateUserAction(prevState, userId, formData);
    },
    initialState
  );

  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [userRes, roleRes] = await Promise.all([
        fetchUserByIdAction(userId),
        fetchAllRolesAction(),
      ]);

      if (userRes?.data) {
        setUser(userRes.data);
        setIsVerified(userRes.data.isVerified);
        setIsActive(userRes.data.isActive);
      }

      if (roleRes?.data) setRoles(roleRes.data);
      setLoading(false);
    }

    loadData();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p className="text-red-500">User not found</p>;

  const errorFor = (field: string) =>
    formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  return (
    <form
      action={(formData) => {
        formData.set("isVerified", JSON.stringify(isVerified));
        formData.set("isActive", JSON.stringify(isActive));
        return dispatch(formData);
      }}
      encType="multipart/form-data"
      className="space-y-6 max-w-2xl"
    >
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={user.name} required />
        {errorFor("name") && <p className="text-sm text-red-500">{errorFor("name")}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={user.email} required />
        {errorFor("email") && <p className="text-sm text-red-500">{errorFor("email")}</p>}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          name="role"
          defaultValue={user.role}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role._id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
        {errorFor("role") && <p className="text-sm text-red-500">{errorFor("role")}</p>}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image">Profile Image</Label>
        <Input id="image" name="image" type="file" accept="image/*" />
        {errorFor("image") && <p className="text-sm text-red-500">{errorFor("image")}</p>}
      </div>

      {/* Switches */}
      <div className="flex items-center space-x-4">
        <div>
          <Label htmlFor="isActive">Active</Label>
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update User"}
      </Button>

      {/* General error */}
      {"message" in (formState.error || {}) && (
        <p className="text-sm text-red-500">
          {(formState.error as { message?: string[] }).message?.[0]}
        </p>
      )}
    </form>
  );
}
