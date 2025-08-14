"use client";

import { useEffect, useState } from "react";
import {
  fetchDashboardSummaryAction,
  fetchMonthlyTrendsAction,
  fetchCouponsByStatusAction,
  fetchTopStoresByUsageAction,
  fetchCouponsByTypeAction,
  fetchStoreStatusCountsAction,
} from "@/actions/dashboardActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Bar, Pie, Line } from "react-chartjs-2";
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

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [couponStatus, setCouponStatus] = useState<any>(null);
  const [couponType, setCouponType] = useState<any>(null);
  const [storeStatus, setStoreStatus] = useState<any>(null);
  const [topStores, setTopStores] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          summaryRes,
          trendsRes,
          couponStatusRes,
          topStoresRes,
          couponTypeRes,
          storeStatusRes,
        ] = await Promise.all([
          fetchDashboardSummaryAction(),
          fetchMonthlyTrendsAction(),
          fetchCouponsByStatusAction(),
          fetchTopStoresByUsageAction(),
          fetchCouponsByTypeAction(),
          fetchStoreStatusCountsAction(),
        ]);

        if (
          !summaryRes.success ||
          !trendsRes.success ||
          !couponStatusRes.success ||
          !topStoresRes.success ||
          !couponTypeRes.success ||
          !storeStatusRes.success
        ) {
          throw new Error("One or more requests failed");
        }

        setSummary(summaryRes.data);
        setTrends(trendsRes.data);
        setCouponStatus(couponStatusRes.data);
        setCouponType(couponTypeRes.data);
        setStoreStatus(storeStatusRes.data);
        setTopStores(topStoresRes.data);
      } catch (err) {
        setErrorMsg("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      </div>
    );
  }

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
              <p className="text-2xl font-bold">{value as number}</p>
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
          <Line
            data={{
              labels: trends?.users.map(
                (d: any) => `${d._id.month}/${d._id.year}`
              ),
              datasets: [
                {
                  label: "Users",
                  data: trends?.users.map((d: any) => d.count),
                  borderColor: "rgb(75, 192, 192)",
                  fill: false,
                },
                {
                  label: "Stores",
                  data: trends?.stores.map((d: any) => d.count),
                  borderColor: "rgb(255, 159, 64)",
                  fill: false,
                },
                {
                  label: "Coupons",
                  data: trends?.coupons.map((d: any) => d.count),
                  borderColor: "rgb(153, 102, 255)",
                  fill: false,
                },
              ],
            }}
          />
        </CardContent>
      </Card>

      {/* Coupon Status & Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Coupons by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie
              data={{
                labels: couponStatus.map((c: any) => c.status),
                datasets: [
                  {
                    data: couponStatus.map((c: any) => c.count),
                    backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
                  },
                ],
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coupons by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie
              data={{
                labels: couponType.map((c: any) => c.type),
                datasets: [
                  {
                    data: couponType.map((c: any) => c.count),
                    backgroundColor: ["#4BC0C0", "#9966FF"],
                  },
                ],
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie
              data={{
                labels: storeStatus.map((s: any) => s.status),
                datasets: [
                  {
                    data: storeStatus.map((s: any) => s.count),
                    backgroundColor: ["#36A2EB", "#FF6384"],
                  },
                ],
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Top Stores */}
      <Card>
        <CardHeader>
          <CardTitle>Top Stores by Coupon Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={{
              labels: topStores.map((s: any) => s.name),
              datasets: [
                {
                  label: "Coupon Uses",
                  data: topStores.map((s: any) => s.uses),
                  backgroundColor: "#36A2EB",
                },
              ],
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
