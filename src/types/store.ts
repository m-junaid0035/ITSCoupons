// types/store.ts

export interface StoreInput {
  name: string;
  storeNetworkUrl: string;
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
}

export interface StoreData {
  _id: string;
  name: string;
  storeNetworkUrl: string;
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

export type StoreListResponse = StoreData[];

export type StoreSingleResponse = StoreData | null;
