import { Role } from "@/models/Role";
import { IRole, RolePermission } from "@/models/Role";

/**
 * Helper to sanitize and format incoming role data.
 */
const sanitizeRoleData = (data: {
  name: string;
  displayName: string;
  permissions?: RolePermission[];
}) => ({
  name: data.name.trim(),
  displayName: data.displayName.trim(),
  permissions: data.permissions ?? [],
});

/**
 * Convert a Mongoose document to a plain object safe for Client Components.
 */
const serializeRole = (role: any) => ({
  _id: role._id.toString(),
  name: role.name,
  displayName: role.displayName,
  permissions: role.permissions,
  createdAt: role.createdAt?.toISOString?.(),
  updatedAt: role.updatedAt?.toISOString?.(),
});

/**
 * Create a new role.
 * @param data Role input
 * @returns Created role object
 */
export const createRole = async (data: {
  name: string;
  displayName: string;
  permissions?: RolePermission[];
}): Promise<ReturnType<typeof serializeRole>> => {
  const roleData = sanitizeRoleData(data);
  const role = await new Role(roleData).save();
  return serializeRole(role);
};

/**
 * Get all roles, sorted by newest first.
 * @returns Array of roles (plain objects)
 */
export const getAllRoles = async (): Promise<
  ReturnType<typeof serializeRole>[]
> => {
  const roles = await Role.find().sort({ createdAt: -1 }).lean();
  return roles.map(serializeRole);
};

/**
 * Get a role by its ID.
 * @param id Role ID
 * @returns Role (plain object) or null
 */
export const getRoleById = async (
  id: string
): Promise<ReturnType<typeof serializeRole> | null> => {
  const role = await Role.findById(id).lean();
  return role ? serializeRole(role) : null;
};

/**
 * Update a role by ID.
 * @param id Role ID
 * @param data New role data
 * @returns Updated role (plain object) or null
 */
export const updateRole = async (
  id: string,
  data: {
    name: string;
    displayName: string;
    permissions?: RolePermission[];
  }
): Promise<ReturnType<typeof serializeRole> | null> => {
  const updatedData = sanitizeRoleData(data);
  const role = await Role.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();
  return role ? serializeRole(role) : null;
};

/**
 * Delete a role by ID.
 * @param id Role ID
 * @returns Deleted role (plain object) or null
 */
export const deleteRole = async (
  id: string
): Promise<ReturnType<typeof serializeRole> | null> => {
  const role = await Role.findByIdAndDelete(id).lean();
  return role ? serializeRole(role) : null;
};
