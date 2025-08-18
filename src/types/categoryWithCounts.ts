// Input type for creating/updating a category
export interface CategoryInput {
  name: string;
  slug: string;
  description?: string; // ✅ added
  isPopular?: boolean;
  isTrending?: boolean;
}

// Output type for a category returned from API
export interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  description?: string | null; // ✅ added with null support
  isPopular?: boolean;
  isTrending?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Extended category with counts of stores and coupons
export interface CategoryWithCounts extends CategoryData {
  totalStores: number;
  totalCoupons: number;
}

// List response type for normal categories
export type CategoryListResponse = CategoryData[];

// List response type for categories with counts
export type CategoryWithCountsListResponse = CategoryWithCounts[];

// Single response type (nullable for not found)
export type CategorySingleResponse = CategoryData | null;
