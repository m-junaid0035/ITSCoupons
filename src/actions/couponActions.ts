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
  getAllCouponsWithStores,
  getTopCouponsWithStores,
  getTopDealsWithStores,
  getCouponsByStore,
} from "@/functions/couponFunctions";

// ✅ Coupon Validation Schema with new fields
const couponSchema = z.object({
  title: z.string().trim().min(3).max(100),
  description: z.string().optional(),
  couponType: z.enum(["deal", "coupon"]),
  status: z.enum(["active", "expired"]),
  couponCode: z.string().trim().min(2),

  // ✅ expirationDate optional
  expirationDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),

  couponUrl: z.string().url("Invalid URL").optional(),
  storeName: z.string().optional(),
  storeId: z.string().min(1, "Invalid Store ID"),
  isTopOne: z.coerce.boolean().optional().default(false),

  // NEW fields
  discount: z.string().optional(),
  uses: z.number().int().min(0).optional().default(0),
  verified: z.coerce.boolean().optional().default(false),
});

type CouponFormData = z.infer<typeof couponSchema>;

export type CouponFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

// ✅ Helper: Parse FormData to CouponFormData including new fields
function parseCouponFormData(formData: FormData): CouponFormData {
  return {
    title: String(formData.get("title") || ""),
    description: formData.get("description")
      ? String(formData.get("description"))
      : undefined,
    couponType: String(formData.get("couponType") || "coupon") as
      | "deal"
      | "coupon",
    status: String(formData.get("status") || "active") as "active" | "expired",
    couponCode: String(formData.get("couponCode") || ""),

    // ✅ expirationDate only if provided
    expirationDate: formData.get("expirationDate")
      ? String(formData.get("expirationDate"))
      : undefined,

    couponUrl: formData.get("couponUrl")
      ? String(formData.get("couponUrl"))
      : undefined,
    storeName: formData.get("storeName")
      ? String(formData.get("storeName"))
      : undefined,
    storeId: String(formData.get("storeId") || ""),
    isTopOne:
      formData.get("isTopOne") === "true" || formData.get("isTopOne") === "on",
    discount: formData.get("discount")
      ? String(formData.get("discount"))
      : undefined,
    uses: formData.get("uses") ? Number(formData.get("uses")) : 0,
    verified:
      formData.get("verified") === "true" || formData.get("verified") === "on",
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
    if (!coupon) return { error: { message: ["Coupon not found"] } };
    return { data: coupon };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch coupon"] } };
  }
}

// ✅ FETCH TOP COUPONS
export async function fetchTopCouponsAction() {
  await connectToDatabase();
  try {
    const coupons = await getTopCoupons();
    return { data: coupons };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch top coupons"] } };
  }
}

// ✅ FETCH TOP DEALS
export async function fetchTopDealsAction() {
  await connectToDatabase();
  try {
    const deals = await getTopDeals();
    return { data: deals };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch top deals"] } };
  }
}

// ✅ FETCH ALL COUPONS WITH STORE DATA
export async function fetchAllCouponsWithStoresAction() {
  await connectToDatabase();
  try {
    const couponsWithStores = await getAllCouponsWithStores();
    return { data: couponsWithStores };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch coupons with stores"] },
    };
  }
}

// ✅ FETCH TOP COUPONS WITH STORE DATA
export async function fetchTopCouponsWithStoresAction() {
  await connectToDatabase();
  try {
    const coupons = await getTopCouponsWithStores();
    return { data: coupons };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch top coupons with stores"] },
    };
  }
}

// ✅ FETCH TOP DEALS WITH STORE DATA
export async function fetchTopDealsWithStoresAction() {
  await connectToDatabase();
  try {
    const deals = await getTopDealsWithStores();
    return { data: deals };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch top deals with stores"] },
    };
  }
}

// ✅ FETCH COUPONS BY STORE
export async function fetchCouponsByStoreAction(storeId: string) {
  await connectToDatabase();

  if (!storeId) {
    return { error: { message: ["Store ID is required"] } };
  }

  try {
    const coupons = await getCouponsByStore(storeId);
    return { data: coupons };
  } catch (error: any) {
    return {
      error: { message: [error.message || "Failed to fetch coupons for store"] },
    };
  }
}
