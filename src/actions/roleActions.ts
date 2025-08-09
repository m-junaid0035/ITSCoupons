"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  updateRole,
} from "@/functions/roleFunctions";
import { RolePermission } from "@/models/Role";

// ✅ Enum of Permissions
const permissionEnum = z.enum([
  "blog",
  "roles",
  "users",
  "settings",
  "categories",
  "stores",
  "coupons",
  "events",
  "subscribers",
]);
const permissionEnumValues = permissionEnum.options;

// ✅ Role Validation Schema
const roleSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(30),
  displayName: z.string().trim().min(3, "Display name must be at least 3 characters").max(50),
  permissions: z
    .array(permissionEnum)
    .optional()
    .refine(
      (arr) => arr?.every((val) => permissionEnumValues.includes(val)),
      {
        message: "Invalid permission(s) provided",
      }
    ),
});

type RoleFormData = z.infer<typeof roleSchema>;

export type RoleFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

// ✅ Helper: Parse FormData to RoleFormData
function parseFormData(formData: FormData): RoleFormData {
  const rawPermissions = formData.getAll("permissions") as string[];

  const validPermissions = rawPermissions.filter((p): p is RolePermission =>
    permissionEnumValues.includes(p as RolePermission)
  );

  return {
    name: String(formData.get("name") || ""),
    displayName: String(formData.get("displayName") || ""),
    permissions: validPermissions,
  };
}

// ✅ CREATE ROLE
export async function createRoleAction(
  prevState: RoleFormState,
  formData: FormData
): Promise<RoleFormState> {
  await connectToDatabase();

  const parsed = parseFormData(formData);
  const result = roleSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const role = await createRole(result.data);
    return { data: role };
  } catch (error: any) {
    if (error.code === 11000) {
      return { error: { name: ["Role name must be unique"] } };
    }
    return { error: { message: [error.message || "Failed to create role"] } };
  }
}

// ✅ UPDATE ROLE
export async function updateRoleAction(
  prevState: RoleFormState,
  id: string,
  formData: FormData
): Promise<RoleFormState> {
  await connectToDatabase();

  const parsed = parseFormData(formData);
  const result = roleSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const updated = await updateRole(id, result.data);
    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update role"] } };
  }
}

// ✅ DELETE ROLE
export async function deleteRoleAction(id: string) {
  await connectToDatabase();
  try {
    const deleted = await deleteRole(id);
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete role"] } };
  }
}

// ✅ FETCH ALL ROLES
export async function fetchAllRolesAction() {
  await connectToDatabase();
  try {
    const roles = await getAllRoles();
    return { data: roles }; // roles already serialized in roleFunctions.ts
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch roles"] } };
  }
}

// ✅ FETCH SINGLE ROLE
export async function fetchRoleByIdAction(id: string) {
  await connectToDatabase();
  try {
    const role = await getRoleById(id);
    if (!role) {
      return { error: { message: ["Role not found"] } };
    }
    return { data: role }; // already plain object
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch role"] } };
  }
}
