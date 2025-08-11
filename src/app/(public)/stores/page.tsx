"use client";

import { useEffect, useState } from "react";

import DiscoverStores from "@/components/stores/DiscoverStores";
import StoreCard from "@/components/stores/StoreCard";

import { fetchAllStoresWithCouponsAction } from "@/actions/storeActions"; // new action to fetch stores with coupons
import { fetchAllCategoriesAction } from "@/actions/categoryActions";

import type { StoreWithCouponsData } from "@/types/storesWithCouponsData"; // extended Store type with coupons
import type { CategoryData } from "@/types/category";

const StorePage = () => {
  const [stores, setStores] = useState<StoreWithCouponsData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  const [loadingStores, setLoadingStores] = useState(true);
  const [errorStores, setErrorStores] = useState<string | null>(null);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  useEffect(() => {
    async function loadStores() {
      setLoadingStores(true);
      setErrorStores(null);

      try {
        const result = await fetchAllStoresWithCouponsAction();
        if (result.error) {
          setErrorStores(result.error.message?.[0] || "Failed to fetch stores");
          setStores([]);
        } else if (result.data && Array.isArray(result.data)) {
          setStores(result.data);
        } else {
          setStores([]);
        }
      } catch (err: any) {
        setErrorStores(err.message || "Failed to fetch stores");
      }
      setLoadingStores(false);
    }

    async function loadCategories() {
      setLoadingCategories(true);
      setErrorCategories(null);

      try {
        const result = await fetchAllCategoriesAction();
        if (result.error) {
          setErrorCategories(result.error.message?.[0] || "Failed to fetch categories");
          setCategories([]);
        } else if (result.data && Array.isArray(result.data)) {
          setCategories(result.data);
        } else {
          setCategories([]);
        }
      } catch (err: any) {
        setErrorCategories(err.message || "Failed to fetch categories");
      }
      setLoadingCategories(false);
    }

    loadStores();
    loadCategories();
  }, []);

  const loading = loadingStores || loadingCategories;
  const error = errorStores || errorCategories;

  return (
    <main>
      <DiscoverStores />
      <StoreCard
        stores={stores}
        categories={categories}
        loading={loading}
        error={error}
      />
    </main>
  );
};

export default StorePage;
