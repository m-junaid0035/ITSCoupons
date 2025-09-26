import DashboardPageClient from "./DashboardPageClient";
import {
  fetchDashboardSummaryAction,
  fetchMonthlyTrendsAction,
  fetchCouponsByStatusAction,
  fetchTopStoresByUsageAction,
  fetchCouponsByTypeAction,
  fetchStoreStatusCountsAction,
} from "@/actions/dashboardActions";

export const revalidate = 60; // cache 1 min

export default async function DashboardPage() {
  // Fetch all dashboard data in parallel
  const [
    summaryResult,
    trendsResult,
    couponStatusResult,
    topStoresResult,
    couponTypeResult,
    storeStatusResult,
  ] = await Promise.allSettled([
    fetchDashboardSummaryAction(),
    fetchMonthlyTrendsAction(),
    fetchCouponsByStatusAction(),
    fetchTopStoresByUsageAction(),
    fetchCouponsByTypeAction(),
    fetchStoreStatusCountsAction(),
  ]);

  // Normalize data with safe fallbacks
  const summaryData =
    summaryResult.status === "fulfilled" ? summaryResult.value?.data ?? {} : {};
  const trendsData =
    trendsResult.status === "fulfilled"
      ? trendsResult.value?.data ?? { users: [], stores: [], coupons: [] }
      : { users: [], stores: [], coupons: [] };
  const couponStatusData =
    couponStatusResult.status === "fulfilled"
      ? couponStatusResult.value?.data ?? []
      : [];
  const couponTypeData =
    couponTypeResult.status === "fulfilled" ? couponTypeResult.value?.data ?? [] : [];
  const storeStatusData =
    storeStatusResult.status === "fulfilled"
      ? storeStatusResult.value?.data ?? []
      : [];
  const topStoresData =
    topStoresResult.status === "fulfilled" ? topStoresResult.value?.data ?? [] : [];
  console.log(summaryData)
  return (
    <DashboardPageClient
      summary={summaryData}
      trends={trendsData}
      couponStatus={couponStatusData}
      couponType={couponTypeData}
      storeStatus={storeStatusData}
      topStores={topStoresData}
    />
  );
}
