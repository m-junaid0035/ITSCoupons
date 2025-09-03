import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for StaticPage document
export interface IStaticPage extends Document {
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define StaticPage schema
const staticPageSchema = new Schema<IStaticPage>(
  {
    title: {
      type: String,
      required: [true, "Page title is required"],
      trim: true,
      unique: true,
      minlength: [2, "Title must be at least 2 characters long"],
      maxlength: [100, "Title must be less than 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [5000, "Content must be less than 5000 characters"],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during development hot-reloading
export const StaticPage: Model<IStaticPage> =
  mongoose.models.StaticPage ||
  mongoose.model<IStaticPage>("StaticPage", staticPageSchema);
