"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
} from "@/functions/blogFunctions";
import { saveBlogImage } from "@/lib/uploadBlogImage";

/* ---------------------------- ✅ Blog Validation ---------------------------- */
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
  writer: z.string().trim().min(2).max(100).optional(),
  category: z.string().trim().min(2).max(100).optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

export type BlogFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

/* ---------------------------- 🛠️ Helper Parser ---------------------------- */
async function parseBlogFormData(
  formData: FormData,
  requireImage = false
): Promise<BlogFormData & { imageFile?: File }> {
  const uploadedFile = formData.get("imageFile") as File | null;

  let imagePath = String(formData.get("image") || "");
  if (uploadedFile && uploadedFile.size > 0) {
    imagePath = await saveBlogImage(uploadedFile);
  } else if (requireImage && !imagePath) {
    throw new Error("Image file is required");
  }

  return {
    title: String(formData.get("title") || ""),
    date: String(formData.get("date") || ""),
    description: String(formData.get("description") || ""),
    image: imagePath,
    metaTitle: String(formData.get("metaTitle") || ""),
    metaDescription: String(formData.get("metaDescription") || ""),
    metaKeywords: String(formData.get("metaKeywords") || ""),
    focusKeywords: String(formData.get("focusKeywords") || ""),
    slug: String(formData.get("slug") || ""),
    writer: String(formData.get("writer") || ""),
    category: String(formData.get("category") || ""),
    imageFile: uploadedFile || undefined,
  };
}

/* ---------------------------- ✅ CREATE ---------------------------- */
export async function createBlogAction(
  prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  await connectToDatabase();

  try {
    const parsed = await parseBlogFormData(formData, true); // ✅ require image
    const result = blogSchema.safeParse(parsed);

    if (!result.success) return { error: result.error.flatten().fieldErrors };

    const blog = await createBlog({
      ...result.data,
      imageFile: parsed.imageFile!, // ✅ required
    });

    return { data: blog };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to create blog"] } };
  }
}

/* ---------------------------- ✅ UPDATE ---------------------------- */
export async function updateBlogAction(
  prevState: BlogFormState,
  id: string,
  formData: FormData
): Promise<BlogFormState> {
  await connectToDatabase();

  try {
    const parsed = await parseBlogFormData(formData); // ✅ image optional
    const result = blogSchema.safeParse(parsed);

    if (!result.success) return { error: result.error.flatten().fieldErrors };

    const updated = await updateBlog(id, {
      ...result.data,
      imageFile: parsed.imageFile,
    });

    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update blog"] } };
  }
}

/* ---------------------------- ✅ DELETE ---------------------------- */
export async function deleteBlogAction(id: string) {
  await connectToDatabase();
  try {
    const deleted = await deleteBlog(id);
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete blog"] } };
  }
}

/* ---------------------------- ✅ FETCH ALL ---------------------------- */
export async function fetchAllBlogsAction() {
  await connectToDatabase();
  try {
    const blogs = await getAllBlogs();
    return { data: blogs };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch blogs"] } };
  }
}

/* ---------------------------- ✅ FETCH BY ID ---------------------------- */
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

/* ---------------------------- ✅ FETCH BY SLUG ---------------------------- */
export async function fetchBlogBySlugAction(slug: string) {
  await connectToDatabase();
  try {
    if (!slug) {
      return { error: { message: ["Slug is required"] } };
    }

    const blog = await getBlogBySlug(slug);
    if (!blog) {
      return { error: { message: ["Blog not found"] } };
    }

    return { data: blog };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch blog by slug"] } };
  }
}
