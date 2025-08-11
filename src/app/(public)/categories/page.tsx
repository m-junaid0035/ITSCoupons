"use client";

import { useEffect, useState } from "react";

import Categories from "@/components/categories/Categories";
import CategoriesSearch from "@/components/categories/CategoriesSearch";

import { fetchCategoriesWithCountsAction } from "@/actions/categoryActions"; // your server action

import type { CategoryWithCounts } from "@/types/categoryWithCounts"; // define this accordingly

const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchCategoriesWithCountsAction();
        if (result.error) {
          setError(result.error.message?.[0] || "Failed to fetch categories");
          setCategories([]);
        } else if (result.data && Array.isArray(result.data)) {
          setCategories(result.data);
        } else {
          setCategories([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch categories");
      }
      setLoading(false);
    }

    loadCategories();
  }, []);

  return (
    <main className="p-0 m-0">
      <CategoriesSearch />
      <Categories categories={categories} loading={loading} error={error} />
    </main>
  );
};

export default CategoriesPage;
