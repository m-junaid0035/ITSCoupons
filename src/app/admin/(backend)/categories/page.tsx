import { fetchAllCategoriesAction } from "@/actions/categoryActions";
import CategoriesPageClient from "./CategoriesPageClient";

export const revalidate = 60; // ISR cache

export default async function CategoriesPage() {
  const result = await fetchAllCategoriesAction();

  const categories =
    result && "data" in result && Array.isArray(result.data)
      ? (result.data as any[])
      : [];

  return <CategoriesPageClient initialCategories={categories} />;
}
