"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bar, Pie, Line } from "react-chartjs-2";
import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

interface DashboardPageClientProps {
  summary: Record<string, number>;
  trends: { users: any[]; stores: any[]; coupons: any[] };
  couponStatus: any[];
  couponType: any[];
  storeStatus: any[];
  topStores: any[];
}

export default function DashboardPageClient({
  summary,
  trends,
  couponStatus,
  couponType,
  storeStatus,
  topStores,
}: DashboardPageClientProps) {
  // Memoize chart data to avoid unnecessary recalculation
  const trendsChartData = useMemo(() => ({
    labels: trends.users.map((d: any) => `${d._id.month}/${d._id.year}`),
    datasets: [
      {
        label: "Users",
        data: trends.users.map((d: any) => d.count),
        borderColor: "rgb(75, 192, 192)",
        fill: false,
      },
      {
        label: "Stores",
        data: trends.stores.map((d: any) => d.count),
        borderColor: "rgb(255, 159, 64)",
        fill: false,
      },
      {
        label: "Coupons",
        data: trends.coupons.map((d: any) => d.count),
        borderColor: "rgb(153, 102, 255)",
        fill: false,
      },
    ],
  }), [trends]);

  const couponStatusChartData = useMemo(() => ({
    labels: couponStatus.map((c: any) => c.status),
    datasets: [
      {
        data: couponStatus.map((c: any) => c.count),
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  }), [couponStatus]);

  const couponTypeChartData = useMemo(() => ({
    labels: couponType.map((c: any) => c.type),
    datasets: [
      {
        data: couponType.map((c: any) => c.count),
        backgroundColor: ["#4BC0C0", "#9966FF"],
      },
    ],
  }), [couponType]);

  const storeStatusChartData = useMemo(() => ({
    labels: storeStatus.map((s: any) => s.status),
    datasets: [
      {
        data: storeStatus.map((s: any) => s.count),
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  }), [storeStatus]);

  const topStoresChartData = useMemo(() => ({
    labels: topStores.map((s: any) => s.name),
    datasets: [
      {
        label: "Coupon Uses",
        data: topStores.map((s: any) => s.uses),
        backgroundColor: "#36A2EB",
      },
    ],
  }), [topStores]);

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(summary).map(([key, value]) => (
          <Card key={key} className="shadow">
            <CardHeader>
              <CardTitle className="capitalize text-sm">{key}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Creation Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={trendsChartData} />
        </CardContent>
      </Card>

      {/* Coupon Status, Type, Store Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Coupons by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={couponStatusChartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coupons by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={couponTypeChartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={storeStatusChartData} />
          </CardContent>
        </Card>
      </div>

      {/* Top Stores */}
      <Card>
        <CardHeader>
          <CardTitle>Top Stores by Coupon Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={topStoresChartData} />
        </CardContent>
      </Card>
    </div>
  );
}
