"use client";

import { useEffect, useState } from "react";

import AllCouponsPage from "@/components/coupons/AllCouponsPage";
import RelatedStores from "@/components/coupons/RelatedStores";

import { fetchAllCouponsWithStoresAction } from "@/actions/couponActions";
import { fetchStoresByCategoriesAction } from "@/actions/storeActions"; // import your new action here

import type { CouponWithStoreData } from "@/types/couponsWithStoresData";
import type { StoreData } from "@/types/store";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponWithStoreData[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [errorCoupons, setErrorCoupons] = useState<string | null>(null);

  const [relatedStores, setRelatedStores] = useState<StoreData[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [errorStores, setErrorStores] = useState<string | null>(null);

  useEffect(() => {
    async function loadCoupons() {
      setLoadingCoupons(true);
      setErrorCoupons(null);

      try {
        const result = await fetchAllCouponsWithStoresAction();
        if (result.error) {
          setErrorCoupons(result.error.message?.[0] || "Failed to fetch coupons");
          setCoupons([]);
        } else if (result.data && Array.isArray(result.data)) {
          setCoupons(result.data);
        } else {
          setCoupons([]);
        }
      } catch (err: any) {
        setErrorCoupons(err.message || "Failed to fetch coupons");
      }

      setLoadingCoupons(false);
    }

    loadCoupons();
  }, []);

  // When coupons update, extract categories and fetch related stores
  useEffect(() => {
    async function loadRelatedStores() {
      if (coupons.length === 0) {
        setRelatedStores([]);
        return;
      }

      // Extract all categories from coupons' stores, flatten and deduplicate
      const allCategories = coupons
        .map(coupon => coupon.store?.categories || [])
        .flat();

      const uniqueCategories = Array.from(new Set(allCategories));

      if (uniqueCategories.length === 0) {
        setRelatedStores([]);
        return;
      }

      setLoadingStores(true);
      setErrorStores(null);

      try {
        const result = await fetchStoresByCategoriesAction(uniqueCategories);
        if (result.error) {
          setErrorStores(result.error.message?.[0] || "Failed to fetch related stores");
          setRelatedStores([]);
        } else if (result.data && Array.isArray(result.data)) {
          setRelatedStores(result.data);
        } else {
          setRelatedStores([]);
        }
      } catch (err: any) {
        setErrorStores(err.message || "Failed to fetch related stores");
      }

      setLoadingStores(false);
    }

    loadRelatedStores();
  }, [coupons]);

  return (
    <div>
      <AllCouponsPage coupons={coupons} loading={loadingCoupons} error={errorCoupons} />

      <RelatedStores stores={relatedStores} loading={loadingStores} error={errorStores} />
    </div>
  );
}
