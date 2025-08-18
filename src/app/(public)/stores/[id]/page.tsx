// app/stores/[id]/page.tsx
import StoreData from "@/components/StoreData";
import RelatedStores from "@/components/coupons/RelatedStores";

import { fetchStoreWithCouponsByIdAction } from "@/actions/storeActions";
import { fetchStoresByCategoriesAction } from "@/actions/storeActions";

import type { StoreData as StoreType } from "@/types/store";

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ couponId?: ""}>
}) {
  // Await params to get the store ID
  const { id: storeId } = await params;
  const { couponId = "" } = await searchParams;
  // Fetch the store with coupons
  const storeResult = await fetchStoreWithCouponsByIdAction(storeId);
  const store: StoreType | null = storeResult?.data ?? null;

  if (!store) {
    return (
      <p className="text-center mt-10 text-red-500">
        Store not found or failed to load.
      </p>
    );
  }

  // Extract category IDs from the current store to fetch related stores
  const storeCategories = store.categories?.map((c: any) => c._id) || [];

  let relatedStores: StoreType[] = [];
  if (storeCategories.length > 0) {
    const relatedStoresResult = await fetchStoresByCategoriesAction(storeCategories);
    relatedStores = relatedStoresResult?.data
      ?.filter((s: StoreType) => s._id !== store._id) // exclude current store
      ?? [];
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
        <StoreData store={store} couponId={couponId} />
      {relatedStores.length > 0 && (
        <RelatedStores stores={relatedStores} />
      )}
    </main>
  );
}
