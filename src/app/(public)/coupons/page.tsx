// app/coupons/page.tsx
import AllCouponsPage from "@/components/coupons/AllCouponsPage";
import RelatedStores from "@/components/coupons/RelatedStores";

import { fetchAllCouponsWithStoresAction } from "@/actions/couponActions";
import { fetchStoresByCategoriesAction } from "@/actions/storeActions";
import { fetchAllCategoriesAction } from "@/actions/categoryActions";

import type { CouponWithStoreData } from "@/types/couponsWithStoresData";
import type { StoreData } from "@/types/store";
import type { CategoryData } from "@/types/category";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Coupons & Promo Codes - ITSCoupons",
  description:
    "Discover the latest verified coupons, promo codes, and deals from top stores on ITSCoupons. Save money on your favorite brands today.",
  alternates: {
    canonical: "https://itscoupons.com/coupons",
  },
  openGraph: {
    title: "All Coupons & Promo Codes - ITSCoupons",
    description:
      "Discover the latest verified coupons, promo codes, and deals from top stores on ITSCoupons. Save money on your favorite brands today.",
    url: "https://itscoupons.com/coupons",
    type: "website",
    images: [
      {
        url: "https://itscoupons.com/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "ITSCoupons Coupons Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Coupons & Promo Codes - ITSCoupons",
    description:
      "Discover the latest verified coupons, promo codes, and deals from top stores on ITSCoupons. Save money on your favorite brands today.",
    images: ["https://itscoupons.com/images/og-image.png"],
  },
};


export default async function CouponsPage({ searchParams } : { searchParams: Promise<{ couponId?: string; category?: string}>}) {
  // Fetch coupons and categories in parallel
  const { couponId, category } = await searchParams;
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
          category={category}
        />

      <RelatedStores
        stores={relatedStores}
      />
    </div>
  );
}
