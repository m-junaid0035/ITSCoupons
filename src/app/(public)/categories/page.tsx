// app/categories/page.tsx (Server Component)
import Categories from "@/components/categories/Categories";
import CategoriesSearch from "@/components/categories/CategoriesSearch";

import {
  fetchCategoriesWithCountsAction,
  fetchAllCategoriesAction,
} from "@/actions/categoryActions";
import type { CategoryWithCounts } from "@/types/categoryWithCounts";
import type { CategoryData } from "@/types/category";

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
