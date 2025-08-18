"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTags, FaHandshake, FaClock } from "react-icons/fa";
import { CheckCircle, Clock } from "lucide-react";
import type { StoreWithCouponsData } from "@/types/storesWithCouponsData";
import type { CouponData } from "@/types/coupon";
import CouponModal from "@/components/coupon_popup";

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

interface StorePageProps {
  store: StoreWithCouponsData;
  initialActiveTab?: "all" | "promo" | "deal";
}

export default function StorePage({ store, initialActiveTab = "all" }: StorePageProps) {
  const [activeTab, setActiveTab] = useState<"all" | "promo" | "deal">(initialActiveTab);

  const [selectedCoupon, setSelectedCoupon] = useState<CouponData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Client-only image to avoid hydration error
  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => setImageLoaded(true), []);

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

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  React.useEffect(() => setCurrentPage(1), [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 text-gray-800">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 space-y-8">
          <div className="text-center">
            {imageLoaded && (
              <div className="relative mx-auto w-36 h-24 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={store.image || "/placeholder.png"}
                  alt={store.name || "Store Image"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
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
            {paginatedCoupons.length === 0 && (
              <p className="text-center text-gray-500">No coupons found.</p>
            )}
            {paginatedCoupons.map((coupon) => (
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
                      <div className="flex items-center gap-1 text-purple-600 font-medium text-sm">
                        <CheckCircle size={16} /> Coupon verified
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock size={14} /> {coupon.uses || 0} used today
                    </div>
                    {isExpired(coupon) && (
                      <div className="text-red-500 font-medium">Expired</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Coupon Modal */}
      <CouponModal
        storeName={store.name}
        title={selectedCoupon?.title}
        code={selectedCoupon?.couponCode}
        redeemUrl={selectedCoupon?.couponUrl}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
