// app/admin/coupons/page.tsx
import CouponsPageClient from "./CouponsPageClient";
import {
  fetchAllCouponsAction,
  fetchCouponsByStoreAction,
} from "@/actions/couponActions";
import { fetchAllStoresAction } from "@/actions/storeActions";

export default async function CouponsPage({
  searchParams,
}: {
  searchParams?: { storeId?: string };
}) {
  const storeId = searchParams?.storeId || "";

  // Fetch data on server
  let couponsResult;
  if (storeId) {
    couponsResult = await fetchCouponsByStoreAction(storeId);
  } else {
    couponsResult = await fetchAllCouponsAction();
  }

  const storesResult = await fetchAllStoresAction();

  return (
    <CouponsPageClient
      initialCoupons={couponsResult?.data || []}
      initialStores={storesResult?.data || []}
      storeId={storeId}
    />
  );
}
