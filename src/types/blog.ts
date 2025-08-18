// types/blog.ts

// Input type for creating/updating a blog
export interface BlogInput {
  title: string;
  date: string; // in ISO string format
  description?: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeywords?: string;
  slug?: string;
  writer?: string; // new field
  category?: string; // new field
}

// Output type for a blog returned from API
export interface BlogData {
  _id: string;
  title: string;
  date?: string | null; // ISO string or null
  description?: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeywords?: string;
  slug?: string;
  writer?: string; // new field
  category?: string; // new field
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Output type for list of blogs
export type BlogListResponse = BlogData[];

// Output type for single blog (nullable for not found)
export type BlogSingleResponse = BlogData | null;
