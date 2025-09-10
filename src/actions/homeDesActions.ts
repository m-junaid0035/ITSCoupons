"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  upsertHomeDescription,
  getLatestHomeDescription,
  getHomeDescriptionById,
} from "@/functions/homeDesFunctions";

// ✅ Validation schema updated to 5000 characters
const homeDescriptionSchema = z.object({
  description: z
    .string()
    .trim()
    .max(5000, "Description must be less than 5000 characters")
    .optional(),
});

export type HomeDescriptionFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

// ✅ Parse FormData helper
function parseFormData(formData: FormData) {
  return {
    description: String(formData.get("description") || ""),
    id: String(formData.get("id") || ""), // include id for updates
  };
}

/**
 * UPSERT HOME DESCRIPTION (create if not exists, else update)
 */
export async function upsertHomeDescriptionAction(
  prevState: HomeDescriptionFormState,
  formData: FormData
): Promise<HomeDescriptionFormState> {
  await connectToDatabase();

  const { description, id } = parseFormData(formData);

  const result = homeDescriptionSchema.safeParse({ description });
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    // Pass ID if it exists to update the document
    const doc = await upsertHomeDescription(result.data.description || "", id || undefined);
    return { data: doc };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to save home description"] } };
  }
}

/**
 * GET LATEST HOME DESCRIPTION
 */
export async function fetchLatestHomeDescriptionAction() {
  await connectToDatabase();

  try {
    const doc = await getLatestHomeDescription();
    if (!doc) return { error: { message: ["Home description not found"] } };
    return { data: doc };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch home description"] } };
  }
}

/**
 * GET HOME DESCRIPTION BY ID
 */
export async function fetchHomeDescriptionByIdAction(id: string) {
  await connectToDatabase();

  try {
    const doc = await getHomeDescriptionById(id);
    if (!doc) return { error: { message: ["Home description not found"] } };
    return { data: doc };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch home description"] } };
  }
}
