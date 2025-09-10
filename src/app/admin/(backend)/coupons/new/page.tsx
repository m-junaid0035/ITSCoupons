import { fetchAllStoresAction } from "@/actions/storeActions";

import CouponFormClient from "./CouponFormClient";

export const revalidate = 60; // cache for 1 min

export default async function CouponPage() {
  // ✅ Fetch stores on the server
  const storesRes = await fetchAllStoresAction();
  const stores = Array.isArray(storesRes.data) ? storesRes.data : [];

  return <CouponFormClient stores={stores} />;
}
