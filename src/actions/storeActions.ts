"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createStore,
  deleteStore,
  getAllStores,
  getAllActiveStores,
  getStoreById,
  updateStore,
  getPopularStores,
  getRecentlyUpdatedStores,
  getStoresByCategories,
  getStoresWithCoupons,
  getStoreWithCouponsById,
} from "@/functions/storeFunctions";

// Store validation schema
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
  isPopular: z.coerce.boolean().optional().default(false),
  isActive: z.coerce.boolean().optional().default(true),
});

type StoreFormData = z.infer<typeof storeSchema>;

export type StoreFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

// ✅ Parse FormData including checkbox coercion
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
    isPopular:
      formData.get("isPopular") === "true" || formData.get("isPopular") === "on",
    isActive:
      formData.get("isActive") === "true" || formData.get("isActive") === "on",
  };
}

// CREATE STORE
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

// UPDATE STORE
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

// DELETE STORE
export async function deleteStoreAction(id: string) {
  await connectToDatabase();
  try {
    const deleted = await deleteStore(id);
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete store"] } };
  }
}

// FETCH ALL STORES
export async function fetchAllStoresAction() {
  await connectToDatabase();
  try {
    const stores = await getAllStores();
    return { data: stores };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch stores"] } };
  }
}

// FETCH ALL ACTIVE STORES
export async function fetchAllActiveStoresAction() {
  await connectToDatabase();
  try {
    const stores = await getAllActiveStores();
    return { data: stores };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch stores"] } };
  }
}

// FETCH SINGLE STORE
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

// FETCH POPULAR STORES
export async function fetchPopularStoresAction() {
  await connectToDatabase();
  try {
    const stores = await getPopularStores();
    return { data: stores };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch popular stores"] } };
  }
}

// FETCH RECENTLY UPDATED STORES
export async function fetchRecentlyUpdatedStoresAction() {
  await connectToDatabase();
  try {
    const stores = await getRecentlyUpdatedStores();
    return { data: stores };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch recently updated stores"] } };
  }
}

// FETCH STORES BY CATEGORIES
export async function fetchStoresByCategoriesAction(categories: string[]) {
  await connectToDatabase();

  try {
    if (!categories.length) {
      return { data: [] };
    }

    const stores = await getStoresByCategories(categories);
    return { data: stores };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch stores by categories"] } };
  }
}

// FETCH STORES WITH COUPONS
export async function fetchAllStoresWithCouponsAction() {
  await connectToDatabase();

  try {
    const storesWithCoupons = await getStoresWithCoupons();
    return { data: storesWithCoupons };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch stores with coupons"] } };
  }
}
export async function fetchStoreWithCouponsByIdAction(storeId: string) {
  await connectToDatabase();

  try {
    const store = await getStoreWithCouponsById(storeId);

    if (!store) {
      return { error: { message: ["Store not found"] } };
    }

    return { data: store };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch store"] } };
  }
}
