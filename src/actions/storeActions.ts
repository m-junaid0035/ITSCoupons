"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createStore,
  deleteStore,
  getAllStores,
  getStoreById,
  updateStore,
  getPopularStores,
  getRecentlyUpdatedStores,
} from "@/functions/storeFunctions";

// ✅ Store Validation Schema
// ✅ Store Validation Schema
const storeSchema = z.object({
  name: z.string().trim().min(3).max(100),
  storeNetworkUrl: z.string().url("Invalid URL"),
  categories: z.array(z.string().min(1, "Invalid category ID")),
  totalCouponUsedTimes: z.coerce.number().min(0).optional(),
  image: z.string().url("Invalid image URL"),
  description: z.string().min(5),
  metaTitle: z.string().min(3),
  metaDescription: z.string().min(3),
  metaKeywords: z.array(z.string()).optional(),
  focusKeywords: z.array(z.string()).optional(),
  slug: z.string().trim().min(3).max(100),

  // ✅ Added new fields
  isPopular: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
});

type StoreFormData = z.infer<typeof storeSchema>;

export type StoreFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

// ✅ Helper: Parse FormData to StoreFormData
function parseStoreFormData(formData: FormData): StoreFormData {
  const categoryIds = formData.getAll("categories") as string[];
  const metaKeywords = (formData.get("metaKeywords") || "")
    .toString()
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const focusKeywords = (formData.get("focusKeywords") || "")
    .toString()
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    name: String(formData.get("name") || ""),
    storeNetworkUrl: String(formData.get("storeNetworkUrl") || ""),
    categories: categoryIds,
    totalCouponUsedTimes: Number(formData.get("totalCouponUsedTimes") || 0),
    image: String(formData.get("image") || ""),
    description: String(formData.get("description") || ""),
    metaTitle: String(formData.get("metaTitle") || ""),
    metaDescription: String(formData.get("metaDescription") || ""),
    metaKeywords,
    focusKeywords,
    slug: String(formData.get("slug") || ""),

    // ✅ Added new fields
    isPopular: formData.get("isPopular") === "true",
    isActive: formData.get("isActive") !== "false", // default to true
  };
}


// ✅ CREATE STORE
export async function createStoreAction(
  prevState: StoreFormState,
  formData: FormData
): Promise<StoreFormState> {
  await connectToDatabase();

  const parsed = parseStoreFormData(formData);
  const result = storeSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const store = await createStore(result.data);
    return { data: store };
  } catch (error: any) {
    if (error.code === 11000) {
      return { error: { slug: ["Slug must be unique"] } };
    }
    return { error: { message: [error.message || "Failed to create store"] } };
  }
}

// ✅ UPDATE STORE
export async function updateStoreAction(
  prevState: StoreFormState,
  id: string,
  formData: FormData
): Promise<StoreFormState> {
  await connectToDatabase();

  const parsed = parseStoreFormData(formData);
  const result = storeSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const updated = await updateStore(id, result.data);
    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update store"] } };
  }
}

// ✅ DELETE STORE
export async function deleteStoreAction(id: string) {
  await connectToDatabase();
  try {
    const deleted = await deleteStore(id);
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete store"] } };
  }
}

// ✅ FETCH ALL STORES
export async function fetchAllStoresAction() {
  await connectToDatabase();
  try {
    const stores = await getAllStores();
    console.log(stores)
    return { data: stores };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch stores"] } };
  }
}

// ✅ FETCH SINGLE STORE
export async function fetchStoreByIdAction(id: string) {
  await connectToDatabase();
  try {
    const store = await getStoreById(id);
    if (!store) {
      return { error: { message: ["Store not found"] } };
    }
    return { data: store };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch store"] } };
  }
}

export async function fetchPopularStoresAction() {
  await connectToDatabase();
  try {
    const stores = await getPopularStores();
    return { data: stores };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch popular stores"] } };
  }
}

export async function fetchRecentlyUpdatedStoresAction() {
  await connectToDatabase();
  try {
    const stores = await getRecentlyUpdatedStores();
    return { data: stores };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch recently updated stores"] } };
  }
}