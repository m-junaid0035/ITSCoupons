import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Setting document
export interface ISetting extends Document {
  siteName: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Setting schema
const settingSchema = new Schema<ISetting>(
  {
    siteName: {
      type: String,
      required: [true, "Site name is required"],
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    favicon: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
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
      type: [String],
      default: [],
    },
    facebookUrl: {
      type: String,
      trim: true,
    },
    twitterUrl: {
      type: String,
      trim: true,
    },
    instagramUrl: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export model
export const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>("Setting", settingSchema);
