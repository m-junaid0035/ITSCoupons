"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react"; // adjust if needed
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { createUserAction } from "@/actions/userActions";
import { fetchAllRolesAction } from "@/actions/roleActions";
import { toast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const router = useRouter();

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      // Validate and handle image file
      const file = formData.get("image") as File;
      if (file && file.size > 0) {
        formData.set("image", file);
      } else {
        formData.delete("image");
      }
      return await createUserAction(prevState, formData);
    },
    initialState
  );

  const [roles, setRoles] = useState<Role[]>([]);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

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

  // On success, open dialog. On error with message, show toast.
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

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Create User</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            id="user-form"
            action={dispatch}
            className="space-y-6 max-w-2xl mx-auto"
            encType="multipart/form-data"
          >
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter user name"
              />
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
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="user@example.com"
              />
              {errorFor("email") && (
                <p className="text-sm text-red-500">{errorFor("email")}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter a secure password"
              />
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
                className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700"
              >
                <option value="">Select a role</option>
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

            {/* Image File Upload */}
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

            {/* Status (isActive) */}
            <div className="space-y-2">
              <Label htmlFor="isActive">Status</Label>
              <select
                id="isActive"
                name="isActive"
                className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              {errorFor("isActive") && (
                <p className="text-sm text-red-500">{errorFor("isActive")}</p>
              )}
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">
                {(formState.error as any).message?.[0]}
              </p>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-end border-none">
          <Button type="submit" disabled={isPending} form="user-form">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : "Create User"}
          </Button>
        </CardFooter>
      </Card>

      {/* Success Confirmation Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>User created successfully!</p>
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
