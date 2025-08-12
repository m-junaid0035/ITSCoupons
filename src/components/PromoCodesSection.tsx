"use client";

import React, { useState } from "react";
import type { CouponWithStoreData } from "@/types/couponsWithStoresData";

interface PromoCodesSectionProps {
  coupons: CouponWithStoreData[];
  loading?: boolean;
}

export default function PromoCodesSection({
  coupons,
  loading = false,
}: PromoCodesSectionProps) {
  const [showCodeIndex, setShowCodeIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 flex justify-center items-center text-purple-700 font-semibold">
        Loading coupons...
      </div>
    );
  }

  if (!coupons.length) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 text-center text-purple-700 font-semibold">
        No coupons available.
      </div>
    );
  }

  const handleCopy = async (code: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy coupon code", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">
        Top Coupons & Promo Codes
      </h2>

      <div className="flex justify-end mb-6">
        <a href="#" className="text-sm text-purple-700 hover:underline">
          VIEW ALL
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
        {coupons.map((coupon, idx) => {
          const expiration = coupon.expirationDate
            ? new Date(coupon.expirationDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A";

          const displayStoreName =
            coupon.store?.name || coupon.storeName || "Unknown Store";

          const iconLetter = (displayStoreName.charAt(0) || coupon.title.charAt(0)).toUpperCase();

          return (
            <div
              key={coupon._id || idx}
              className="flex flex-col items-center w-full max-w-[247px] bg-white rounded-[12px] shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image Box */}
              <div className="w-full h-[150px] bg-gray-100 rounded-t-[12px] overflow-hidden">
                {coupon.store?.image ? (
                  <img
                    src={coupon.store.image}
                    alt={displayStoreName}
                    className="w-full h-full object-cover rounded-t-[12px]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm rounded-t-[12px]">
                    No Image
                  </div>
                )}
              </div>

              {/* Icon Letter & Store Name below image */}
              <div className="flex items-center space-x-3 mt-3 px-4 w-full">
                <div
                  className="flex items-center justify-center bg-purple-700 text-white font-bold text-xl rounded-full w-12 h-12 shadow-md"
                  aria-label={`Store initial ${iconLetter}`}
                >
                  {iconLetter}
                </div>
                <div className="text-purple-700 font-semibold text-lg truncate">
                  {displayStoreName}
                </div>
              </div>

              {/* Content Box */}
              <div className="w-full p-4 flex flex-col justify-between h-[148px]">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate" title={coupon.title}>
                    {coupon.title}
                  </h3>
                  <p className="text-xs text-purple-600 font-medium">
                    Expires: <span className="font-semibold">{expiration}</span>
                  </p>
                </div>

                {coupon.couponCode && (
                  <button
                    onClick={() => {
                      setShowCodeIndex(showCodeIndex === idx ? null : idx);
                      if (showCodeIndex !== idx) handleCopy(coupon.couponCode, idx);
                    }}
                    className="mt-3 w-full bg-gray-200 text-gray-800 font-semibold text-xs rounded-full py-2 px-4 hover:bg-purple-200 transition"
                    title={showCodeIndex === idx ? coupon.couponCode : "Click to copy coupon code"}
                  >
                    {showCodeIndex === idx
                      ? copiedIndex === idx
                        ? "Copied!"
                        : coupon.couponCode
                      : "Show Coupon Code"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
