import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Event document
export interface IEvent extends Document {
  title: string;
  date: Date;
  description?: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  focusKeywords?: string[];
  slug?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Event schema
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // store image path or URL
      trim: true,
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    metaKeywords: {
      type: [String], // store as array of strings
      default: [],
    },
    focusKeywords: {
      type: [String], // store as array of strings
      default: [],
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // allows multiple docs with undefined slug
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
