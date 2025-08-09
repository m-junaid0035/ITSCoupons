"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  getTopCoupons,
  getTopDeals,
} from "@/functions/couponFunctions";

// ✅ Coupon Validation Schema
const couponSchema = z.object({
  title: z.string().trim().min(3).max(100),
  description: z.string().optional(),
  couponType: z.enum(["deal", "coupon"]),
  status: z.enum(["active", "expired"]),
  couponCode: z.string().trim().min(2),
  expirationDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  couponUrl: z.string().url("Invalid URL").optional(),
  storeName: z.string().optional(),
  storeId: z.string().min(1, "Invalid Store ID"),
  isTopOne: z.coerce.boolean().optional().default(false),
});

type CouponFormData = z.infer<typeof couponSchema>;

export type CouponFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

// ✅ Helper: Parse FormData to CouponFormData
function parseCouponFormData(formData: FormData): CouponFormData {
  return {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    couponType: String(formData.get("couponType") || "coupon") as "deal" | "coupon",
    status: String(formData.get("status") || "active") as "active" | "expired",
    couponCode: String(formData.get("couponCode") || ""),
    expirationDate: String(formData.get("expirationDate") || ""),
    couponUrl: String(formData.get("couponUrl") || ""),
    storeName: String(formData.get("storeName") || ""),
    storeId: String(formData.get("storeId") || ""),
    isTopOne: formData.get("isTopOne") === "true" || formData.get("isTopOne") === "on",
  };
}

// ✅ CREATE COUPON
export async function createCouponAction(
  prevState: CouponFormState,
  formData: FormData
): Promise<CouponFormState> {
  await connectToDatabase();

  const parsed = parseCouponFormData(formData);
  const result = couponSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const coupon = await createCoupon(result.data);
    return { data: coupon };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to create coupon"] } };
  }
}

// ✅ UPDATE COUPON
export async function updateCouponAction(
  prevState: CouponFormState,
  id: string,
  formData: FormData
): Promise<CouponFormState> {
  await connectToDatabase();

  const parsed = parseCouponFormData(formData);
  const result = couponSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const updated = await updateCoupon(id, result.data);
    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update coupon"] } };
  }
}

// ✅ DELETE COUPON
export async function deleteCouponAction(id: string) {
  await connectToDatabase();
  try {
    const deleted = await deleteCoupon(id);
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete coupon"] } };
  }
}

// ✅ FETCH ALL COUPONS
export async function fetchAllCouponsAction() {
  await connectToDatabase();
  try {
    const coupons = await getAllCoupons();
    return { data: coupons };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch coupons"] } };
  }
}

// ✅ FETCH SINGLE COUPON
export async function fetchCouponByIdAction(id: string) {
  await connectToDatabase();
  try {
    const coupon = await getCouponById(id);
    if (!coupon) {
      return { error: { message: ["Coupon not found"] } };
    }
    return { data: coupon };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch coupon"] } };
  }
}

export async function fetchTopCouponsAction() {
  await connectToDatabase();
  try {
    const coupons = await getTopCoupons();
    return { data: coupons };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch top coupons"] } };
  }
}

export async function fetchTopDealsAction() {
  await connectToDatabase();
  try {
    const deals = await getTopDeals();
    return { data: deals };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch top deals"] } };
  }
}

