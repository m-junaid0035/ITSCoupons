import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for Store document
export interface IStore extends Document {
  name: string;                     // Store name
  image: string;                    // Logo path (local, e.g., /stores/s1.png)
  networkName: string;              // Network name (CJ, Rakuten, Awin, N/A)
  storeNetworkUrl?: string;         // Required if networkName !== "N/A"
  directUrl?: string;               // New direct URL field
  categories: Types.ObjectId[];     // Category references
  totalCouponUsedTimes: number;     // Counter
  description: string;              // Store description
  metaTitle: string;                // SEO title
  metaDescription: string;          // SEO description
  metaKeywords: string[];           // SEO keywords
  focusKeywords: string[];          // SEO focus keywords
  slug: string;                     // Store slug (unique)
  isPopular: boolean;               // New field
  isActive: boolean;                // New field
  createdAt: Date;                  // Auto timestamp
  updatedAt: Date;                  // Auto timestamp
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

    image: {
      type: String,
      required: [true, "Store logo (image) is required"],
    },

    networkName: {
      type: String,
      enum: ["CJ", "Rakuten", "Awin", "Impact", "ShareASale", "N/A"],
      default: "N/A",
      required: true,
    },

    storeNetworkUrl: {
      type: String,
      trim: true,
      required: function (this: IStore) {
        return this.networkName !== "N/A";
      },
    },

    // 🔹 New direct URL field
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
    timestamps: true, // createdAt & updatedAt
  }
);

// Prevent model overwrite in dev
export const Store: Model<IStore> =
  mongoose.models.Store || mongoose.model<IStore>("Store", storeSchema);
