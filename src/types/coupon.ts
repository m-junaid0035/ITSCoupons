// types/coupon.ts

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
  createdAt?: string | null;
  updatedAt?: string | null;
}

// List response type
export type CouponListResponse = CouponData[];

// Single response type
export type CouponSingleResponse = CouponData | null;
