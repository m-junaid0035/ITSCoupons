"use client";

import React, { useState, useEffect, useRef } from "react";
import type { CouponWithStoreData } from "@/types/couponsWithStoresData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CouponModal from "@/components/coupon_popup";

interface PromoCodesSectionProps {
  coupons: CouponWithStoreData[];
  couponId: string;
}

export default function PromoCodesSection({ coupons, couponId }: PromoCodesSectionProps) {
  const [selectedCoupon, setSelectedCoupon] = useState<CouponWithStoreData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Open modal automatically if couponId exists
  useEffect(() => {
    if (couponId) {
      const coupon = coupons.find(c => c._id === couponId);
      if (coupon) {
        setSelectedCoupon(coupon);
        setIsModalOpen(true);
      }
    }
  }, [couponId, coupons]);

  if (!coupons.length) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 text-center text-purple-700 font-semibold">
        No coupons available.
      </div>
    );
  }

  // Smooth horizontal scroll
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -clientWidth : clientWidth,
      behavior: "smooth",
    });
  };

  // Open coupon link
  const handleGetCouponClick = (coupon: CouponWithStoreData) => {
    const modalUrl = `/?couponId=${coupon._id}`;
    window.open(modalUrl, "_blank", "noopener,noreferrer");

    if (coupon.couponUrl) {
      window.location.href = coupon.couponUrl;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700 text-center mb-6 sm:mb-8">
        Top Coupons & Promo Codes
      </h2>

      {/* MOBILE: Scroll buttons left, VIEW ALL right */}
      <div className="flex justify-between items-center mb-4 md:hidden">
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll coupons left"
            className="bg-white shadow-md rounded-full p-2 hover:bg-purple-50 focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5 text-purple-700" />
          </button>
          <button
            onClick={() => scroll("right")}
             aria-label="Scroll coupons right"
            className="bg-white shadow-md rounded-full p-2 hover:bg-purple-50 focus:outline-none"
          >
            <ChevronRight className="w-5 h-5 text-purple-700" />
          </button>
        </div>
        <a href="/coupons" className="text-sm sm:text-base text-purple-700 hover:underline">
          VIEW ALL
        </a>
      </div>

      {/* DESKTOP: VIEW ALL on the right */}
      <div className="flex justify-end mb-4 hidden md:flex">
        <a href="/coupons" className="text-sm sm:text-base text-purple-700 hover:underline">
          VIEW ALL
        </a>
      </div>

      <div className="relative">
        {/* DESKTOP: Arrow buttons left/right outside slider */}
        <div className="absolute inset-y-0 -left-10 flex items-center hidden md:flex">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll coupons left"
            className="bg-white shadow-md rounded-full p-2 hover:bg-purple-50 focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5 text-purple-700" />
          </button>
        </div>

        <div className="absolute inset-y-0 -right-10 flex items-center hidden md:flex">
          <button
            onClick={() => scroll("right")}
             aria-label="Scroll coupons right"
            className="bg-white shadow-md rounded-full p-2 hover:bg-purple-50 focus:outline-none"
          >
            <ChevronRight className="w-5 h-5 text-purple-700" />
          </button>
        </div>

        {/* Horizontal scroll container (Updated for Mobile Grid) */}
        <div
          ref={scrollRef}
          className="
            grid grid-cols-2 gap-4
            sm:flex sm:gap-6 sm:overflow-x-auto sm:scroll-smooth sm:snap-x sm:snap-mandatory sm:pb-4 sm:no-scrollbar
          "
        >
          {coupons.map((coupon, idx) => {
            const expiration = coupon.expirationDate
              ? new Date(coupon.expirationDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A";

            const displayStoreName = coupon.store?.name || coupon.storeName || "Unknown Store";
            const storeInitial = displayStoreName.charAt(0).toUpperCase();

            return (
              <div
                key={coupon._id || idx}
                className="flex-shrink-0 snap-start flex flex-col items-center w-full sm:w-[247px]"

              >
                <div className="w-full h-[150px] bg-gray-100 rounded-[16px] overflow-hidden flex items-center justify-center border border-gray-100">
                  {coupon.store?.image ? (
                    <img
                      src={`https://itscoupons.com${coupon.store.image}`}
                      alt={displayStoreName}
                      width={280}
                      height={150}
                      className="-mt-6 w-full h-full object-contain bg-white p-2"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>

                <div className="w-full h-[148px] bg-white rounded-[16px] shadow-md -mt-6 z-10 flex flex-col justify-between p-4">
                  <div>
                    <div className="flex items-center mb-1 -mt-10">
                      <div
                        className="bg-purple-700 flex items-center justify-center text-white text-xl font-bold rounded-md"
                        style={{ width: 40, height: 40 }}
                      >
                        {storeInitial}
                      </div>
                      <span className="ml-2 text-sm font-medium text-purple-700 mt-5">
                        {displayStoreName}
                      </span>
                    </div>

                    <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">
                      {coupon.title}
                    </h3>
                    <p className="text-xs text-pink-600 mt-1">
                      Expires: <span className="font-medium">{expiration}</span>
                    </p>
                  </div>

                  {coupon.couponCode && (
                    <button
                      onClick={() => handleGetCouponClick(coupon)}
                      aria-label={`Get coupon code for ${coupon.title}`}
                      className="w-full bg-purple-700 hover:bg-purple-800 text-xs font-semibold text-white rounded-full py-2 transition"
                    >
                      Get Coupon Code
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CouponModal
        storeName={selectedCoupon?.store?.name}
        storeImageUrl={selectedCoupon?.store?.image}
        title={selectedCoupon?.title}
        code={selectedCoupon?.couponCode}
        discount={selectedCoupon?.discount}
        redeemUrl={selectedCoupon?.couponUrl}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
