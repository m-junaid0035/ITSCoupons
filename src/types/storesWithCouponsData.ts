// types/store.ts
import type { CouponData } from "./coupon";

export type StoreInput = {
  name: string;
  network: string;
  categories: string[]; // category IDs
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
};

export interface StoreData {
  _id: string;
  name: string;
  network: string;
  categories: string[]; // category IDs as strings
  totalCouponUsedTimes: number;
  image: string;
  storeNetworkUrl?: string; // ✅ no size limit
  directUrl?: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string[];
  focusKeywords?: string[];
  slug: string;
  content: string;
  isPopular: boolean;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Extended store type including an array of coupons belonging to the store
export interface StoreWithCouponsData extends StoreData {
  coupons?: CouponData[] | null;
}

// List response types
export type StoreListResponse = StoreData[];
export type StoreWithCouponsListResponse = StoreWithCouponsData[];

// Single response types
export type StoreSingleResponse = StoreData | null;
export type StoreWithCouponsSingleResponse = StoreWithCouponsData | null;
