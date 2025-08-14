"use server";

import {
  getDashboardSummary,
  getMonthlyCreationTrends,
  getCouponsByStatus,
  getTopStoresByCouponUsage,
  getCouponsByType,
  getStoreStatusCounts
} from "@/functions/dashboardFunctions";

/**
 * Utility to safely extract error message
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}

/**
 * Action: Get dashboard summary stats
 */
export async function fetchDashboardSummaryAction() {
  try {
    const data = await getDashboardSummary();
    return { success: true, data };
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Action: Get monthly creation trends
 */
export async function fetchMonthlyTrendsAction(months = 6) {
  try {
    const data = await getMonthlyCreationTrends(months);
    return { success: true, data };
  } catch (error) {
    console.error("Monthly Trends Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Action: Get coupons grouped by status
 */
export async function fetchCouponsByStatusAction() {
  try {
    const data = await getCouponsByStatus();
    return { success: true, data };
  } catch (error) {
    console.error("Coupons By Status Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Action: Get top stores by coupon usage
 */
export async function fetchTopStoresByUsageAction(limit = 10) {
  try {
    const data = await getTopStoresByCouponUsage(limit);
    return { success: true, data };
  } catch (error) {
    console.error("Top Stores By Usage Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Action: Get coupons grouped by type
 */
export async function fetchCouponsByTypeAction() {
  try {
    const data = await getCouponsByType();
    return { success: true, data };
  } catch (error) {
    console.error("Coupons By Type Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Action: Get store status counts
 */
export async function fetchStoreStatusCountsAction() {
  try {
    const data = await getStoreStatusCounts();
    return { success: true, data };
  } catch (error) {
    console.error("Store Status Counts Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}
