// types/category.ts

// Input type for creating/updating a category
export interface CategoryInput {
  name: string;
  slug: string;
}

// Output type for a category returned from API
export interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// List response type
export type CategoryListResponse = CategoryData[];

// Single response type (nullable for not found)
export type CategorySingleResponse = CategoryData | null;
