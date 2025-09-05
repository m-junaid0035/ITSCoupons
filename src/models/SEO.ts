// models/seo.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for SEO document
export interface ISEO extends Document {
  metaTitle: string;                // Page meta title
  metaDescription: string;          // Page meta description
  metaKeywords: string[];           // Optional meta keywords
  focusKeywords: string[];          // Optional focus keywords
  slug: string;                     // URL-friendly slug (unique)
  templateType: "settings" | "blogs" | "events" | "stores"; // Template type
  createdAt: Date;
  updatedAt: Date;
}

// Define SEO schema
const seoSchema = new Schema<ISEO>(
  {
    metaTitle: {
      type: String,
      required: [true, "Meta title is required"],
      trim: true,
      minlength: [3, "Meta title must be at least 3 characters"],
      maxlength: [150, "Meta title must be less than 150 characters"],
    },

    metaDescription: {
      type: String,
      required: [true, "Meta description is required"],
      trim: true,
      minlength: [10, "Meta description must be at least 10 characters"],
      maxlength: [300, "Meta description must be less than 300 characters"],
    },

    metaKeywords: {
      type: [String],
      default: [],
    },

    focusKeywords: {
      type: [String],
      default: [],
    },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      unique: true,
    },

    templateType: {
      type: String,
      enum: ["settings", "blogs", "events", "stores"],
      required: [true, "Template type is required"],
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// Prevent model overwrite in dev
export const SEO: Model<ISEO> =
  mongoose.models.SEO || mongoose.model<ISEO>("SEO", seoSchema);
