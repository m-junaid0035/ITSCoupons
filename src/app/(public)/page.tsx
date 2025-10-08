// app/page.tsx (Server Component by default)
import HeroSlider from "@/components/HeroSlider";
import FeaturedStores from "@/components/FeaturedStores";
import PromoCodesSection from "@/components/PromoCodesSection";
import TopDeals from "@/components/TopDeals";
import StoresComponent from "@/components/StoresComponent";
import BravoDealInfo from "@/components/BravoDealInfo";
import BlogSection from "@/components/BlogSection";
import Newsletter from "@/components/Newsletter";

import { fetchLatestHomeDescriptionAction } from "@/actions/homeDesActions";
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
import { fetchAllEventsAction } from "@/actions/eventActions";

import type { EventData } from "@/types/event";
import type { StoreData } from "@/types/store"; // ✅ Make sure this type exists

// ✅ Create a new type that combines EventData with full store object
type EventWithStore = Omit<EventData, "store"> & { store: StoreData | null };

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ couponId?: string }>;
}) {
  const { couponId = "" } = await searchParams;

  // ✅ Fetch everything in parallel for performance
  const [
    storesResult,
    popularStoresResult,
    recentStoresResult,
    couponsResult,
    dealsResult,
    blogsResult,
    homeDescResult,
    eventsResult,
  ] = await Promise.allSettled([
    fetchAllActiveStoresAction(),
    fetchPopularStoresAction(),
    fetchRecentlyUpdatedStoresAction(),
    fetchTopCouponsWithStoresAction(),
    fetchTopDealsWithStoresAction(),
    fetchAllBlogsAction(),
    fetchLatestHomeDescriptionAction(),
    fetchAllEventsAction(),
  ]);

  // ✅ Extract data safely with fallbacks
  const stores: StoreData[] =
    storesResult.status === "fulfilled" ? storesResult.value?.data ?? [] : [];

  const popularStores =
    popularStoresResult.status === "fulfilled"
      ? popularStoresResult.value?.data ?? []
      : [];

  const recentlyUpdatedStores =
    recentStoresResult.status === "fulfilled"
      ? recentStoresResult.value?.data ?? []
      : [];

  const coupons =
    couponsResult.status === "fulfilled"
      ? couponsResult.value?.data ?? []
      : [];

  const deals =
    dealsResult.status === "fulfilled" ? dealsResult.value?.data ?? [] : [];

  const blogs =
    blogsResult.status === "fulfilled" ? blogsResult.value?.data ?? [] : [];

  const homeDescription =
    homeDescResult.status === "fulfilled"
      ? homeDescResult.value?.data?.description ?? ""
      : "";

  const events: EventData[] =
    eventsResult.status === "fulfilled" && Array.isArray(eventsResult.value?.data)
      ? eventsResult.value.data
      : [];

  // ✅ STEP 1: Enrich events with full store details
  const eventsWithStoreDetails: EventWithStore[] = events.map((event) => {
    const storeDetail = stores.find((s) => s._id === event.store) || null;
    return {
      ...event,
      store: storeDetail,
    };
  });

  // ✅ STEP 2: Return page with enriched events passed to HeroSlider
  return (
    <main>
      {/* ✅ Pass enriched events to HeroSlider */}
      <HeroSlider events={eventsWithStoreDetails} />

      <FeaturedStores stores={stores} />
      <PromoCodesSection coupons={coupons} couponId={couponId} />
      <TopDeals deals={deals} couponId={couponId} />
      <StoresComponent
        popularStores={popularStores}
        recentlyUpdatedStores={recentlyUpdatedStores}
      />
      <BravoDealInfo description={homeDescription} />
      <BlogSection blogs={blogs} />
      <Newsletter />
    </main>
  );
}
