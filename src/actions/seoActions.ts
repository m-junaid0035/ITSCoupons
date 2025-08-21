"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createSEO,
  getAllSEO,
  getSEOById,
  updateSEO,
  deleteSEO,
  getSEOBySlug,
  getLatestSEO,
} from "@/functions/seoFunctions";

/* ---------------------------- 📝 Validation Schema ---------------------------- */
const seoSchema = z.object({
  metaTitle: z.string().trim().min(3, "Meta title must be at least 3 characters"),
  metaDescription: z.string().trim().min(3, "Meta description must be at least 3 characters"),
  metaKeywords: z.array(z.string()).optional(),
  focusKeywords: z.array(z.string()).optional(),
  slug: z.string().trim().min(3, "Slug must be at least 3 characters"),
});

export type SEOFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

/* ---------------------------- 🔹 CREATE ---------------------------- */
export async function createSEOAction(prevState: SEOFormState, formData: FormData): Promise<SEOFormState> {
  await connectToDatabase();

  try {
    const parseCSV = (value: FormDataEntryValue | null) =>
      (value?.toString() || "")
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

    const rawData = {
      metaTitle: String(formData.get("metaTitle") || ""),
      metaDescription: String(formData.get("metaDescription") || ""),
      metaKeywords: parseCSV(formData.get("metaKeywords")),
      focusKeywords: parseCSV(formData.get("focusKeywords")),
      slug: String(formData.get("slug") || ""),
    };

    const result = seoSchema.safeParse(rawData);
    if (!result.success) return { error: result.error.flatten().fieldErrors };

    const seo = await createSEO(result.data);
    return { data: seo };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to create SEO entry"] } };
  }
}

/* ---------------------------- 🔹 UPDATE ---------------------------- */
export async function updateSEOAction(prevState: SEOFormState, id: string, formData: FormData): Promise<SEOFormState> {
  await connectToDatabase();

  try {
    const parseCSV = (value: FormDataEntryValue | null) =>
      (value?.toString() || "")
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

    const rawData = {
      metaTitle: String(formData.get("metaTitle") || ""),
      metaDescription: String(formData.get("metaDescription") || ""),
      metaKeywords: parseCSV(formData.get("metaKeywords")),
      focusKeywords: parseCSV(formData.get("focusKeywords")),
      slug: String(formData.get("slug") || ""),
    };

    const result = seoSchema.safeParse(rawData);
    if (!result.success) return { error: result.error.flatten().fieldErrors };

    const updated = await updateSEO(id, result.data);
    if (!updated) return { error: { message: ["SEO entry not found"] } };

    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update SEO entry"] } };
  }
}

/* ---------------------------- 🔹 DELETE ---------------------------- */
export async function deleteSEOAction(id: string) {
  await connectToDatabase();

  try {
    const deleted = await deleteSEO(id);
    if (!deleted) return { error: { message: ["SEO entry not found"] } };
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete SEO entry"] } };
  }
}

/* ---------------------------- 🔹 FETCHES ---------------------------- */
export async function fetchAllSEOAction() {
  await connectToDatabase();

  try {
    return { data: await getAllSEO() };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch SEO entries"] } };
  }
}

export async function fetchSEOByIdAction(id: string) {
  await connectToDatabase();

  try {
    const seo = await getSEOById(id);
    if (!seo) return { error: { message: ["SEO entry not found"] } };
    return { data: seo };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch SEO entry"] } };
  }
}

export async function fetchSEOBySlugAction(slug: string) {
  await connectToDatabase();

  try {
    const seo = await getSEOBySlug(slug);
    if (!seo) return { error: { message: ["SEO entry not found"] } };
    return { data: seo };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch SEO entry by slug"] } };
  }
}
/* ---------------------------- 🔹 FETCH LATEST SEO ---------------------------- */
export async function fetchLatestSEOAction() {
  await connectToDatabase();

  try {
    const seo = await getLatestSEO(); // <-- use the function we added in seoFunctions
    if (!seo) return { error: { message: ["No SEO entries found"] } };
    return { data: seo };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch latest SEO entry"] } };
  }
}
