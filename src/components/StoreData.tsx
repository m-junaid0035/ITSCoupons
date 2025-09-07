"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTags, FaHandshake, FaClock } from "react-icons/fa";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import type { StoreWithCouponsData } from "@/types/storesWithCouponsData";
import type { CouponData } from "@/types/coupon";
import CouponModal from "@/components/coupon_popup";

/* ───────── Helpers ───────── */
function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
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

function extractPercent(discount?: string) {
  if (!discount) return 0;
  const match = discount.match(/(\d+)%/);
  return match ? parseInt(match[1], 10) : 0;
}

/* ───────── Component ───────── */
interface StorePageProps {
  store: StoreWithCouponsData;
  couponId: string;
  initialActiveTab?: "all" | "promo" | "deal";
}

export default function StorePage({
  store,
  couponId,
  initialActiveTab = "all",
}: StorePageProps) {
  const [activeTab, setActiveTab] = useState<"all" | "promo" | "deal">(initialActiveTab);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Client-only image
  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => setImageLoaded(true), []);

  // Mobile dropdown state
  const [showStoreInfo, setShowStoreInfo] = useState(false);

  const coupons: CouponData[] = store.coupons || [];
  const filteredCoupons = coupons.filter((coupon) => {
    switch (activeTab) {
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
  useEffect(() => setCurrentPage(1), [activeTab]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Auto open modal if couponId in URL
  useEffect(() => {
    if (couponId) {
      const coupon = coupons.find((c) => c._id === couponId);
      if (coupon) {
        setSelectedCoupon(coupon);
        setIsModalOpen(true);
      }
    }
  }, [couponId, coupons]);

  // Handle click
  const handleOpenCouponNewTab = (coupon: CouponData) => {
    const modalUrl = `/stores/${store._id}?couponId=${coupon._id}`;
    window.open(modalUrl, "_blank", "noopener,noreferrer");

    if (coupon.couponUrl) {
      window.location.href = coupon.couponUrl;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 text-gray-800">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block w-full md:w-1/4 space-y-8">
          <div className="text-left">
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
            <div
              className="text-sm text-gray-600 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: store.description || "" }}
            />
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

        {/* Mobile dropdown for store info */}
        <div className="block md:hidden mb-6">
          <button
            onClick={() => setShowStoreInfo((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 bg-purple-100 rounded-lg text-purple-700 font-semibold"
          >
            Store Info
            {showStoreInfo ? <IoChevronUp /> : <IoChevronDown />}
          </button>
          {showStoreInfo && (
            <div className="mt-4 p-4 border rounded-lg bg-white shadow space-y-6">
              <div className="text-center">
                {imageLoaded && (
                  <div className="relative mx-auto w-28 h-20 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={store.image || "/placeholder.png"}
                      alt={store.name || "Store Image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div
                  className="text-sm text-gray-600 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: store.description || "" }}
                />
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
            </div>
          )}
        </div>

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

            {paginatedCoupons.map((coupon) => {
              const percent = extractPercent(coupon.discount);
              const userSaved = (percent / 100) * 100;
              const avgSavings = (percent / 100) * 50;

              return (
                <div
                  key={coupon._id}
                  className="flex items-stretch border border-gray-200 rounded-xl bg-white shadow-md overflow-hidden"
                >
                  {/* Left Discount Section */}
                  <div className="flex flex-col items-center justify-center min-w-[90px] md:min-w-[120px] p-3 md:p-6 text-purple-700 font-bold">
                    <span className="text-[10px] md:text-sm uppercase">Up To</span>
                    <span className="text-lg md:text-3xl">{coupon.discount || "0%"}</span>
                    <span className="text-[10px] md:text-sm uppercase">Off</span>
                  </div>

                  {/* Middle Content */}
                  <div className="flex-1 p-3 md:p-6">
                    <div className="inline-block bg-gray-100 text-gray-700 text-[10px] md:text-xs font-semibold px-1.5 py-0.5 rounded mb-2 md:mb-3">
                      {coupon.couponType === "coupon" ? "Code" : "Deal"}
                    </div>
                    <h3 className="font-semibold text-sm md:text-xl text-gray-900 mb-2 md:mb-3 line-clamp-2">
                      {coupon.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 md:gap-3 text-[10px] md:text-sm">
                      {coupon.verified && (
                        <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium">
                          Verified
                        </span>
                      )}
                      <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                        User saved ${userSaved.toFixed(2)}
                      </span>
                      <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        Avg savings: ${avgSavings.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col items-center justify-center min-w-[120px] md:min-w-[200px] p-3 md:p-6 border-l border-gray-100">
                    <button
                      onClick={() => handleOpenCouponNewTab(coupon)}
                      className="relative bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs md:text-base px-4 md:px-8 py-2 md:py-3 rounded-full"
                    >
                      Show Code
                      <span className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-white to-purple-700 rounded-tr-md"></span>
                    </button>
                    <button className="text-xs md:text-sm text-gray-500 mt-2 md:mt-3 hover:underline">
                      See Details +
                    </button>
                  </div>
                </div>
              );
            })}
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
        discount={selectedCoupon?.discount}
        code={selectedCoupon?.couponCode}
        redeemUrl={selectedCoupon?.couponUrl}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
