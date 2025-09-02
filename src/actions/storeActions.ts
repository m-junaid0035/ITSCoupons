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
  getCouponCountByStoreId,
} from "@/functions/storeFunctions";
import { saveStoreImage } from "@/lib/uploadStoreImage";

/* ---------------------------- 📝 Validation Schema ---------------------------- */
const allowedNetworks = ["CJ", "Rakuten", "Awin", "Impact", "ShareASale", "N/A"] as const;
type NetworkName = (typeof allowedNetworks)[number];

const storeSchema = z.object({
  name: z.string().trim().min(3).max(100),
  networkName: z.enum(allowedNetworks).default("N/A"),
  storeNetworkUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  directUrl: z.string().url("Invalid direct URL").optional().or(z.literal("")),
  categories: z.array(z.string().min(1, "Invalid category ID")),
  totalCouponUsedTimes: z.coerce.number().min(0).optional(),
  image: z.string().min(1, "Image is required"),
  description: z.string().min(5),
  metaTitle: z.string().min(3),
  metaDescription: z.string().min(3),
  metaKeywords: z.array(z.string()).optional(),
  focusKeywords: z.array(z.string()).optional(),
  slug: z.string().trim().min(3).max(100),
  isPopular: z.coerce.boolean().optional().default(false),
  isActive: z.coerce.boolean().optional().default(true),
}).superRefine((data, ctx) => {
  // Conditional validation: storeNetworkUrl required if networkName != "N/A"
  if (data.networkName !== "N/A" && !data.storeNetworkUrl?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["storeNetworkUrl"],
      message: "storeNetworkUrl is required if networkName is not 'N/A'",
    });
  }
});

type StoreFormData = z.infer<typeof storeSchema>;

export type StoreFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

