import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for Store document
export interface IStore extends Document {
  name: string;
  storeNetworkUrl: string;
  categories: Types.ObjectId[];
  totalCouponUsedTimes: number;
  image: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  focusKeywords: string[];
  slug: string;
  isPopular: boolean;    // ✅ NEW FIELD
  isActive: boolean;     // ✅ NEW FIELD
  createdAt: Date;
  updatedAt: Date;
}

// Define Store schema
const storeSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [100, "Name must be less than 100 characters"],
    },
    storeNetworkUrl: {
      type: String,
      required: [true, "Store network URL is required"],
      trim: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    totalCouponUsedTimes: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    metaTitle: {
      type: String,
      required: true,
      trim: true,
    },
    metaDescription: {
      type: String,
      required: true,
      trim: true,
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
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in dev
export const Store: Model<IStore> =
  mongoose.models.Store || mongoose.model<IStore>("Store", storeSchema);
