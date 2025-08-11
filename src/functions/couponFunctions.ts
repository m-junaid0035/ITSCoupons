import { Coupon } from "@/models/Coupon";
import { Types } from "mongoose";
import cron from "node-cron";
/**
 * Helper to sanitize and format incoming coupon data.
 */
const sanitizeCouponData = (data: {
  title: string;
  description?: string;
  couponType: "deal" | "coupon";
  status: "active" | "expired";
  couponCode: string;
  expirationDate: string;
  couponUrl?: string;
  storeName?: string;
  storeId: string;
  isTopOne?: boolean;
  discount?: string;
  uses?: number;
  verified?: boolean;
}) => ({
  title: data.title.trim(),
  description: data.description?.trim(),
  couponType: data.couponType,
  status: data.status,
  couponCode: data.couponCode.trim(),
  expirationDate: new Date(data.expirationDate),
  couponUrl: data.couponUrl?.trim(),
  storeName: data.storeName?.trim(),
  storeId: new Types.ObjectId(data.storeId),
  isTopOne: data.isTopOne ?? false,
  discount: data.discount?.trim(),
  uses: data.uses ?? 0,
  verified: data.verified ?? false,
});

const serializeCouponWithStore = (coupon: any) => ({
  _id: coupon._id.toString(),
  title: coupon.title,
  description: coupon.description,
  couponType: coupon.couponType,
  status: coupon.status,
  couponCode: coupon.couponCode,
  expirationDate: coupon.expirationDate?.toISOString?.(),
  couponUrl: coupon.couponUrl,
  storeName: coupon.storeName,
  storeId: coupon.storeId?.toString(),
  isTopOne: coupon.isTopOne ?? false,
  discount: coupon.discount,
  uses: coupon.uses,
  verified: coupon.verified,
  createdAt: coupon.createdAt?.toISOString?.(),
  updatedAt: coupon.updatedAt?.toISOString?.(),
  store: coupon.store
    ? {
        _id: coupon.store._id.toString(),
        name: coupon.store.name,
        storeNetworkUrl: coupon.store.storeNetworkUrl,
        categories: coupon.store.categories,
        totalCouponUsedTimes: coupon.store.totalCouponUsedTimes,
        image: coupon.store.image,
        description: coupon.store.description,
        metaTitle: coupon.store.metaTitle,
        metaDescription: coupon.store.metaDescription,
        metaKeywords: coupon.store.metaKeywords,
        focusKeywords: coupon.store.focusKeywords,
        slug: coupon.store.slug,
        isPopular: coupon.store.isPopular,
        isActive: coupon.store.isActive,
        createdAt: coupon.store.createdAt?.toISOString?.(),
        updatedAt: coupon.store.updatedAt?.toISOString?.(),
      }
    : null,
});

/**
 * Convert a Mongoose document to a plain object safe for Client Components.
 */
const serializeCoupon = (coupon: any) => ({
  _id: coupon._id.toString(),
  title: coupon.title,
  description: coupon.description,
  couponType: coupon.couponType,
  status: coupon.status,
  couponCode: coupon.couponCode,
  expirationDate: coupon.expirationDate?.toISOString?.(),
  couponUrl: coupon.couponUrl,
  storeName: coupon.storeName,
  storeId: coupon.storeId?.toString(),
  isTopOne: coupon.isTopOne ?? false,
  discount: coupon.discount,
  uses: coupon.uses,
  verified: coupon.verified,
  createdAt: coupon.createdAt?.toISOString?.(),
  updatedAt: coupon.updatedAt?.toISOString?.(),
});

/**
 * Create a new coupon.
 */
export const createCoupon = async (data: {
  title: string;
  description?: string;
  couponType: "deal" | "coupon";
  status: "active" | "expired";
  couponCode: string;
  expirationDate: string;
  couponUrl?: string;
  storeName?: string;
  storeId: string;
  isTopOne?: boolean;
  discount?: string;
  uses?: number;
  verified?: boolean;
}): Promise<ReturnType<typeof serializeCoupon>> => {
  const couponData = sanitizeCouponData(data);
  const coupon = await new Coupon(couponData).save();
  return serializeCoupon(coupon);
};

