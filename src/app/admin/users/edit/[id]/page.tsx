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
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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
      const file = formData.get("image") as File;
      if (!file || file.size === 0) {
        formData.delete("image");
      }
      formData.set("isActive", JSON.stringify(isActive));
      return await updateUserAction(prevState, userId, formData);
    },
    initialState
  );

  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(true);
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
        setIsActive(userRes.data.isActive ?? true);
        setSelectedRole(userRes.data.role?._id || userRes.data.role || "");
      }

      if (rolesRes?.data) setRoles(rolesRes.data);
      setLoading(false);
    }
    loadData();
  }, [userId]);

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

  const errorFor = (field: string) =>
    formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  if (loading) return <LoadingSkeleton />;
  if (!user)
    return (
      <p className="text-center py-8 text-red-500">User not found</p>
    );

  return (
    <>
      <Card className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">Edit User</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/users")}>Back to Users</Button>
        </CardHeader>

        <CardContent>
          <form action={dispatch} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={user.name}
                placeholder="Enter user name"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("name") && (
                <p className="text-sm text-red-500">{errorFor("name")}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={user.email}
                placeholder="user@example.com"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("email") && (
                <p className="text-sm text-red-500">{errorFor("email")}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
              <select
                id="role"
                name="roleId"
                required
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700"
              >
                <option value="">Select a role <span className="text-red-500">*</span></option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>

              {errorFor("role") && (
                <p className="text-sm text-red-500">{errorFor("role")}</p>
              )}
            </div>

            {/* Profile Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("image") && (
                <p className="text-sm text-red-500">{errorFor("image")}</p>
              )}
            </div>

            {/* Active Switch */}
            <div className="flex items-center space-x-6">
              <div>
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">
                {(formState.error as { message?: string[] }).message?.[0]}
              </p>
            )}

            <CardFooter className="flex justify-end border-none px-0">
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? "Updating..." : "Update User"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

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
