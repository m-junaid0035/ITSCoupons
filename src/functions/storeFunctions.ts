import { Store } from "@/models/Store";
import { Types } from "mongoose";
import { saveStoreImage } from "@/lib/uploadStoreImage";
import { Coupon } from "@/models/Coupon";

/**
 * Sanitize and format incoming store data before saving/updating.
 */
const sanitizeStoreData = (data: {
  name: string;
  networkName: string;
  storeNetworkUrl?: string;
  directUrl?: string; // ✅ added
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
  networkName: data.networkName,
  storeNetworkUrl: data.storeNetworkUrl?.trim() ?? "",
  directUrl: data.directUrl?.trim() ?? "", // ✅ added
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
 * Serialize coupon (for embedding in store).
 */
const serializeCoupon = (coupon: any) => ({
  _id: coupon._id.toString(),
  title: coupon.title,
  description: coupon.description ?? "",
  couponType: coupon.couponType ?? "coupon",
  couponCode: coupon.couponCode ?? "",
  expirationDate: coupon.expirationDate?.toISOString?.(),
  status: coupon.status,
  discount: coupon.discount,
  isTopOne: coupon.isTopOne ?? false,
  uses: coupon.uses ?? 0,
  verified: coupon.verified ?? false,
  couponUrl: coupon.couponUrl ?? "",
  storeName: coupon.storeName ?? "",
  storeId: coupon.storeId?.toString() ?? "",
  createdAt: coupon.createdAt?.toISOString?.(),
  updatedAt: coupon.updatedAt?.toISOString?.(),
});

/**
 * Serialize store (safe for Client Components).
 */
const serializeStore = (store: any) => ({
  _id: store._id.toString(),
  name: store.name,
  networkName: store.networkName,
  storeNetworkUrl: store.storeNetworkUrl,
  directUrl: store.directUrl, // ✅ added
  categories: (store.categories || []).map((cat: any) =>
    typeof cat === "object" && cat._id ? cat._id.toString() : cat.toString()
  ),
  totalCouponUsedTimes: store.totalCouponUsedTimes ?? 0,
  image: store.image,
  description: store.description,
  metaTitle: store.metaTitle,
  metaDescription: store.metaDescription,
  metaKeywords: store.metaKeywords ?? [],
  focusKeywords: store.focusKeywords ?? [],
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
  networkName: string;
  storeNetworkUrl?: string;
  directUrl?: string; // ✅ added
  categories: string[];
  totalCouponUsedTimes?: number;
  imageFile: File;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string[];
  focusKeywords?: string[];
  slug: string;
  isPopular?: boolean;
  isActive?: boolean;
}) => {
  const imagePath = await saveStoreImage(data.imageFile);

  const storeData = sanitizeStoreData({
    ...data,
    image: imagePath,
  });

  const store = await new Store(storeData).save();
  return serializeStore(store);
};

/**
 * Get all active stores.
 */
export const getAllActiveStores = async () => {
  const stores = await Store.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();
  return stores.map(serializeStore);
};

/**
 * Get all stores.
 */
export const getAllStores = async () => {
  const stores = await Store.find().sort({ createdAt: -1 }).lean();
  return stores.map(serializeStore);
};

/**
 * Get a store by ID.
 */
export const getStoreById = async (id: string) => {
  const store = await Store.findById(id).lean();
  return store ? serializeStore(store) : null;
};

/**
 * Update store (optionally with new image).
 */
export const updateStore = async (
  id: string,
  data: {
    name: string;
    networkName: string;
    storeNetworkUrl?: string;
    directUrl?: string; // ✅ added
    categories: string[];
    totalCouponUsedTimes?: number;
    imageFile?: File;
    image?: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords?: string[];
    focusKeywords?: string[];
    slug: string;
    isPopular?: boolean;
    isActive?: boolean;
  }
) => {
  let imagePath = data.image ?? "";

  if (data.imageFile) {
    imagePath = await saveStoreImage(data.imageFile);
  }

  const updatedData = sanitizeStoreData({
    ...data,
    image: imagePath,
  });

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
export const deleteStore = async (id: string) => {
  const store = await Store.findByIdAndDelete(id).lean();
  return store ? serializeStore(store) : null;
};

/**
 * Get popular stores.
 */
export const getPopularStores = async () => {
  const stores = await Store.find({ isPopular: true, isActive: true })
    .sort({ createdAt: -1 })
    .lean();
  return stores.map(serializeStore);
};

/**
 * Get recently updated stores.
 */
export const getRecentlyUpdatedStores = async () => {
  const stores = await Store.find({ isActive: true })
    .sort({ updatedAt: -1 })
    .lean();
  return stores.map(serializeStore);
};

/**
 * Get stores by category IDs.
 */
export const getStoresByCategories = async (categories: string[]) => {
  const stores = await Store.find({
    categories: { $in: categories.map((id) => new Types.ObjectId(id)) },
    isActive: true,
  }).lean();
  return stores.map(serializeStore);
};

/**
 * Get stores with coupons.
 */
export const getStoresWithCoupons = async () => {
  const storesWithCoupons = await Store.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: "coupons",
        localField: "_id",
        foreignField: "storeId",
        as: "coupons",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return storesWithCoupons.map(serializeStore);
};

/**
 * Get a store with coupons by ID.
 */
export const getStoreWithCouponsById = async (storeId: string) => {
  if (!Types.ObjectId.isValid(storeId)) return null;

  const [storeWithCoupons] = await Store.aggregate([
    { $match: { _id: new Types.ObjectId(storeId), isActive: true } },
    {
      $lookup: {
        from: "coupons",
        localField: "_id",
        foreignField: "storeId",
        as: "coupons",
      },
    },
  ]);

  return storeWithCoupons ? serializeStore(storeWithCoupons) : null;
};

/**
 * Get the total number of coupons of a particular store.
 */
export const getCouponCountByStoreId = async (storeId: string) => {
  if (!Types.ObjectId.isValid(storeId)) return 0;

  const count = await Coupon.countDocuments({
    storeId: new Types.ObjectId(storeId),
  });
  return count;
};
