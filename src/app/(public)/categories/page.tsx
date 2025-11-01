// app/categories/page.tsx (Server Component)
import Categories from "@/components/categories/Categories";
import CategoriesSearch from "@/components/categories/CategoriesSearch";

import {
  fetchCategoriesWithCountsAction,
  fetchAllCategoriesAction,
} from "@/actions/categoryActions";
import type { CategoryWithCounts } from "@/types/categoryWithCounts";
import type { CategoryData } from "@/types/category";
import { Metadata } from "next";
export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = "force-dynamic"; // Prevent static caching

export const metadata: Metadata = {
  title: "All Categories - ITSCoupons",
  description:
    "Explore all categories on ITSCoupons to find coupons, promo codes, and deals for your favorite brands and stores.",
  alternates: {
    canonical: `${process.env.DOMAIN}/categories`,
  },
  openGraph: {
    title: "All Categories - ITSCoupons",
    description:
      "Browse categories on ITSCoupons and discover verified coupons and promo codes across top brands.",
    url: `${process.env.DOMAIN}/categories`,
    type: "website",
    images: [
      {
        url: `${process.env.DOMAIN}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ITSCoupons Categories Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Categories - ITSCoupons",
    description:
      "Find coupons and deals organized by categories at ITSCoupons. Save on top brands easily.",
    images: [`${process.env.DOMAIN}/images/og-image.png`],
  },
};

export default async function CategoriesPage() {
  // ✅ Fetch both APIs in parallel
  const [allCategoriesResult, categoriesWithCountsResult] =
    await Promise.allSettled([
      fetchAllCategoriesAction(),
      fetchCategoriesWithCountsAction(),
    ]);

  // ✅ Extract data or fallback
  const allCategories: CategoryData[] =
    allCategoriesResult.status === "fulfilled" && Array.isArray(allCategoriesResult.value?.data)
      ? allCategoriesResult.value.data
      : [];

  const categoriesWithCounts: CategoryWithCounts[] =
    categoriesWithCountsResult.status === "fulfilled" && Array.isArray(categoriesWithCountsResult.value?.data)
      ? categoriesWithCountsResult.value.data
      : [];

  return (
    <main className="p-0 m-0">
      {/* Uses plain categories (CategoryData[]) */}
      <CategoriesSearch categories={allCategories} />

      {/* Uses categories with counts (CategoryWithCounts[]) */}
      <Categories categories={categoriesWithCounts} />
    </main>
  );
}
