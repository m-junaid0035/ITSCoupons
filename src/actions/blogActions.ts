"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "@/functions/blogFunctions";

// ✅ Blog Validation Schema
const blogSchema = z.object({
  title: z.string().trim().min(3).max(150),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  description: z.string().optional(),
  image: z.string().optional(),
  metaTitle: z.string().max(150).optional(),
  metaDescription: z.string().max(255).optional(),
  metaKeywords: z.string().optional(),
  focusKeywords: z.string().optional(),
  slug: z.string().min(3).max(150).optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

export type BlogFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

// ✅ Helper: Parse FormData to BlogFormData
function parseBlogFormData(formData: FormData): BlogFormData {
  return {
    title: String(formData.get("title") || ""),
    date: String(formData.get("date") || ""),
    description: String(formData.get("description") || ""),
    image: String(formData.get("image") || ""),
    metaTitle: String(formData.get("metaTitle") || ""),
    metaDescription: String(formData.get("metaDescription") || ""),
    metaKeywords: String(formData.get("metaKeywords") || ""),
    focusKeywords: String(formData.get("focusKeywords") || ""),
    slug: String(formData.get("slug") || ""),
  };
}

// ✅ CREATE BLOG
export async function createBlogAction(
  prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  await connectToDatabase();

  const parsed = parseBlogFormData(formData);
  const result = blogSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const blog = await createBlog(result.data);
    return { data: blog };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to create blog"] } };
  }
}

// ✅ UPDATE BLOG
export async function updateBlogAction(
  prevState: BlogFormState,
  id: string,
  formData: FormData
): Promise<BlogFormState> {
  await connectToDatabase();

  const parsed = parseBlogFormData(formData);
  const result = blogSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const updated = await updateBlog(id, result.data);
    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update blog"] } };
  }
}

// ✅ DELETE BLOG
export async function deleteBlogAction(id: string) {
  await connectToDatabase();
  try {
    const deleted = await deleteBlog(id);
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete blog"] } };
  }
}

// ✅ FETCH ALL BLOGS
export async function fetchAllBlogsAction() {
  await connectToDatabase();
  try {
    const blogs = await getAllBlogs();
    return { data: blogs };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch blogs"] } };
  }
}

// ✅ FETCH SINGLE BLOG
export async function fetchBlogByIdAction(id: string) {
  await connectToDatabase();
  try {
    const blog = await getBlogById(id);
    if (!blog) {
      return { error: { message: ["Blog not found"] } };
    }
    return { data: blog };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch blog"] } };
  }
}