/**
 * Get all coupons, sorted by newest first.
 */
export const getAllCoupons = async (): Promise<
  ReturnType<typeof serializeCoupon>[]
> => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  return coupons.map(serializeCoupon);
};

/**
 * Get a coupon by its ID.
 */
export const getCouponById = async (
  id: string
): Promise<ReturnType<typeof serializeCoupon> | null> => {
  const coupon = await Coupon.findById(id).lean();
  return coupon ? serializeCoupon(coupon) : null;
};

/**
 * Update a coupon by ID.
 */
export const updateCoupon = async (
  id: string,
  data: {
    title: string;
    description?: string;
    couponType: "deal" | "coupon";
    status: "active" | "expired";
    couponCode: string;
    expirationDate: string;
    couponUrl?: string;
    storeName?: string;
    storeId: string;
    isTopOne?: boolean;
    discount?: string;
    uses?: number;
    verified?: boolean;
  }
): Promise<ReturnType<typeof serializeCoupon> | null> => {
  const updatedData = sanitizeCouponData(data);
  const coupon = await Coupon.findByIdAndUpdate(id, { $set: updatedData }, { new: true, runValidators: true }).lean();
  return coupon ? serializeCoupon(coupon) : null;
};

/**
 * Delete a coupon by ID.
 */
export const deleteCoupon = async (
  id: string
): Promise<ReturnType<typeof serializeCoupon> | null> => {
  const coupon = await Coupon.findByIdAndDelete(id).lean();
  return coupon ? serializeCoupon(coupon) : null;
};

/**
 * Get all top coupons (couponType === "coupon" and isTopOne === true), sorted by newest first.
 */
export const getTopCoupons = async (): Promise<ReturnType<typeof serializeCoupon>[]> => {
  const coupons = await Coupon.find({ couponType: "coupon", isTopOne: true })
    .sort({ createdAt: -1 })
    .lean();
  return coupons.map(serializeCoupon);
};

/**
 * Get all top deals (couponType === "deal" and isTopOne === true), sorted by newest first.
 */
export const getTopDeals = async (): Promise<ReturnType<typeof serializeCoupon>[]> => {
  const deals = await Coupon.find({ couponType: "deal", isTopOne: true })
    .sort({ createdAt: -1 })
    .lean();
  return deals.map(serializeCoupon);
};

/**
 * Get all coupons with their associated store data.
 * Uses MongoDB aggregation with $lookup.
 */
export const getAllCouponsWithStores = async () => {
  const couponsWithStores = await Coupon.aggregate([
    {
      $lookup: {
        from: "stores",
        localField: "storeId",
        foreignField: "_id",
        as: "store",
      },
    },
    {
      $unwind: {
        path: "$store",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return couponsWithStores.map(serializeCouponWithStore);
};

/**
 * Get all top coupons (couponType === "coupon" and isTopOne === true) with store data.
 */
export const getTopCouponsWithStores = async () => {
  const couponsWithStores = await Coupon.aggregate([
    {
      $match: { couponType: "coupon", isTopOne: true },
    },
    {
      $lookup: {
        from: "stores",
        localField: "storeId",
        foreignField: "_id",
        as: "store",
      },
    },
    {
      $unwind: {
        path: "$store",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
  return couponsWithStores.map(serializeCouponWithStore);
};

/**
 * Get all top deals (couponType === "deal" and isTopOne === true) with store data.
 */
export const getTopDealsWithStores = async () => {
  const dealsWithStores = await Coupon.aggregate([
    {
      $match: { couponType: "deal", isTopOne: true },
    },
    {
      $lookup: {
        from: "stores",
        localField: "storeId",
        foreignField: "_id",
        as: "store",
      },
    },
    {
      $unwind: {
        path: "$store",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
  return dealsWithStores.map(serializeCouponWithStore);
};
