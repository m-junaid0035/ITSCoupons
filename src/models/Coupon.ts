import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for Coupon document
export interface ICoupon extends Document {
  title: string;
  description?: string;
  couponType: "deal" | "coupon";
  status: "active" | "expired";
  couponCode: string;
  expirationDate: Date;
  couponUrl?: string;
  storeName?: string;
  storeId: Types.ObjectId;
  isTopOne?: boolean; // ✅ NEW FIELD
  createdAt: Date;
  updatedAt: Date;
}

// Define the Coupon schema
const couponSchema = new Schema<ICoupon>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    couponType: {
      type: String,
      enum: ["deal", "coupon"],
      required: [true, "Coupon type is required"],
    },
    status: {
      type: String,
      enum: ["active", "expired"],
      required: [true, "Status is required"],
    },
    couponCode: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
    },
    expirationDate: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
    couponUrl: {
      type: String,
      trim: true,
    },
    storeName: {
      type: String,
      trim: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store reference is required"],
    },
    isTopOne: {
      type: Boolean,
      default: false, // ✅ Optional default value
    },
  },
  {
    timestamps: true,
  }
);

// Export model
export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", couponSchema);
