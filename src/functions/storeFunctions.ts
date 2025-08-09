import { Store } from "@/models/Store";
import { IStore } from "@/models/Store";
import { Types } from "mongoose";

/**
 * Helper to sanitize and format incoming store data.
 */
const sanitizeStoreData = (data: {
  name: string;
  storeNetworkUrl: string;
  categories: string[];
  totalCouponUsedTimes?: number;
  image: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string[];
  focusKeywords?: string[];
  slug: string;
  isPopular?: boolean;     // ✅ NEW
  isActive?: boolean;      // ✅ NEW
}) => ({
  name: data.name.trim(),
  storeNetworkUrl: data.storeNetworkUrl.trim(),
  categories: data.categories.map((id) => new Types.ObjectId(id)),
  totalCouponUsedTimes: data.totalCouponUsedTimes ?? 0,
  image: data.image.trim(),
  description: data.description.trim(),
  metaTitle: data.metaTitle.trim(),
  metaDescription: data.metaDescription.trim(),
  metaKeywords: data.metaKeywords ?? [],
  focusKeywords: data.focusKeywords ?? [],
  slug: data.slug.trim().toLowerCase().replace(/\s+/g, "-"),
  isPopular: data.isPopular ?? false,   // ✅ NEW
  isActive: data.isActive ?? true,      // ✅ NEW
});

/**
 * Convert a Mongoose document to a plain object safe for Client Components.
 */
const serializeStore = (store: any) => ({
  _id: store._id.toString(),
  name: store.name,
  storeNetworkUrl: store.storeNetworkUrl,
  categories: store.categories.map((cat: any) =>
    typeof cat === "object" && cat._id ? cat._id.toString() : cat.toString()
  ),
  totalCouponUsedTimes: store.totalCouponUsedTimes,
  image: store.image,
  description: store.description,
  metaTitle: store.metaTitle,
  metaDescription: store.metaDescription,
  metaKeywords: store.metaKeywords,
  focusKeywords: store.focusKeywords,
  slug: store.slug,
  isPopular: store.isPopular ?? false,   // ✅ NEW
  isActive: store.isActive ?? true,      // ✅ NEW
  createdAt: store.createdAt?.toISOString?.(),
  updatedAt: store.updatedAt?.toISOString?.(),
});

/**
 * Create a new store.
 */
export const createStore = async (data: {
  name: string;
  storeNetworkUrl: string;
  categories: string[];
  totalCouponUsedTimes?: number;
  image: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string[];
  focusKeywords?: string[];
  slug: string;
  isPopular?: boolean;     // ✅ NEW
  isActive?: boolean;      // ✅ NEW
}): Promise<ReturnType<typeof serializeStore>> => {
  const storeData = sanitizeStoreData(data);
  const store = await new Store(storeData).save();
  return serializeStore(store);
};

/**
 * Get all stores, sorted by newest first.
 */
export const getAllStores = async (): Promise<
  ReturnType<typeof serializeStore>[]
> => {
  const stores = await Store.find().sort({ createdAt: -1 }).lean();
  return stores.map(serializeStore);
};

/**
 * Get a store by its ID.
 */
export const getStoreById = async (
  id: string
): Promise<ReturnType<typeof serializeStore> | null> => {
  const store = await Store.findById(id).lean();
  return store ? serializeStore(store) : null;
};

/**
 * Update a store by ID.
 */
export const updateStore = async (
  id: string,
  data: {
    name: string;
    storeNetworkUrl: string;
    categories: string[];
    totalCouponUsedTimes?: number;
    image: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords?: string[];
    focusKeywords?: string[];
    slug: string;
    isPopular?: boolean;     // ✅ NEW
    isActive?: boolean;      // ✅ NEW
  }
): Promise<ReturnType<typeof serializeStore> | null> => {
  const updatedData = sanitizeStoreData(data);
  const store = await Store.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();
  return store ? serializeStore(store) : null;
};

/**
 * Delete a store by ID.
 */
export const deleteStore = async (
  id: string
): Promise<ReturnType<typeof serializeStore> | null> => {
  const store = await Store.findByIdAndDelete(id).lean();
  return store ? serializeStore(store) : null;
};
/**
 * Get all popular stores (isPopular === true), sorted by newest first.
 */
export const getPopularStores = async (): Promise<
  ReturnType<typeof serializeStore>[]
> => {
  const stores = await Store.find({ isPopular: true })
    .sort({ createdAt: -1 })
    .lean();
  return stores.map(serializeStore);
};

/**
 * Get all recently updated stores, sorted by updatedAt descending (newest first).
 */
export const getRecentlyUpdatedStores = async (): Promise<
  ReturnType<typeof serializeStore>[]
> => {
  const stores = await Store.find()
    .sort({ updatedAt: -1 })
    .lean();
  return stores.map(serializeStore);
};
