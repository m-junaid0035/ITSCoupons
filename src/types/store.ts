import { Types } from "mongoose";

export interface StoreInput {
  name: string;
  storeNetworkUrl?: string; // optional, maps to `network` in schema
  categories: string[]; // array of category IDs
  totalCouponUsedTimes?: number;
  image: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string[];
  focusKeywords?: string[];
  slug: string;
  isPopular?: boolean;
  isActive?: boolean;
}

export interface StoreData {
  _id: string;
  name: string;
  storeNetworkUrl?: string; // optional, matches network ref
  categories: string[]; // category IDs
  totalCouponUsedTimes: number;
  image: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  focusKeywords: string[];
  slug: string;
  isPopular: boolean;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Response types
export type StoreListResponse = StoreData[];
export type StoreSingleResponse = StoreData | null;
