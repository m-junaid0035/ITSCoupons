// types/role.ts

export type RolePermission = string; // Adjust if you have a more specific union type

// Input type for creating/updating a role
export interface RoleInput {
  name: string;
  displayName: string;
  permissions?: RolePermission[];
}

// Output type for a role returned from API
export interface RoleData {
  _id: string;
  name: string;
  displayName: string;
  permissions: RolePermission[];
  createdAt?: string | null;
  updatedAt?: string | null;
}

// List response type
export type RoleListResponse = RoleData[];

// Single response type
export type RoleSingleResponse = RoleData | null;
