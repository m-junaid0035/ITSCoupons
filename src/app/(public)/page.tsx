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

import {
  fetchAllStoresAction,
  fetchPopularStoresAction,
  fetchRecentlyUpdatedStoresAction,
} from "@/actions/storeActions";
import {
  fetchTopCouponsAction,
  fetchTopDealsAction,
} from "@/actions/couponActions";
import { fetchAllBlogsAction } from "@/actions/blogActions";

interface Store {
  _id: string;
  name: string;
  updatedAt?: string;
}

interface Coupon {
  _id: string;
  title: string;
  couponCode: string;
  expirationDate: string;
  storeName?: string;
  isTopOne?: boolean;
}

interface Deal {
  _id: string;
  title: string;
  description?: string;
  couponCode?: string;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  date: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  focusKeywords?: string[];
}

export default function Home() {
  const [stores, setStores] = useState<Store[]>([]);
  const [popularStores, setPopularStores] = useState<Store[]>([]);
  const [recentlyUpdatedStores, setRecentlyUpdatedStores] = useState<Store[]>([]);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [errorBlogs, setErrorBlogs] = useState<string | null>(null);

  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [loadingDeals, setLoadingDeals] = useState(true);

  useEffect(() => {
    async function loadStores() {
      setLoadingStores(true);
      try {
        const allStoresResult = await fetchAllStoresAction();
        const popularStoresResult = await fetchPopularStoresAction();
        const recentlyUpdatedStoresResult = await fetchRecentlyUpdatedStoresAction();

        setStores(Array.isArray(allStoresResult?.data) ? allStoresResult.data : []);
        setPopularStores(Array.isArray(popularStoresResult?.data) ? popularStoresResult.data : []);
        setRecentlyUpdatedStores(
          Array.isArray(recentlyUpdatedStoresResult?.data)
            ? recentlyUpdatedStoresResult.data
            : []
        );
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
      setLoadingStores(false);
    }

    async function loadCoupons() {
      setLoadingCoupons(true);
      try {
        const result = await fetchTopCouponsAction();
        setCoupons(Array.isArray(result?.data) ? result.data : []);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
      setLoadingCoupons(false);
    }

    async function loadDeals() {
      setLoadingDeals(true);
      try {
        const result = await fetchTopDealsAction();
        setDeals(Array.isArray(result?.data) ? result.data : []);
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
        setBlogs(Array.isArray(result?.data) ? result.data : []);
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

  return (
    <main>
      <HeroSlider />
      <FeaturedStores stores={stores} loading={loadingStores} />
      <PromoCodesSection coupons={coupons} loading={loadingCoupons} />
      <TopDeals deals={deals} loading={loadingDeals} />
      <StoresComponent
        popularStores={popularStores}
        recentlyUpdatedStores={recentlyUpdatedStores}
      />
      <BravoDealInfo />
      <BlogSection blogs={blogs} loading={loadingBlogs} error={errorBlogs} />
      <Newsletter />
    </main>
  );
}
