"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import LoadingSkeleton from "./loading";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const router = useRouter();

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      // Handle image file presence
      const file = formData.get("image") as File;
      if (file && file.size > 0) {
        formData.set("image", file);
      } else {
        formData.delete("image");
      }

      // Append toggle values as stringified booleans
      formData.set("isActive", JSON.stringify(isActive));
      formData.set("isVerified", JSON.stringify(isVerified));

      return await updateUserAction(prevState, userId, formData);
    },
    initialState
  );

  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const [isVerified, setIsVerified] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [userRes, rolesRes] = await Promise.all([
        fetchUserByIdAction(userId),
        fetchAllRolesAction(),
      ]);

      if (userRes?.data) {
        setUser(userRes.data);
        setIsVerified(userRes.data.isVerified ?? false);
        setIsActive(userRes.data.isActive ?? true);
      }

      if (rolesRes?.data) setRoles(rolesRes.data);
      setLoading(false);
    }

    loadData();
  }, [userId]);

  // Show success dialog or toast on form state changes
  useEffect(() => {
    if (formState.data && !formState.error) {
      setSuccessDialogOpen(true);
    }

    if (formState.error && "message" in formState.error) {
      toast({
        title: "Error",
        description:
          (formState.error as any).message?.[0] || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [formState]);

  if (loading) return <LoadingSkeleton/>;
  if (!user) return <p className="text-center py-8 text-red-500">User not found</p>;

  const errorFor = (field: string) =>
    formState.error &&
    typeof formState.error === "object" &&
    field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  return (
    <>
      <form
        action={dispatch}
        encType="multipart/form-data"
        className="space-y-6 max-w-2xl mx-auto"
      >
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={user.name} required />
          {errorFor("name") && (
            <p className="text-sm text-red-500">{errorFor("name")}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email}
            required
          />
          {errorFor("email") && (
            <p className="text-sm text-red-500">{errorFor("email")}</p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            name="role"
            defaultValue={user.role}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role._id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
          {errorFor("role") && (
            <p className="text-sm text-red-500">{errorFor("role")}</p>
          )}
        </div>

        {/* Profile Image Upload */}
        <div className="space-y-2">
          <Label htmlFor="image">Profile Image</Label>
          <Input id="image" name="image" type="file" accept="image/*" />
          {errorFor("image") && (
            <p className="text-sm text-red-500">{errorFor("image")}</p>
          )}
        </div>

        {/* Switches for isActive and isVerified */}
        <div className="flex items-center space-x-6">
          <div>
            <Label htmlFor="isActive">Active</Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div>
            <Label htmlFor="isVerified">Verified</Label>
            <Switch
              id="isVerified"
              checked={isVerified}
              onCheckedChange={setIsVerified}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update User"}
        </Button>

        {/* General form error */}
        {"message" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as { message?: string[] }).message?.[0]}
          </p>
        )}
      </form>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>User updated successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/users");
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
