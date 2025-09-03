"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createStaticPage,
  deleteStaticPage,
  getAllStaticPages,
  getStaticPageById,
  getStaticPageBySlug,
  updateStaticPage,
  getPublishedStaticPages,
  getStaticPageTitles,
} from "@/functions/staticPagesFunctions";

// ✅ Static Page Validation Schema
const staticPageSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(100),
  slug: z.string().trim().min(2, "Slug must be at least 2 characters").max(100),
  content: z
    .string()
    .trim()
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content must be less than 5000 characters"),
  isPublished: z.coerce.boolean().optional().default(true),
});

type StaticPageFormData = z.infer<typeof staticPageSchema>;

export type StaticPageFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

// ✅ Helper: Parse FormData to StaticPageFormData
function parseFormData(formData: FormData): StaticPageFormData {
  return {
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    content: String(formData.get("content") || ""),
    isPublished:
      formData.get("isPublished") === "true" ||
      formData.get("isPublished") === "on",
  };
}

// ✅ CREATE STATIC PAGE
export async function createStaticPageAction(
  prevState: StaticPageFormState,
  formData: FormData
): Promise<StaticPageFormState> {
  await connectToDatabase();

  const parsed = parseFormData(formData);
  const result = staticPageSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const page = await createStaticPage(result.data);
    return { data: page };
  } catch (error: any) {
    if (error.code === 11000) {
      return { error: { slug: ["Slug must be unique"] } };
    }
    return { error: { message: [error.message || "Failed to create static page"] } };
  }
}

// ✅ UPDATE STATIC PAGE
export async function updateStaticPageAction(
  prevState: StaticPageFormState,
  id: string,
  formData: FormData
): Promise<StaticPageFormState> {
  await connectToDatabase();

  const parsed = parseFormData(formData);
  const result = staticPageSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const updated = await updateStaticPage(id, result.data);
    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update static page"] } };
  }
}

// ✅ DELETE STATIC PAGE
export async function deleteStaticPageAction(id: string) {
  await connectToDatabase();
  try {
    const deleted = await deleteStaticPage(id);
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete static page"] } };
  }
}

// ✅ FETCH ALL STATIC PAGES
export async function fetchAllStaticPagesAction() {
  await connectToDatabase();
  try {
    const pages = await getAllStaticPages();
    return { data: pages };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch static pages"] } };
  }
}

// ✅ FETCH SINGLE STATIC PAGE BY ID
export async function fetchStaticPageByIdAction(id: string) {
  await connectToDatabase();
  try {
    const page = await getStaticPageById(id);
    if (!page) return { error: { message: ["Static page not found"] } };
    return { data: page };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch static page"] } };
  }
}

// ✅ FETCH STATIC PAGE BY SLUG
export async function fetchStaticPageBySlugAction(slug: string) {
  await connectToDatabase();
  try {
    const page = await getStaticPageBySlug(slug);
    if (!page) return { error: { message: ["Static page not found"] } };
    return { data: page };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch static page"] } };
  }
}

// ✅ FETCH ONLY PUBLISHED STATIC PAGES
export async function fetchPublishedStaticPagesAction() {
  await connectToDatabase();
  try {
    const pages = await getPublishedStaticPages();
    return { data: pages };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch published pages"] } };
  }
}

// ✅ FETCH ONLY STATIC PAGE TITLES
export async function fetchStaticPageTitlesAction() {
  await connectToDatabase();
  try {
    const titles = await getStaticPageTitles();
    return { data: titles };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch page titles"] } };
  }
}
