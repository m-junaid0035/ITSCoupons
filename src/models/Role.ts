import mongoose, { Schema, Document, Model } from "mongoose";

// Define allowed permission types as a union and an array for enum reuse
export type RolePermission =
  | "blog"
  | "roles"
  | "users"
  | "settings"
  | "categories"
  | "stores"
  | "coupons"
  | "events"
  | "subscribers";

export const rolePermissionEnumValues: RolePermission[] = [
  "blog",
  "roles",
  "users",
  "settings",
  "categories",
  "stores",
  "coupons",
  "events",
  "subscribers",
];

// Interface for Role document
export interface IRole extends Document {
  name: string;
  displayName: string;
  permissions: RolePermission[];
  createdAt: Date;
  updatedAt: Date;
}

// Define Role schema
const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [30, "Name must be less than 30 characters"],
    },
    displayName: {
      type: String,
      required: [true, "Display name is required"],
      trim: true,
      minlength: [3, "Display name must be at least 3 characters"],
      maxlength: [50, "Display name must be less than 50 characters"],
    },
    permissions: {
      type: [String],
      enum: rolePermissionEnumValues,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during development hot-reloading
export const Role: Model<IRole> =
  mongoose.models.Role || mongoose.model<IRole>("Role", roleSchema);
