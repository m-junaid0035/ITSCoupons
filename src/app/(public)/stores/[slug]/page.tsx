// app/stores/[id]/page.tsx
import StoreData from "@/components/StoreData";
import RelatedStores from "@/components/coupons/RelatedStores";

import { fetchStoreWithCouponsBySlugAction } from "@/actions/storeActions";
import { fetchStoresByCategoriesAction } from "@/actions/storeActions";

import type { StoreData as StoreType } from "@/types/store";
import { StoreWithCouponsData } from "@/types/storesWithCouponsData";

import { Metadata } from "next";

/* ---------------------- Generate Metadata Dynamically ---------------------- */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: "" }>;
}): Promise<Metadata> {
  const { slug = "" } = await params;
  const storeResult = await fetchStoreWithCouponsBySlugAction(slug);
  const store: StoreWithCouponsData | null = storeResult?.data ?? null;

  if (!store) {
    return {
      title: "Store Not Found",
      description: "The store you are looking for does not exist.",
    };
  }

  const metaTitle = store.metaTitle || store.name;
  const metaDescription = store.metaDescription || store.description || "";
  const metaKeywords = (store.metaKeywords ?? store.focusKeywords ?? [store.name]).join(
    ", "
  );

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "website",
      url: `${process.env.DOMAIN}/stores/${store._id}/${store.slug}`,
      images: [
        {
          url: store.image,
          width: 1200,
          height: 630,
          alt: store.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [store.image],
    },
  };
}

/* ---------------------- Store Page Component ---------------------- */
export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: "" }>;
  searchParams: Promise<{ couponId?: ""}>
}) {
  // Await params to get the store ID
  const { slug = "" } = await params;
  const { couponId = "" } = await searchParams;

  // Fetch the store with coupons
  const storeResult = await fetchStoreWithCouponsBySlugAction(decodeURIComponent(slug));
  const store: StoreWithCouponsData | null = storeResult?.data ?? null;

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
      {relatedStores.length > 0 && <RelatedStores stores={relatedStores} />}
    </main>
  );
}
