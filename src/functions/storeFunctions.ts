import { Store } from "@/models/Store";
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
  isPopular?: boolean;
  isActive?: boolean;
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
  isPopular: data.isPopular ?? false,
  isActive: data.isActive ?? true,
});

/**
 * Serialize coupon (basic fields) for embedding in store result.
 */
const serializeCoupon = (coupon: any) => ({
  _id: coupon._id.toString(),
  title: coupon.title,
  couponCode: coupon.couponCode,
  expirationDate: coupon.expirationDate?.toISOString?.(),
  status: coupon.status,
  discount: coupon.discount,
  isTopOne: coupon.isTopOne ?? false,
  uses: coupon.uses,
  verified: coupon.verified,
});

/**
 * Convert a Mongoose store document to plain object safe for Client Components.
 * Adds embedded coupons if present.
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
  isPopular: store.isPopular ?? false,
  isActive: store.isActive ?? true,
  createdAt: store.createdAt?.toISOString?.(),
  updatedAt: store.updatedAt?.toISOString?.(),
  coupons: (store.coupons || []).map(serializeCoupon),
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
  isPopular?: boolean;
  isActive?: boolean;
}): Promise<ReturnType<typeof serializeStore>> => {
  const storeData = sanitizeStoreData(data);
  const store = await new Store(storeData).save();
  return serializeStore(store);
};

/**
 * Get all stores, sorted by newest first.
 */
export const getAllActiveStores = async (): Promise<
  ReturnType<typeof serializeStore>[]
> => {
  const stores = await Store.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();
  return stores.map(serializeStore);
};

/**
 * Get all stores, sorted by newest first.
 */
export const getAllStores = async (): Promise<
  ReturnType<typeof serializeStore>[]
> => {
  const stores = await Store.find()
    .sort({ createdAt: -1 })
    .lean();
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
    isPopular?: boolean;
    isActive?: boolean;
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
  const stores = await Store.find({ isPopular: true, isActive: true })
    .sort({ createdAt: -1 })
    .lean();
  return stores.map(serializeStore);
};

/**
 * Get all recently updated stores, sorted by updatedAt descending.
 */
export const getRecentlyUpdatedStores = async (): Promise<
  ReturnType<typeof serializeStore>[]
> => {
  const stores = await Store.find({ isActive: true })
    .sort({ updatedAt: -1 })
    .lean();
  return stores.map(serializeStore);
};

/**
 * Get stores by category IDs.
 */
export const getStoresByCategories = async (
  categories: string[]
): Promise<ReturnType<typeof serializeStore>[]> => {
  const stores = await Store.find({
    categories: { $in: categories.map((id) => new Types.ObjectId(id)) },
    isActive: true,
  }).lean();

  return stores.map(serializeStore);
};

/**
 * NEW: Get all stores with their coupons (joined via $lookup aggregation).
 */
export const getStoresWithCoupons = async (): Promise<
  ReturnType<typeof serializeStore>[]
> => {
  const storesWithCoupons = await Store.aggregate([
    {
      $match: { isActive: true },
    },
    {
      $lookup: {
        from: "coupons",        // collection name in MongoDB for coupons
        localField: "_id",
        foreignField: "storeId",
        as: "coupons",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return storesWithCoupons.map(serializeStore);
};
