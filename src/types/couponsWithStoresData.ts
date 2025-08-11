// types/coupon.ts
import type { StoreData } from "./store";

export type CouponType = "deal" | "coupon";
export type CouponStatus = "active" | "expired";

// Input type for creating/updating a coupon
export interface CouponInput {
  title: string;
  description?: string;
  couponType: CouponType;
  status: CouponStatus;
  couponCode: string;
  expirationDate: string; // ISO string
  couponUrl?: string;
  storeName?: string;
  storeId: string;
  isTopOne?: boolean;
  discount?: string;
  uses?: number;
  verified?: boolean;
}

// Output type for a coupon returned from API
export interface CouponData {
  _id: string;
  title: string;
  description?: string;
  couponType: CouponType;
  status: CouponStatus;
  couponCode: string;
  expirationDate?: string | null;
  couponUrl?: string;
  storeName?: string;
  storeId?: string;
  isTopOne: boolean;
  discount?: string;
  uses: number;
  verified: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Extended type for coupon with populated store data
export interface CouponWithStoreData extends CouponData {
  store?: StoreData | null;
}

// List response types
export type CouponListResponse = CouponData[];
export type CouponWithStoreListResponse = CouponWithStoreData[];

// Single response types
export type CouponSingleResponse = CouponData | null;
export type CouponWithStoreSingleResponse = CouponWithStoreData | null;
