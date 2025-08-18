// app/coupons/page.tsx
import AllCouponsPage from "@/components/coupons/AllCouponsPage";
import RelatedStores from "@/components/coupons/RelatedStores";

import { fetchAllCouponsWithStoresAction } from "@/actions/couponActions";
import { fetchStoresByCategoriesAction } from "@/actions/storeActions";
import { fetchAllCategoriesAction } from "@/actions/categoryActions";

import type { CouponWithStoreData } from "@/types/couponsWithStoresData";
import type { StoreData } from "@/types/store";
import type { CategoryData } from "@/types/category";

export default async function CouponsPage({ searchParams } : { searchParams: Promise<{ couponId?: ""}>}) {
  // Fetch coupons and categories in parallel
  const { couponId = "" } = await searchParams;
  const [couponsResult, categoriesResult] = await Promise.allSettled([
    fetchAllCouponsWithStoresAction(),
    fetchAllCategoriesAction(),
  ]);

  // Extract data or fallback to empty array
  const coupons: CouponWithStoreData[] = couponsResult.status === "fulfilled" ? couponsResult.value?.data ?? [] : [];
  const categories: CategoryData[] = categoriesResult.status === "fulfilled" ? categoriesResult.value?.data ?? [] : [];

  // Extract unique categories from coupons for related stores
  const allCouponCategories = coupons
    .map(coupon => coupon.store?.categories || [])
    .flat();
  const uniqueCategories = Array.from(new Set(allCouponCategories));

  // Fetch related stores based on categories
  let relatedStores: StoreData[] = [];
  if (uniqueCategories.length > 0) {
    const storesResult = await fetchStoresByCategoriesAction(uniqueCategories);
    relatedStores = storesResult?.data ?? [];
  }

  return (
    <div>
        <AllCouponsPage
          coupons={coupons}
          categories={categories}
          couponId={couponId}
        />

      <RelatedStores
        stores={relatedStores}
      />
    </div>
  );
}