/* ---------------------------- 🛠️ Helper Parser ---------------------------- */
async function parseStoreFormData(
  formData: FormData
): Promise<StoreFormData & { imageFile: File }> {
  const categoryIds = formData.getAll("categories") as string[];

  const parseCSV = (value: FormDataEntryValue | null) =>
    (value?.toString() || "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

  const uploadedFile = formData.get("imageFile") as File | null;
  if (!uploadedFile || uploadedFile.size === 0) {
    throw new Error("Image file is required");
  }

  const imagePath = await saveStoreImage(uploadedFile);

  const rawNetworkName = String(formData.get("networkName") || "N/A");
  const networkName: NetworkName = allowedNetworks.includes(rawNetworkName as NetworkName)
    ? (rawNetworkName as NetworkName)
    : "N/A";

  return {
    name: String(formData.get("name") || ""),
    networkName,
    storeNetworkUrl: String(formData.get("storeNetworkUrl") || ""),
    directUrl: String(formData.get("directUrl") || ""),
    categories: categoryIds,
    totalCouponUsedTimes: Number(formData.get("totalCouponUsedTimes") || 0),
    image: imagePath,
    description: String(formData.get("description") || ""),
    metaTitle: String(formData.get("metaTitle") || ""),
    metaDescription: String(formData.get("metaDescription") || ""),
    metaKeywords: parseCSV(formData.get("metaKeywords")),
    focusKeywords: parseCSV(formData.get("focusKeywords")),
    slug: String(formData.get("slug") || ""),
    isPopular: ["true", "on", "1"].includes(String(formData.get("isPopular"))),
    isActive: ["true", "on", "1"].includes(String(formData.get("isActive"))),
    imageFile: uploadedFile,
  };
}

/* ---------------------------- 🔹 CREATE ---------------------------- */
export async function createStoreAction(
  prevState: StoreFormState,
  formData: FormData
): Promise<StoreFormState> {
  await connectToDatabase();

  try {
    const parsed = await parseStoreFormData(formData);
    const result = storeSchema.safeParse(parsed);

    if (!result.success) return { error: result.error.flatten().fieldErrors };

    const store = await createStore({
      ...result.data,
      imageFile: parsed.imageFile,
    });

    return { data: store };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to create store"] } };
  }
}

/* ---------------------------- 🔹 UPDATE ---------------------------- */
export async function updateStoreAction(
  prevState: StoreFormState,
  id: string,
  formData: FormData
): Promise<StoreFormState> {
  await connectToDatabase();

  try {
    const parsed = await parseStoreFormData(formData);
    const result = storeSchema.safeParse(parsed);

    if (!result.success) return { error: result.error.flatten().fieldErrors };

    const updated = await updateStore(id, {
      ...result.data,
      imageFile: parsed.imageFile,
    });

    if (!updated) return { error: { message: ["Store not found"] } };
    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update store"] } };
  }
}

/* ---------------------------- 🔹 DELETE ---------------------------- */
export async function deleteStoreAction(id: string) {
  await connectToDatabase();
  try {
    const deleted = await deleteStore(id);
    if (!deleted) return { error: { message: ["Store not found"] } };
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete store"] } };
  }
}

/* ---------------------------- 🔹 FETCHES ---------------------------- */
export async function fetchAllStoresAction() {
  await connectToDatabase();
  try { return { data: await getAllStores() }; } 
  catch (error: any) { return { error: { message: [error.message || "Failed to fetch stores"] } }; }
}

export async function fetchAllActiveStoresAction() {
  await connectToDatabase();
  try { return { data: await getAllActiveStores() }; } 
  catch (error: any) { return { error: { message: [error.message || "Failed to fetch stores"] } }; }
}

export async function fetchStoreByIdAction(id: string) {
  await connectToDatabase();
  try {
    const store = await getStoreById(id);
    if (!store) return { error: { message: ["Store not found"] } };
    return { data: store };
  } catch (error: any) { return { error: { message: [error.message || "Failed to fetch store"] } }; }
}

export async function fetchPopularStoresAction() {
  await connectToDatabase();
  try { return { data: await getPopularStores() }; } 
  catch (error: any) { return { error: { message: [error.message || "Failed to fetch popular stores"] } }; }
}

export async function fetchRecentlyUpdatedStoresAction() {
  await connectToDatabase();
  try { return { data: await getRecentlyUpdatedStores() }; } 
  catch (error: any) { return { error: { message: [error.message || "Failed to fetch recently updated stores"] } }; }
}

export async function fetchStoresByCategoriesAction(categories: string[]) {
  await connectToDatabase();
  try {
    if (!categories.length) return { data: [] };
    return { data: await getStoresByCategories(categories) };
  } catch (error: any) { return { error: { message: [error.message || "Failed to fetch stores by categories"] } }; }
}

export async function fetchAllStoresWithCouponsAction() {
  await connectToDatabase();
  try { return { data: await getStoresWithCoupons() }; } 
  catch (error: any) { return { error: { message: [error.message || "Failed to fetch stores with coupons"] } }; }
}

export async function fetchStoreWithCouponsByIdAction(storeId: string) {
  await connectToDatabase();
  try {
    const store = await getStoreWithCouponsById(storeId);
    if (!store) return { error: { message: ["Store not found"] } };
    return { data: store };
  } catch (error: any) { return { error: { message: [error.message || "Failed to fetch store"] } }; }
}

export async function fetchCouponCountByStoreIdAction(storeId: string) {
  await connectToDatabase();
  try {
    const count = await getCouponCountByStoreId(storeId);
    return { data: count };
  } catch (error: any) { return { error: { message: [error.message || "Failed to fetch coupon count"] } }; }
}


export type InlineStoreUpdate = Partial<{
  name: string;
  network: string;
  directUrl: string;
  categories: string[];
  totalCouponUsedTimes: number;
  imageFile: File;
  image: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  focusKeywords: string[];
  slug: string;
  isPopular: boolean;
  isActive: boolean;
}>;

export async function updateStoreInline(id: string, updates: InlineStoreUpdate & Partial<{ categories: string[]; directUrl: string; imageFile: File }>) {
  await connectToDatabase();

  const store = await getStoreById(id);
  if (!store) return { error: { message: ["Store not found"] } };

  // Auto-generate slug if name is updated
  if (updates.name && !updates.slug) {
    updates.slug = updates.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^\w_]/g, "");
  }

  // Auto-update meta fields if name changed
  if (updates.name) {
    updates.metaTitle = `${updates.name} - Your Store`;
    updates.metaDescription = `Buy ${updates.name} products online`;
    updates.focusKeywords = [updates.name.toLowerCase()];
  }

  // Fill missing required fields from existing store
  const finalUpdates = {
    name: updates.name ?? store.name,
    categories: updates.categories ?? store.categories,
    directUrl: updates.directUrl ?? store.directUrl,
    imageFile: updates.imageFile,
    network: updates.network ?? store.network,
    totalCouponUsedTimes: updates.totalCouponUsedTimes ?? store.totalCouponUsedTimes,
    image: updates.image ?? store.image,
    description: updates.description ?? store.description,
    metaTitle: updates.metaTitle ?? store.metaTitle,
    metaDescription: updates.metaDescription ?? store.metaDescription,
    metaKeywords: updates.metaKeywords ?? store.metaKeywords,
    focusKeywords: updates.focusKeywords ?? store.focusKeywords,
    isPopular: updates.isPopular ?? store.isPopular,
    isActive: updates.isActive ?? store.isActive,
    slug: updates.slug ?? store.slug,
  };

  try {
    const updated = await updateStore(id, finalUpdates);
    if (!updated) return { error: { message: ["Failed to update store"] } };
    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update store"] } };
  }
}
