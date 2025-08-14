"use client";

import { useEffect, useState } from "react";
import { FaTags, FaHandshake, FaClock } from "react-icons/fa";
import { fetchStoreWithCouponsByIdAction } from "@/actions/storeActions";
import type { StoreWithCouponsData } from "@/types/storesWithCouponsData";
import type { CouponData } from "@/types/coupon";
import React from "react";

type StatProps = { icon: React.ReactNode; value: number; label: string };

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

function isExpired(coupon: CouponData) {
  if (!coupon.expirationDate) return false;
  return new Date(coupon.expirationDate) < new Date();
}

function getDiscountColor(coupon: CouponData) {
  const discount = coupon.discount || "";

  if (isExpired(coupon)) return "bg-red-500";
  const discountLower = discount.toLowerCase();

  if (discountLower.includes("free ship") || discountLower.includes("free shipping")) {
    return "bg-yellow-400 text-black";
  }

  const match = discountLower.match(/(\d+)%/);
  if (match) {
    const value = parseInt(match[1], 10);
    if (value >= 20) return "bg-purple-700";
    return "bg-orange-500";
  }

  if (coupon.couponType === "coupon") return "bg-green-600";
  if (coupon.couponType === "deal") return "bg-purple-700";

  return "bg-gray-400";
}

// Udemy-style Coupon Modal
function UdemyCouponModal({
  store,
  coupon,
  isOpen,
  onClose,
}: {
  store: StoreWithCouponsData;
  coupon: CouponData | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !coupon) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.couponCode || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
        >
          ×
        </button>

        {/* Body */}
        <div className="p-8">
          {/* Top Badge */}
          <div className="mx-auto -mt-12 mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-[#2b5aa6] text-white shadow-md">
            <span className="text-2xl font-semibold">C</span>
          </div>

          {/* Heading */}
          <h2 className="text-center text-2xl font-semibold text-slate-900">{coupon.title}</h2>
          <p className="mt-3 text-center text-sm text-slate-600">
            Copy and paste this code at{' '}
            <a href={store.storeNetworkUrl || "#"} className="font-medium text-[#2b5aa6] hover:underline">
              {coupon.storeName || "Store"}
            </a>
          </p>

          {/* Code Row */}
          <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
            <div className="rounded-md bg-slate-100 p-1">
              <div className="flex items-center justify-center rounded-md bg-[#8d5ab9]/20 p-3">
                <span className="font-semibold tracking-wider text-[#8d5ab9]">
                  {coupon.couponCode || "No code available"}
                </span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="rounded-md bg-[#7a2db6] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:opacity-100"
            >
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>

          {/* Redeem Button */}
          {store.storeNetworkUrl && (
            <div className="mt-3 flex justify-center">
              <a
                href={store.storeNetworkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-slate-100 px-5 py-2 text-sm font-medium text-[#7a2db6] transition hover:bg-slate-200"
              >
                Redeem at {coupon.storeName || "Store"} ›
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: storeId } = React.use(params);

  const [store, setStore] = useState<StoreWithCouponsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "promo" | "deal">("all");

  // Modal state
  const [selectedCoupon, setSelectedCoupon] = useState<CouponData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      case "promo":
        return coupon.couponType === "coupon";
      case "deal":
        return coupon.couponType === "deal";
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
              value={coupons.filter((c) => c.couponType === "coupon").length}
              label="Promo Codes"
            />
            <Stat
              icon={<FaHandshake />}
              value={coupons.filter((c) => c.couponType === "deal").length}
              label="Deals"
            />
            <Stat
              icon={<FaClock />}
              value={coupons.filter(isExpired).length}
              label="Expired Coupons"
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Tabs */}
          <div className="flex gap-8 border-b text-sm font-medium mb-6">
            {(["all", "promo", "deal"] as const).map((tab) => (
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
                {tab === "promo" &&
                  `Promo Codes (${coupons.filter((c) => c.couponType === "coupon").length})`}
                {tab === "deal" &&
                  `Deals (${coupons.filter((c) => c.couponType === "deal").length})`}
              </button>
            ))}
          </div>

          {/* Coupons List */}
          <div className="space-y-6">
            {filteredCoupons.length === 0 && (
              <p className="text-center text-gray-500">No coupons found.</p>
            )}
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon._id}
                className="flex border border-gray-200 rounded-lg overflow-hidden bg-white"
              >
                <div
                  className={`w-1/6 min-w-[80px] flex items-center justify-center text-white text-lg font-bold p-4 ${getDiscountColor(
                    coupon
                  )}`}
                >
                  {coupon.discount || "Deal"}
                </div>
                <div className="flex-1 p-4 space-y-1">
                  <h3 className="font-semibold">{coupon.title}</h3>
                  <p className="text-sm text-gray-600">{coupon.description}</p>
                </div>
                <div className="flex flex-col items-end justify-between p-4 w-[180px]">
                  <button
                    className={`text-sm px-4 py-2 rounded text-white ${
                      coupon.couponType === "coupon"
                        ? "bg-green-600 hover:bg-green-700"
                        : coupon.couponType === "deal"
                        ? "bg-purple-700 hover:bg-purple-800"
                        : "bg-gray-400"
                    }`}
                    onClick={() => {
                      setSelectedCoupon(coupon);
                      setIsModalOpen(true);
                    }}
                  >
                    {coupon.couponType === "coupon" ? "Get Promo Code" : "Get Deal"}
                  </button>
                  <div className="text-xs mt-2 text-right">
                    {coupon.verified && (
                      <div className="text-purple-600 font-medium">🟣 Verified</div>
                    )}
                    <div className="text-gray-500">{coupon.uses || 0} used today</div>
                    {isExpired(coupon) && (
                      <div className="text-red-500 font-medium">Expired</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Udemy-style Modal */}
      <UdemyCouponModal
        store={store}
        coupon={selectedCoupon}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
