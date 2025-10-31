"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";

import { Coupon } from "@/models/Coupon";

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
  getStoresByNetwork,
  getStoreWithCouponsBySlug,
} from "@/functions/storeFunctions";
import { saveStoreImage } from "@/lib/uploadStoreImage";
import { fetchLatestSEOAction } from "./seoActions";

/* ---------------------------- 📝 Validation Schema ---------------------------- */
const storeSchema = z.object({
  name: z.string().trim().min(3).max(100),
  network: z.string().optional().or(z.literal("")),
  storeNetworkUrl: z.string().url("Invalid network URL").optional().or(z.literal("")),
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
  content: z.string().optional().default(""), // ✅ make optional with default ""
});


type StoreFormData = z.infer<typeof storeSchema>;

export type StoreFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

/* ---------------------------- 🛠️ Helper Parser ---------------------------- */
async function parseStoreFormData(
  formData: FormData
): Promise<StoreFormData & { imageFile: File | null }> {
  const categoryIds = formData.getAll("categories") as string[];

  const parseCSV = (value: FormDataEntryValue | null) =>
    (value?.toString() || "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

  let imagePath = "";
  const uploadedFile = formData.get("imageFile") as File | null;
  const alreadyFile = formData.get("existingImage") as string | null;

  // 🧩 Validation: must have at least one source of image
  if ((!uploadedFile || uploadedFile.size === 0) && !alreadyFile) {
    throw new Error("Image file is required");
  }

  // 🧠 Determine image path
  if (uploadedFile && uploadedFile.size > 0) {
    imagePath = await saveStoreImage(uploadedFile);
  } else if (alreadyFile) {
    imagePath = alreadyFile;
  }

  return {
    name: String(formData.get("name") || ""),
    network: String(formData.get("network") || ""),
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
    content: String(formData.get("content") || ""),
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
    return {
      error: { message: [error.message || "Failed to delete store"] },
    };
  }
}

/* ---------------------------- 🔹 FETCHES ---------------------------- */
export async function fetchAllStoresAction() {
  await connectToDatabase();
  try {
    return { data: await getAllStores() };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch stores"] },
    };
  }
}

export async function fetchAllActiveStoresAction() {
  await connectToDatabase();
  try {
    return { data: await getAllActiveStores() };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch stores"] },
    };
  }
}

export async function fetchStoreByIdAction(id: string) {
  await connectToDatabase();
  try {
    const store = await getStoreById(id);
    if (!store) return { error: { message: ["Store not found"] } };
    return { data: store };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch store"] },
    };
  }
}

export async function fetchPopularStoresAction() {
  await connectToDatabase();
  try {
    return { data: await getPopularStores() };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch popular stores"] },
    };
  }
}

export async function fetchRecentlyUpdatedStoresAction() {
  await connectToDatabase();
  try {
    return { data: await getRecentlyUpdatedStores() };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch recently updated stores"] },
    };
  }
}

export async function fetchStoresByCategoriesAction(categories: string[]) {
  await connectToDatabase();
  try {
    if (!categories.length) return { data: [] };
    return { data: await getStoresByCategories(categories) };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch stores by categories"] },
    };
  }
}

export async function fetchAllStoresWithCouponsAction() {
  await connectToDatabase();
  try {
    return { data: await getStoresWithCoupons() };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch stores with coupons"] },
    };
  }
}

export async function fetchStoreWithCouponsByIdAction(storeId: string) {
  await connectToDatabase();
  try {
    const store = await getStoreWithCouponsById(storeId);
    if (!store) return { error: { message: ["Store not found"] } };
    return { data: store };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch store"] },
    };
  }
}

export async function fetchCouponCountByStoreIdAction(storeId: string) {
  await connectToDatabase();
  try {
    const count = await getCouponCountByStoreId(storeId);
    return { data: count };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch coupon count"] },
    };
  }
}

/* ---------------------------- 🔹 INLINE UPDATE ---------------------------- */
export type InlineStoreUpdate = Partial<{
  name: string;
  network: string;
  storeNetworkUrl: string;
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
  content?: string; // ✅ optional
}>;


