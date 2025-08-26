import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Category document
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  isPopular: boolean;
  isTrending: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define Category schema
const categorySchema = new Schema<ICategory>(
  {a
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name must be less than 50 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
      maxlength: [300, "Description must be less than 300 characters"],
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during development hot-reloading
export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);
