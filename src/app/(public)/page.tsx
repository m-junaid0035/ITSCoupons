// app/page.tsx (Server Component by default)
import HeroSlider from "@/components/HeroSlider";
import FeaturedStores from "@/components/FeaturedStores";
import PromoCodesSection from "@/components/PromoCodesSection";
import TopDeals from "@/components/TopDeals";
import StoresComponent from "@/components/StoresComponent";
import BravoDealInfo from "@/components/BravoDealInfo";
import BlogSection from "@/components/BlogSection";
import Newsletter from "@/components/Newsletter";

import {
  fetchAllActiveStoresAction,
  fetchPopularStoresAction,
  fetchRecentlyUpdatedStoresAction,
} from "@/actions/storeActions";
import {
  fetchTopCouponsWithStoresAction,
  fetchTopDealsWithStoresAction,
} from "@/actions/couponActions";
import { fetchAllBlogsAction } from "@/actions/blogActions";

export default async function Home({ searchParams } : { searchParams: Promise<{ couponId?: ""}>}) {
  // Fetch coupons and categories in parallel
  const { couponId = "" } = await searchParams;

  // Fetch all APIs in parallel
  const [
    storesResult,
    popularStoresResult,
    recentStoresResult,
    couponsResult,
    dealsResult,
    blogsResult,
  ] = await Promise.allSettled([
    fetchAllActiveStoresAction(),
    fetchPopularStoresAction(),
    fetchRecentlyUpdatedStoresAction(),
    fetchTopCouponsWithStoresAction(),
    fetchTopDealsWithStoresAction(),
    fetchAllBlogsAction(),
  ]);

  // Extract data or fallback to empty array
  const stores = storesResult.status === "fulfilled" ? storesResult.value?.data ?? [] : [];
  const popularStores = popularStoresResult.status === "fulfilled" ? popularStoresResult.value?.data ?? [] : [];
  const recentlyUpdatedStores = recentStoresResult.status === "fulfilled" ? recentStoresResult.value?.data ?? [] : [];
  const coupons = couponsResult.status === "fulfilled" ? couponsResult.value?.data ?? [] : [];
  const deals = dealsResult.status === "fulfilled" ? dealsResult.value?.data ?? [] : [];
  const blogs = blogsResult.status === "fulfilled" ? blogsResult.value?.data ?? [] : [];

  return (
    <main>
      <HeroSlider />
      <FeaturedStores stores={stores} />
      <PromoCodesSection coupons={coupons} couponId={couponId} />
      <TopDeals deals={deals} couponId={couponId} />
      <StoresComponent popularStores={popularStores} recentlyUpdatedStores={recentlyUpdatedStores} />
      <BravoDealInfo />
      <BlogSection blogs={blogs} />
      <Newsletter />
    </main>
  );
}
