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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {coupons.map((coupon, idx) => {
          const expiration = coupon.expirationDate
            ? new Date(coupon.expirationDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
              })
            : "N/A";

          const displayStoreName =
            coupon.store?.name || coupon.storeName || "Unknown Store";

          // Take first letter for icon
          const storeInitial = displayStoreName.charAt(0).toUpperCase();

          return (
            <div
              key={coupon._id || idx}
              className="w-[250.384px] bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="w-full h-[120px] bg-gray-100">
                {coupon.store?.image ? (
                  <img
                    src={coupon.store.image}
                    alt={displayStoreName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* Icon + Store name */}
              <div className="flex items-center px-3 mt-[-32px]">
                <div
                  className="bg-purple-700 flex items-center justify-center text-white text-xl font-bold"
                  style={{
                    width: "65.821px",
                    height: "65.821px",
                    borderRadius: "0px",
                  }}
                >
                  {storeInitial}
                </div>
                <span className="ml-2 text-sm font-medium text-purple-700">
                  {displayStoreName}
                </span>
              </div>

              {/* Lower Box */}
              <div
                className="px-3 mt-2 flex flex-col flex-grow bg-white shadow-sm"
                style={{
                  width: "210.384px",
                  height: "120.244px",
                  borderRadius: "12px",
                  borderTopLeftRadius: "20px",
                  borderTopRightRadius: "20px",
                }}
              >
                <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">
                  {coupon.title}
                </h3>
                <p className="text-xs text-pink-600 mt-1">
                  Expires: <span className="font-medium">{expiration}</span>
                </p>

                {coupon.couponCode && (
                  <button
                    onClick={() => {
                      setShowCodeIndex(showCodeIndex === idx ? null : idx);
                      if (showCodeIndex !== idx)
                        handleCopy(coupon.couponCode, idx);
                    }}
                    className="mt-auto mb-2 w-full bg-gray-200 text-xs font-semibold text-black rounded-full py-1 hover:bg-purple-200 transition"
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
