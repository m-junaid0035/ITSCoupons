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
  expirationDate?: string;  // ✅ Made optional
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
  expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined, // ✅ Only set if provided
  couponUrl: data.couponUrl?.trim(),
  storeName: data.storeName?.trim(),
  storeId: new Types.ObjectId(data.storeId),
  isTopOne: data.isTopOne ?? false,
  discount: data.discount?.trim(),
  uses: data.uses ?? 0,
  verified: data.verified ?? false,
});

/**
 * Serialize coupon with store data for client-side consumption.
 */
const serializeCouponWithStore = (coupon: any) => ({
  _id: coupon._id.toString(),
  title: coupon.title,
  description: coupon.description,
  couponType: coupon.couponType,
  status: coupon.status,
  couponCode: coupon.couponCode,
  expirationDate: coupon.expirationDate?.toISOString?.(), // ✅ Already optional
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
        categories:
          coupon.store.categories?.map((cat: any) =>
            cat.toString ? cat.toString() : cat
          ) || [],
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
 * Serialize coupon without store.
 */
const serializeCoupon = (coupon: any) => ({
  _id: coupon._id.toString(),
  title: coupon.title,
  description: coupon.description,
  couponType: coupon.couponType,
  status: coupon.status,
  couponCode: coupon.couponCode,
  expirationDate: coupon.expirationDate?.toISOString?.(), // ✅ Safe optional
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
  expirationDate?: string;  // ✅ Optional now
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
 * Get a coupon by ID.
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
    expirationDate?: string;  // ✅ Optional now
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
  const coupon = await Coupon.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();
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
 * Get top coupons (couponType === "coupon" && isTopOne).
 */
export const getTopCoupons = async (): Promise<
  ReturnType<typeof serializeCoupon>[]
> => {
  const coupons = await Coupon.find({ couponType: "coupon", isTopOne: true })
    .sort({ createdAt: -1 })
    .lean();
  return coupons.map(serializeCoupon);
};

/**
 * Get top deals (couponType === "deal" && isTopOne).
 */
export const getTopDeals = async (): Promise<
  ReturnType<typeof serializeCoupon>[]
> => {
  const deals = await Coupon.find({ couponType: "deal", isTopOne: true })
    .sort({ createdAt: -1 })
    .lean();
  return deals.map(serializeCoupon);
};

/**
 * Get all coupons with store info.
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
    { $unwind: { path: "$store", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ]);
  return couponsWithStores.map(serializeCouponWithStore);
};

/**
 * Get top coupons with store info.
 */
export const getTopCouponsWithStores = async () => {
  const couponsWithStores = await Coupon.aggregate([
    { $match: { couponType: "coupon", isTopOne: true } },
    {
      $lookup: {
        from: "stores",
        localField: "storeId",
        foreignField: "_id",
        as: "store",
      },
    },
    { $unwind: { path: "$store", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ]);
  return couponsWithStores.map(serializeCouponWithStore);
};

/**
 * Get top deals with store info.
 */
export const getTopDealsWithStores = async () => {
  const dealsWithStores = await Coupon.aggregate([
    { $match: { couponType: "deal", isTopOne: true } },
    {
      $lookup: {
        from: "stores",
        localField: "storeId",
        foreignField: "_id",
        as: "store",
      },
    },
    { $unwind: { path: "$store", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ]);
  return dealsWithStores.map(serializeCouponWithStore);
};

/**
 * Get all coupons for a specific store.
 */
export const getCouponsByStore = async (
  storeId: string
): Promise<ReturnType<typeof serializeCoupon>[]> => {
  const coupons = await Coupon.find({ storeId: new Types.ObjectId(storeId) })
    .sort({ createdAt: -1 })
    .lean();
  return coupons.map(serializeCoupon);
};


/**
 * Update a coupon partially (inline updates like isTopOne, verified)
 * Does NOT require title, couponCode, or other mandatory fields.
 */
export const updateCouponInline = async (
  id: string,
  data: Partial<{
    title: string;
    isTopOne: boolean;
    verified: boolean;
    discount: string;
    uses: number;
  }>
) => {
  // Only keep defined values to avoid overwriting existing fields with undefined
  const updateData: Record<string, any> = {};

  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.isTopOne !== undefined) updateData.isTopOne = data.isTopOne;
  if (data.verified !== undefined) updateData.verified = data.verified;
  if (data.discount !== undefined) updateData.discount = data.discount.trim();
  if (data.uses !== undefined) updateData.uses = data.uses;

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields to update");
  }

  const updated = await Coupon.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  ).lean();

  if (!updated) throw new Error("Coupon not found");

  return serializeCoupon(updated);
};

/**
 * Increment the 'uses' count of a coupon by 1.
 */
export const incrementCouponUses = async (couponId: string) => {
  const updated = await Coupon.findByIdAndUpdate(
    couponId,
    { $inc: { uses: 1 } },
    { new: true }
  ).lean();

  if (!updated) {
    throw new Error("Coupon not found");
  }

  return serializeCoupon(updated);
};
