// app/admin/coupons/[id]/edit/page.tsx
import EditCouponForm from "./EditCouponForm";
import { fetchCouponByIdAction } from "@/actions/couponActions";
import { fetchAllStoresAction } from "@/actions/storeActions";

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id = "" } = await params;

  // Server-side fetch
  const [couponRes, storesRes] = await Promise.all([
    fetchCouponByIdAction(id),
    fetchAllStoresAction(),
  ]);

  const coupon = couponRes?.data || null;
  const stores = storesRes?.data || [];

  return (
      <EditCouponForm coupon={coupon} stores={stores} />
  );
}
