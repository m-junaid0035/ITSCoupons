import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for HomeDescription document
export interface IHomeDescription extends Document {
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define schema
const homeDescriptionSchema = new Schema<IHomeDescription>(
  {
    description: {
      type: String,
      default: "", // empty by default
      trim: true,
      maxlength: [5000, "Description must be less than 5000 characters"], // 5000 chars limit
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during development hot-reloading
export const HomeDescription: Model<IHomeDescription> =
  mongoose.models.HomeDescription ||
  mongoose.model<IHomeDescription>("HomeDescription", homeDescriptionSchema);
