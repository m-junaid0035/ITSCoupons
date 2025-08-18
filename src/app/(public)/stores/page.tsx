// app/stores/page.tsx (Server Component)
import DiscoverStores from "@/components/stores/DiscoverStores";
import StoreCard from "@/components/stores/StoreCard";

import { fetchAllStoresAction, fetchAllStoresWithCouponsAction } from "@/actions/storeActions";
import { fetchAllCategoriesAction } from "@/actions/categoryActions";

import type { StoreData } from "@/types/store";
import type { StoreWithCouponsData } from "@/types/storesWithCouponsData";
import type { CategoryData } from "@/types/category";

export default async function StorePage() {
  // Fetch all needed data in parallel
  const [discoverStoresResult, storesWithCouponsResult, categoriesResult] = await Promise.allSettled([
    fetchAllStoresAction(), // for DiscoverStores
    fetchAllStoresWithCouponsAction(), // for StoreCard
    fetchAllCategoriesAction(), // categories
  ]);

  // Extract data or fallback to empty arrays
  const discoverStores: StoreData[] =
    discoverStoresResult.status === "fulfilled" ? discoverStoresResult.value?.data ?? [] : [];

  const storesWithCoupons: StoreWithCouponsData[] =
    storesWithCouponsResult.status === "fulfilled" ? storesWithCouponsResult.value?.data ?? [] : [];

  const categories: CategoryData[] =
    categoriesResult.status === "fulfilled" ? categoriesResult.value?.data ?? [] : [];

  return (
    <main>
      <DiscoverStores stores={discoverStores} />
      <StoreCard stores={storesWithCoupons} categories={categories} />
    </main>
  );
}
