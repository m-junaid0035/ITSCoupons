"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaTags, FaHandshake, FaClock } from "react-icons/fa";

import { fetchStoreWithCouponsByIdAction } from "@/actions/storeActions";
import type { StoreWithCouponsData } from "@/types/storesWithCouponsData";
import type { CouponData } from "@/types/coupon";
import React from "react";

type StatProps = {
  icon: React.ReactNode;
  value: number;
  label: string;
};

function Stat({ icon, value, label }: StatProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-purple-700 text-lg">{icon}</div>
      <div>
        <div className="text-xl font-bold text-purple-700">{value}</div>
        <div className="text-sm">{label}</div>
      </div>
    </div>
  );
}

function isExpired(coupon: CouponData): boolean {
  if (!coupon.expirationDate) return false;
  const now = new Date();
  const exp = new Date(coupon.expirationDate);
  return exp < now;
}

export default function StorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: storeId } = React.use(params);

  if (!storeId) {
    return <p className="text-center mt-10 text-red-500">Store ID not found in URL.</p>;
  }

  const [store, setStore] = useState<StoreWithCouponsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "coupon" | "deal" | "expired">("all");

  useEffect(() => {
    async function loadStore() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchStoreWithCouponsByIdAction(storeId);
        if (!res?.data) {
          setError("Store not found");
          setStore(null);
        } else {
          setStore(res.data);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load store data");
      }

      setLoading(false);
    }

    loadStore();
  }, [storeId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!store) return null;

  const coupons: CouponData[] = store.coupons || [];

  const filteredCoupons = coupons.filter((coupon) => {
    switch (activeTab) {
      case "all":
        return true;
      case "coupon":
        return coupon.couponType === "coupon";
      case "deal":
        return coupon.couponType === "deal";
      case "expired":
        return isExpired(coupon);
      default:
        return true;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 text-gray-800">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 space-y-8">
          <div className="text-center">
            <img src={store.image} alt={store.name} className="mx-auto w-24 mb-4 rounded-full" />
            <p className="text-sm text-gray-600">{store.description}</p>
          </div>
          <div className="space-y-4">
            <Stat icon={<FaTags />} value={coupons.length} label="Total Coupons" />
            <Stat
              icon={<FaHandshake />}
              value={coupons.filter((c) => c.couponType === "deal").length}
              label="Deals"
            />
            <Stat icon={<FaClock />} value={coupons.filter(isExpired).length} label="Expired Coupons" />
          </div>
        </aside>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Tabs */}
          <div className="flex gap-8 border-b text-sm font-medium mb-6">
            {(["all", "coupon", "deal", "expired"] as const).map((tab) => (
              <button
                key={tab}
                className={`pb-2 ${
                  activeTab === tab
                    ? "border-b-2 border-purple-700 text-purple-700"
                    : "hover:text-purple-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "all" && `All Coupons (${coupons.length})`}
                {tab === "coupon" && `Coupons (${coupons.filter((c) => c.couponType === "coupon").length})`}
                {tab === "deal" && `Deals (${coupons.filter((c) => c.couponType === "deal").length})`}
                {tab === "expired" && `Expired (${coupons.filter(isExpired).length})`}
              </button>
            ))}
          </div>

          {/* Coupons List */}
          <div className="space-y-6">
            {filteredCoupons.length === 0 && <p className="text-center text-gray-500">No coupons found.</p>}
            {filteredCoupons.map((coupon) => {
              const expired = isExpired(coupon);
              return (
                <div key={coupon._id} className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <div className="w-1/6 min-w-[80px] flex items-center justify-center text-white text-lg font-bold p-4 bg-purple-700">
                    {coupon.discount || "—"}
                  </div>
                  <div className="flex-1 p-4 space-y-1">
                    <h3 className="font-semibold">{coupon.title}</h3>
                    <p className="text-sm text-gray-600">{coupon.description}</p>
                    {expired && <span className="text-red-500 text-xs font-medium">Expired</span>}
                  </div>
                  <div className="flex flex-col items-end justify-between p-4 w-[180px]">
                    <button
                      className={`text-sm px-4 py-2 rounded ${
                        expired
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-purple-700 hover:bg-purple-800 text-white"
                      }`}
                      disabled={expired}
                    >
                      Get Coupon Code
                    </button>
                    <div className="text-xs mt-2 text-right">
                      {coupon.verified && <div className="text-purple-600 font-medium">🟣 Verified</div>}
                      <div className="text-gray-500">{coupon.uses || 0} used today</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
