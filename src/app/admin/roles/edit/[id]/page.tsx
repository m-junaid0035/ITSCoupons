"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter, useParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import LoadingSkeleton from "./loading";
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

import { toast } from "@/hooks/use-toast";

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
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;

  const [role, setRole] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateRoleAction(prevState, roleId, formData),
    initialState
  );

  // Load role data
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

  // Show success dialog or toast errors on formState changes
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
  if (!role) return <p className="text-red-500">Role not found</p>;

  const errorFor = (field: string) =>
    formState.error &&
    typeof formState.error === "object" &&
    field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  return (
    <>
      <Card className="max-w-xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Edit Role</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/roles")}>
            Back to Roles
          </Button>
        </CardHeader>

        <CardContent>
          <form action={dispatch} className="space-y-6 max-w-xl">
            {/* Role Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={role.name}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter role name"
              />
              {errorFor("name") && (
                <p className="text-sm text-red-500">{errorFor("name")}</p>
              )}
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={role.displayName}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter display name"
              />
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
                    <Checkbox
                      id={permission}
                      name="permissions"
                      value={permission}
                      defaultChecked={role.permissions.includes(permission)}
                      className="border-none"
                    />
                    <Label htmlFor={permission} className="capitalize">
                      {permission}
                    </Label>
                  </div>
                ))}
              </div>
              {errorFor("permissions") && (
                <p className="text-sm text-red-500">{errorFor("permissions")}</p>
              )}
            </div>

            {/* General error message */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">
                {(formState.error as { message?: string[] }).message?.[0]}
              </p>
            )}

            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Saving..." : "Update Role"}
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
          <p>Role updated successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/roles");
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
