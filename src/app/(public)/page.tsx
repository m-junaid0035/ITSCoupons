"use client";

import { useEffect, useState } from "react";

import BlogSection from "@/components/BlogSection";
import BravoDealInfo from "@/components/BravoDealInfo";
import FeaturedStores from "@/components/FeaturedStores";
import HeroSlider from "@/components/HeroSlider";
import Newsletter from "@/components/Newsletter";
import PromoCodesSection from "@/components/PromoCodesSection";
import StoresComponent from "@/components/StoresComponent";
import TopDeals from "@/components/TopDeals";

import { fetchAllActiveStoresAction } from "@/actions/storeActions";
import { fetchTopCouponsAction, fetchTopDealsAction } from "@/actions/couponActions";
import { fetchAllBlogsAction } from "@/actions/blogActions";

import type { StoreData } from "@/types/store";
import type { CouponData } from "@/types/coupon";
import type { BlogData } from "@/types/blog";

export default function Home() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [deals, setDeals] = useState<CouponData[]>([]);
  const [blogs, setBlogs] = useState<BlogData[]>([]);

  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const [errorBlogs, setErrorBlogs] = useState<string | null>(null);

  useEffect(() => {
    async function loadStores() {
      setLoadingStores(true);
      try {
        const result = await fetchAllActiveStoresAction();
        const storeArray = Array.isArray(result?.data) ? result.data : [];
        setStores(storeArray);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
      setLoadingStores(false);
    }

    async function loadCoupons() {
      setLoadingCoupons(true);
      try {
        const result = await fetchTopCouponsAction();
        const couponsArray = Array.isArray(result?.data) ? result.data : [];
        setCoupons(couponsArray);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
      setLoadingCoupons(false);
    }

    async function loadDeals() {
      setLoadingDeals(true);
      try {
        const result = await fetchTopDealsAction();
        const dealsArray = Array.isArray(result?.data) ? result.data : [];
        setDeals(dealsArray);
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
      setLoadingDeals(false);
    }

    async function loadBlogs() {
      setLoadingBlogs(true);
      setErrorBlogs(null);
      try {
        const result = await fetchAllBlogsAction();
        const blogsArray = Array.isArray(result?.data) ? result.data : [];
        setBlogs(blogsArray);
      } catch (error: any) {
        console.error("Error fetching blogs:", error);
        setErrorBlogs(error.message || "Error fetching blogs");
      }
      setLoadingBlogs(false);
    }

    loadStores();
    loadCoupons();
    loadDeals();
    loadBlogs();
  }, []);

  const popularStores = stores.filter(store => store.isPopular);
  const recentlyUpdatedStores = [...stores]
    .sort((a, b) => new Date(b.updatedAt || "").getTime() - new Date(a.updatedAt || "").getTime())
    .slice(0, 12);

  return (
    <main>
      <HeroSlider />
      <FeaturedStores stores={stores} loading={loadingStores} />
      <PromoCodesSection coupons={coupons} loading={loadingCoupons} />
      <TopDeals deals={deals} loading={loadingDeals} />
      <StoresComponent popularStores={popularStores} recentlyUpdatedStores={recentlyUpdatedStores} />
      <BravoDealInfo />

      <BlogSection blogs={blogs} loading={loadingBlogs} error={errorBlogs} />

      <Newsletter />
    </main>
  );
}