export async function updateStoreInline(
  id: string,
  updates: InlineStoreUpdate
) {
  await connectToDatabase();

  const store = await getStoreById(id);
  if (!store) return { error: { message: ["Store not found"] } };

  /* ---------------------------- 📝 SEO Template Handling ---------------------------- */
  let seoUpdates: Partial<InlineStoreUpdate> = {};

  if (updates.name) {
    const { data: latestSEO } = await fetchLatestSEOAction("stores");

    if (latestSEO) {
      const replaceStoreName = (text: string) =>
        text.replace(/{{storeName}}|s_n/gi, updates.name as string);

      const slugSource = latestSEO.slug || updates.name;
      const processedSlug = replaceStoreName(slugSource)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      seoUpdates = {
        metaTitle: replaceStoreName(latestSEO.metaTitle || ""),
        metaDescription: replaceStoreName(latestSEO.metaDescription || ""),
        metaKeywords: (latestSEO.metaKeywords || []).map(replaceStoreName),
        focusKeywords: (latestSEO.focusKeywords || []).map(replaceStoreName),
        slug: processedSlug,
      };
    } else {
      // fallback if no SEO template is found
      seoUpdates = {
        metaTitle: `${updates.name} - Your Store`,
        metaDescription: `Buy ${updates.name} products online`,
        focusKeywords: [updates.name.toLowerCase()],
        slug: updates.name
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, ""),
      };
    }
  }

  /* ---------------------------- 🔹 Merge Updates ---------------------------- */
  const finalUpdates = {
    name: updates.name ?? store.name,
    network: updates.network ?? store.network,
    storeNetworkUrl: updates.storeNetworkUrl ?? store.storeNetworkUrl,
    directUrl: updates.directUrl ?? store.directUrl,
    categories: updates.categories ?? store.categories,
    totalCouponUsedTimes:
      updates.totalCouponUsedTimes ?? store.totalCouponUsedTimes,
    imageFile: updates.imageFile,
    image: updates.image ?? store.image,
    description: updates.description ?? store.description,
    metaTitle: seoUpdates.metaTitle ?? updates.metaTitle ?? store.metaTitle,
    metaDescription:
      seoUpdates.metaDescription ??
      updates.metaDescription ??
      store.metaDescription,
    metaKeywords:
      seoUpdates.metaKeywords ?? updates.metaKeywords ?? store.metaKeywords,
    focusKeywords:
      seoUpdates.focusKeywords ?? updates.focusKeywords ?? store.focusKeywords,
    slug: seoUpdates.slug ?? updates.slug ?? store.slug,
    isPopular: updates.isPopular ?? store.isPopular,
    isActive: updates.isActive ?? store.isActive,
    content: updates.content ?? store.content,
  };

  try {
    const updated = await updateStore(id, finalUpdates);
    if (!updated) return { error: { message: ["Failed to update store"] } };
    return { data: updated };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to update store"] },
    };
  }
}

/* ---------------------------- 🔹 EXTRA FETCHERS ---------------------------- */
export async function fetchStoresByNetworkAction(networkId: string) {
  await connectToDatabase();

  if (!networkId) {
    return { error: { message: ["Network ID is required"] } };
  }

  try {
    const stores = await getStoresByNetwork(networkId);
    return { data: stores };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch stores for network"] },
    };
  }
}

export async function fetchStoreWithCouponsBySlugAction(slug: string) {
  await connectToDatabase();

  if (!slug) {
    return { error: { message: ["Slug is required"] } };
  }

  try {
    const store = await getStoreWithCouponsBySlug(slug);
    if (!store) {
      return { error: { message: ["Store not found"] } };
    }
    return { data: store };
  } catch (error: any) {
    return {
      error: {
        message: [
          error.message || "Failed to fetch store with coupons by slug",
        ],
      },
    };
  }
}
export async function updateMetaTitleWithDiscountIfHigher(storeId: string) {
  await connectToDatabase();

  if (!storeId) {
    return { error: { message: ["Store ID is required"] } };
  }

  // 1️⃣ Get all coupons for this store
  const coupons = await Coupon.find({ storeId });

  // Track max numeric discount
  let maxDiscount: number | null = null;
  let discountSymbol = "%"; // default symbol

  if (coupons && coupons.length > 0) {
    for (const coupon of coupons) {
      const discountStr = coupon.discount || "";
      // Match $55, 55$, 50%, 50 % etc.
      const match = discountStr.match(/(\$)?\s*(\d+)\s*(%|\$)?/);
      if (match) {
        const prefixDollar = match[1]; // $ before number
        const value = parseInt(match[2], 10);
        const suffixSymbol = match[3]; // % or $ after number

        const symbol = prefixDollar ? "$" : suffixSymbol || "%";

        if (maxDiscount === null || value > maxDiscount) {
          maxDiscount = value;
          discountSymbol = symbol;
        }
      }
    }
  }

  // 2️⃣ Get store info
  const store = await getStoreById(storeId);
  if (!store) return { error: { message: ["Store not found"] } };
  if (!store.metaTitle) return { error: { message: ["Meta title is empty"] } };

  let updatedMetaTitle = store.metaTitle;

  if (maxDiscount !== null) {
    const maxDiscountText = `${discountSymbol}${maxDiscount} `; // ✅ added space after discount

    // ✅ If metaTitle contains d_c, replace it
    if (updatedMetaTitle.includes("d_c")) {
      updatedMetaTitle = updatedMetaTitle.replace(/d_c/g, maxDiscountText);
    } else {
      // ✅ Check if metaTitle already has any numeric discount ($ or %)
      const existingDiscountRegex = /(\$)?\d+\s*(%|\$)?/;
      if (existingDiscountRegex.test(updatedMetaTitle)) {
        updatedMetaTitle = updatedMetaTitle.replace(existingDiscountRegex, maxDiscountText);
      } else {
        // ✅ If no numeric discount exists, append max discount
        updatedMetaTitle += ` - ${maxDiscountText}Off`;
      }
    }
  } else {
    // ✅ If no numeric discount in coupons, just replace d_c if exists
    if (updatedMetaTitle.includes("d_c")) {
      updatedMetaTitle = updatedMetaTitle.replace(/d_c/g, "d_c");
    }
  }

  try {
    const updatedStore = await updateStoreInline(storeId, {
      metaTitle: updatedMetaTitle,
    });

    if (!updatedStore) {
      return { error: { message: ["Failed to update meta title"] } };
    }

    return {
      data: updatedStore,
      message:
        maxDiscount !== null
          ? `Meta title updated with ${discountSymbol}${maxDiscount}`
          : "No numeric discount found, meta title unchanged",
    };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update meta title"] } };
  }
}

