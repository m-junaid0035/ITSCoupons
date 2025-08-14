import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for Subscriber document
export interface ISubscriber extends Document {
  _id: Types.ObjectId | string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define Subscriber schema
const subscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during development hot-reloading
export const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>("Subscriber", subscriberSchema);
