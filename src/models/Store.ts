import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { INetwork } from "./Network"; // adjust the path if needed

export interface IStore extends Document {
  name: string;
  image: string;
  network?: Types.ObjectId | INetwork; // optional reference
  directUrl?: string;
  categories: Types.ObjectId[];
  totalCouponUsedTimes: number;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  focusKeywords: string[];
  slug: string;
  isPopular: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [100, "Name must be less than 100 characters"],
    },

    image: {
      type: String,
      required: [true, "Store logo (image) is required"],
    },

    network: {
      type: Schema.Types.ObjectId,
      ref: "Network",
      required: false, // optional
    },

    directUrl: {
      type: String,
      trim: true,
      default: "",
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

export const Store: Model<IStore> =
  mongoose.models.Store || mongoose.model<IStore>("Store", storeSchema);
