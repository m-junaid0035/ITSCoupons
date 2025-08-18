// types/category.ts

// Input type for creating/updating a category
export interface CategoryInput {
  name: string;
  slug: string;
  description?: string;   // ✅ new optional field
  isPopular?: boolean;    // optional boolean
  isTrending?: boolean;   // optional boolean
}

// Output type for a category returned from API
export interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  description?: string | null;  // ✅ new optional field
  isPopular: boolean;
  isTrending: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// List response type
export type CategoryListResponse = CategoryData[];

// Single response type (nullable for not found)
export type CategorySingleResponse = CategoryData | null;
