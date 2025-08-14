import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Store } from "@/models/Store";
import { Coupon } from "@/models/Coupon";
import { Category } from "@/models/Category";
import { Role } from "@/models/Role";
import type { PipelineStage } from "mongoose";

/**
 * Dashboard summary stats for cards
 */
export async function getDashboardSummary() {
  await connectToDatabase();

  const [
    totalUsers,
    activeUsers,
    totalStores,
    activeStores,
    totalCoupons,
    activeCoupons,
    expiredCoupons,
    totalCategories,
    totalRoles
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Store.countDocuments(),
    Store.countDocuments({ isActive: true }),
    Coupon.countDocuments(),
    Coupon.countDocuments({ status: "active" }),
    Coupon.countDocuments({ status: "expired" }),
    Category.countDocuments(),
    Role.countDocuments(),
  ]);

  return {
    totalUsers,
    activeUsers,
    totalStores,
    activeStores,
    totalCoupons,
    activeCoupons,
    expiredCoupons,
    totalCategories,
    totalRoles,
  };
}

/**
 * Monthly creation trends for line/bar charts
 */
export async function getMonthlyCreationTrends(months: number = 6) {
  await connectToDatabase();

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months + 1);

  const pipeline: PipelineStage[] = [
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ];

  const [users, stores, coupons] = await Promise.all([
    User.aggregate(pipeline),
    Store.aggregate(pipeline),
    Coupon.aggregate(pipeline),
  ]);

  return { users, stores, coupons };
}

/**
 * Coupons grouped by status (pie chart)
 */
export async function getCouponsByStatus() {
  await connectToDatabase();

  const pipeline: PipelineStage[] = [
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ];

  const data = await Coupon.aggregate(pipeline);

  return data.map(item => ({
    status: item._id,
    count: item.count,
  }));
}

/**
 * Top stores by coupon usage (bar chart)
 */
export async function getTopStoresByCouponUsage(limit: number = 10) {
  await connectToDatabase();

  const stores = await Store.find()
    .sort({ totalCouponUsedTimes: -1 })
    .limit(limit)
    .select("name totalCouponUsedTimes")
    .lean();

  return stores.map(store => ({
    name: store.name,
    uses: store.totalCouponUsedTimes,
  }));
}

/**
 * Coupons grouped by type (deal vs coupon) - pie chart
 */
export async function getCouponsByType() {
  await connectToDatabase();

  const pipeline: PipelineStage[] = [
    {
      $group: {
        _id: "$couponType",
        count: { $sum: 1 },
      },
    },
  ];

  const data = await Coupon.aggregate(pipeline);

  return data.map(item => ({
    type: item._id,
    count: item.count,
  }));
}

/**
 * Active vs inactive stores (pie chart)
 */
export async function getStoreStatusCounts() {
  await connectToDatabase();

  const pipeline: PipelineStage[] = [
    {
      $group: {
        _id: "$isActive",
        count: { $sum: 1 },
      },
    },
  ];

  const data = await Store.aggregate(pipeline);

  return data.map(item => ({
    status: item._id ? "Active" : "Inactive",
    count: item.count,
  }));
}
