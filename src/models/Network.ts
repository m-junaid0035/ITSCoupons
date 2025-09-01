import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Network document
export interface INetwork extends Document {
  networkName: string;
  storeNetworkUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define Network schema
const networkSchema = new Schema<INetwork>(
  {
    networkName: {
      type: String,
      required: [true, "Network name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Network name must be at least 2 characters long"],
      maxlength: [100, "Network name must be less than 100 characters"],
    },
    storeNetworkUrl: {
      type: String,
      required: [true, "Network URL is required"],
      trim: true,
      unique: true,
      maxlength: [200, "Network URL must be less than 200 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during development hot-reloading
export const Network: Model<INetwork> =
  mongoose.models.Network || mongoose.model<INetwork>("Network", networkSchema);
