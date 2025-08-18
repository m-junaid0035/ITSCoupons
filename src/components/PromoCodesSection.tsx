"use client";

import React, { useState, useEffect } from "react";
import type { CouponWithStoreData } from "@/types/couponsWithStoresData";
import CouponModal from "@/components/coupon_popup";

interface PromoCodesSectionProps {
  coupons: CouponWithStoreData[];
  couponId: string;
}

export default function PromoCodesSection({ coupons, couponId}: PromoCodesSectionProps) {
  const [selectedCoupon, setSelectedCoupon] = useState<CouponWithStoreData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Open modal automatically if URL has couponId param (works in new tab)
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

  // Open a new tab with couponId in URL
  const handleGetCouponClick = (coupon: CouponWithStoreData) => {
    const modalUrl = `/?couponId=${coupon._id}`;
    window.open(modalUrl, "_blank", "noopener,noreferrer");

    // Optional: Also navigate current tab if there's a direct coupon URL
    if (coupon.couponUrl) {
      window.location.href = coupon.couponUrl;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700 text-center mb-6 sm:mb-8">
        Top Coupons & Promo Codes
      </h2>

      <div className="flex justify-end mb-4">
        <a href="/coupons" className="text-sm sm:text-base text-purple-700 hover:underline">
          VIEW ALL
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 justify-items-center">
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
            <div key={coupon._id || idx} className="flex flex-col items-center w-full max-w-[247px]">
              <div className="w-full h-[150px] bg-gray-100 rounded-[16px] overflow-hidden flex items-center justify-center">
                {coupon.store?.image ? (
                  <img
                    src={coupon.store.image}
                    alt={displayStoreName}
                    className="w-full h-full object-cover"
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
                      style={{ width: 50, height: 50 }}
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
                    className="w-full bg-gray-200 text-xs font-semibold text-black rounded-full py-1 hover:bg-purple-200 transition"
                  >
                    {coupon.couponCode === "DEAL_CODE" ? "View Deal" : "Get Coupon Code"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <CouponModal
        storeName={selectedCoupon?.store?.name}
        storeImageUrl={selectedCoupon?.store?.image}
        title={selectedCoupon?.title}
        code={selectedCoupon?.couponCode}
        redeemUrl={selectedCoupon?.couponUrl}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
