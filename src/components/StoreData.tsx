"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTags, FaHandshake, FaClock } from "react-icons/fa";
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

  // Expanded coupon details
  const [expandedCoupons, setExpandedCoupons] = useState<string[]>([]);
  const toggleDetails = (couponId: string) => {
    setExpandedCoupons((prev) =>
      prev.includes(couponId) ? prev.filter((id) => id !== couponId) : [...prev, couponId]
    );
  };

  // Description expand state for mobile
  const [expandedDesc, setExpandedDesc] = useState(false);

  // Plain text description for single-line preview
  const plainDescription = store.description
    ? store.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    : "";

  const NEEDS_READ_MORE_THRESHOLD = 80; // characters
  const needsReadMore = plainDescription.length > NEEDS_READ_MORE_THRESHOLD;

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

  const handleOpenCouponNewTab = (coupon: CouponData) => {
    const modalUrl = `/stores/${store.slug}?couponId=${coupon._id}`;
    window.open(modalUrl, "_blank", "noopener,noreferrer");

    if (coupon.couponUrl) {
      window.location.href = coupon.couponUrl;
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const verifiedCount = coupons.filter((c) => c.verified).length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-0 md:pt-6 pb-6 text-gray-800">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="hidden md:block w-full md:w-1/4 space-y-8">
          <div className="text-center">
            <div className="relative mx-auto w-44 h-44 mb-6 rounded-full border border-gray-300 shadow-md bg-white flex items-center justify-center overflow-hidden transition hover:scale-105">
              <Image
                src={`https://itscoupons.com${store.image}` || "/placeholder-store.png"}
                alt={store.name}
                width={178}
                height={178}
                className="object-contain rounded-full p-6 transition-transform duration-300 hover:scale-110 hover:brightness-105"
              />
            </div>

            <div
              className="text-sm text-gray-600 prose max-w-none text-left"
              dangerouslySetInnerHTML={{ __html: store.description || "" }}
            />

            {/* Shop Button */}
            <a
              href={store.storeNetworkUrl || store.directUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full h-auto mt-3 py-2 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition"
            >
              Shop
            </a>

          </div>

          <div className="grid grid-cols-2 gap-4">
            <Stat icon={<FaTags size={28} />} value={coupons.length} label="Total Coupons" />
            <Stat
              icon={<FaHandshake size={28} />}
              value={coupons.filter((c) => c.couponType === "coupon").length}
              label="Promo Codes"
            />
            <Stat
              icon={<FaHandshake size={28} />}
              value={coupons.filter((c) => c.couponType === "deal").length}
              label="Deals"
            />
            <Stat
              icon={<FaClock size={28} />}
              value={coupons.filter(isExpired).length}
              label="Expired Coupons"
            />
          </div>

        </aside>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* 🔹 Mobile Header */}
          <div className="block md:hidden mb-6">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="relative w-30 md:w-38 rounded-full aspect-square  border-gray-300 bg-white shadow-md flex items-center justify-center">
                <Image
                  src={store.image ? `https://itscoupons.com${store.image}` : "/placeholder-store.png"}
                  alt={store.name}
                  width={96}
                  height={96}
                  className="object-contain rounded-full p-2"
                />
              </div>
              {/* Heading + Verified line stacked */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-extrabold text-gray-900 leading-snug">
                  {store.name} Coupon Codes
                </h2>
                <p className="mt-2 text-gray-600 font-medium text-xs">
                  {verifiedCount} VERIFIED OFFERS ON {today}
                </p>
              </div>
            </div>
            {store.description && (
              <div className="mt-2 text-sm text-gray-600">
                {!expandedDesc ? (
                  <div className="flex items-baseline">
                    <span className="truncate">
                      {plainDescription}
                    </span>
                    {needsReadMore && (
                      <button
                        onClick={() => setExpandedDesc(true)}
                        className="ml-1 text-purple-700 font-medium text-xs underline whitespace-nowrap flex-shrink-0"
                        aria-expanded={expandedDesc}
                        aria-controls="store-description"
                      >
                        Read More
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <span
                      id="store-description"
                      className="prose text-gray-600 max-w-none"
                      dangerouslySetInnerHTML={{ __html: store.description }}
                    />
                    <button
                      onClick={() => setExpandedDesc(false)}
                      className="ml-1 text-purple-700 font-medium text-xs underline whitespace-nowrap"
                      aria-expanded={expandedDesc}
                      aria-controls="store-description"
                    >
                      Read Less
                    </button>
                  </div>
                )}
              </div>
            )}


          </div>
          {/* 🔹 Desktop Header */}
          <div className="hidden md:block mb-10 text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              {store.name} Coupon Codes
            </h1>
            <p className="text-gray-600 font-medium">
              {verifiedCount} VERIFIED OFFERS ON {today}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b text-sm font-medium mb-6">
            {(["all", "promo", "deal"] as const).map((tab) => (
              <button
                key={tab}
                className={`pb-2 ${activeTab === tab
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
                  className="flex flex-col border border-gray-200 rounded-xl bg-white shadow-md overflow-hidden"
                >
                  <div className="flex items-stretch">
                    <div className="flex items-stretch">
                      {/* Left Discount Section */}
                      <div className="flex flex-col items-center justify-center min-w-[90px] md:min-w-[120px] p-3 md:p-6 text-purple-700 font-bold">
                        {coupon.discount?.toLowerCase() === "free shipping" ? (
                          <>
                            <span className="text-lg md:text-3xl uppercase">Free</span>
                            <span className="text-[10px] md:text-sm uppercase">Shipping</span>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] md:text-sm uppercase">Up To</span>
                            <span className="text-lg md:text-3xl">{coupon.discount || "0%"}</span>
                            <span className="text-[10px] md:text-sm uppercase">Off</span>
                          </>
                        )}
                      </div>
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
                        className="relative w-36 h-11 bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm px-4 py-2 rounded-full text-center"
                      >
                        {coupon.couponType === "coupon" ? "Show Code" : "Get Deal"}
                        <span className="absolute top-0 right-0 w-4 h-5 bg-gradient-to-br from-white to-purple-700 rounded-tr-md"></span>
                      </button>
                      <button
                        onClick={() => toggleDetails(coupon._id)}
                        className="text-xs md:text-sm text-purple-700 mt-2 md:mt-3 font-medium hover:underline"
                      >
                        {expandedCoupons.includes(coupon._id) ? "Hide Details -" : "See Details +"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Description */}
                  {expandedCoupons.includes(coupon._id) && coupon.description && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50 text-sm text-gray-700">
                      {coupon.description}
                    </div>
                  )}
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

      {/* Store content */}
      {store.content && (
        <div className="max-w-[1150px] mx-auto mt-10 px-4 sm:px-6 md:px-8 py-8 bg-white rounded-lg shadow-md text-gray-800">
          <div
            className="prose text-gray-800 max-w-none"
            dangerouslySetInnerHTML={{ __html: store.content }}
          />
        </div>
      )}

      {/* Coupon Modal */}
      <CouponModal
        storeName={store.name}
        title={selectedCoupon?.title}
        discount={selectedCoupon?.discount}
        code={selectedCoupon?.couponCode}
        redeemUrl={selectedCoupon?.couponUrl}
        description={selectedCoupon?.description}
        storeImageUrl={store?.image}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
