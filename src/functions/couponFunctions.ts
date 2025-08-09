import { Coupon } from "@/models/Coupon";
import { Types } from "mongoose";

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
  createdAt: coupon.createdAt?.toISOString?.(),
  updatedAt: coupon.updatedAt?.toISOString?.(),
});

/**
 * Create a new coupon.
 * @param data Coupon input
 * @returns Created coupon object
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
}): Promise<ReturnType<typeof serializeCoupon>> => {
  const couponData = sanitizeCouponData(data);
  const coupon = await new Coupon(couponData).save();
  return serializeCoupon(coupon);
};

/**
 * Get all coupons, sorted by newest first.
 * @returns Array of coupons (plain objects)
 */
export const getAllCoupons = async (): Promise<
  ReturnType<typeof serializeCoupon>[]
> => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  return coupons.map(serializeCoupon);
};

/**
 * Get a coupon by its ID.
 * @param id Coupon ID
 * @returns Coupon (plain object) or null
 */
export const getCouponById = async (
  id: string
): Promise<ReturnType<typeof serializeCoupon> | null> => {
  const coupon = await Coupon.findById(id).lean();
  return coupon ? serializeCoupon(coupon) : null;
};

/**
 * Update a coupon by ID.
 * @param id Coupon ID
 * @param data New coupon data
 * @returns Updated coupon (plain object) or null
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
 * @param id Coupon ID
 * @returns Deleted coupon (plain object) or null
 */
export const deleteCoupon = async (
  id: string
): Promise<ReturnType<typeof serializeCoupon> | null> => {
  const coupon = await Coupon.findByIdAndDelete(id).lean();
  return coupon ? serializeCoupon(coupon) : null;
};

/**
 * Get all top coupons (couponType === "coupon" and isTopOne === true), sorted by newest first.
 * @returns Array of top coupons (plain objects)
 */
export const getTopCoupons = async (): Promise<ReturnType<typeof serializeCoupon>[]> => {
  const coupons = await Coupon.find({ couponType: "coupon", isTopOne: true })
    .sort({ createdAt: -1 })
    .lean();
  return coupons.map(serializeCoupon);
};

/**
 * Get all top deals (couponType === "deal" and isTopOne === true), sorted by newest first.
 * @returns Array of top deals (plain objects)
 */
export const getTopDeals = async (): Promise<ReturnType<typeof serializeCoupon>[]> => {
  const deals = await Coupon.find({ couponType: "deal", isTopOne: true })
    .sort({ createdAt: -1 })
    .lean();
  return deals.map(serializeCoupon);
};