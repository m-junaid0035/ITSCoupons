"use client";

import React, { useState } from "react";
import type { CouponWithStoreData } from "@/types/couponsWithStoresData";

interface PromoCodesSectionProps {
  coupons: CouponWithStoreData[];
  loading?: boolean;
}

export default function PromoCodesSection({ coupons, loading = false }: PromoCodesSectionProps) {
  const [showCodeIndex, setShowCodeIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="bg-gray-100 py-10 flex justify-center items-center text-purple-700 font-semibold">
        Loading coupons...
      </div>
    );
  }

  if (!coupons.length) {
    return (
      <div className="bg-gray-100 py-10 text-center text-purple-700 font-semibold">
        No coupons available.
      </div>
    );
  }

  const handleCopy = async (code: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000); // Clear after 2 seconds
    } catch (err) {
      console.error("Failed to copy coupon code", err);
    }
  };

  return (
    <div className="bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-2">
          Top Coupons & Promo Codes
        </h2>

        <div className="flex justify-end mb-4">
          <a href="#" className="text-sm text-purple-700 hover:underline">
            VIEW ALL
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {coupons.map((coupon, idx) => {
            const expiration = coupon.expirationDate
              ? new Date(coupon.expirationDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A";

            // Determine the letter to show in the icon circle
            const iconLetter = (
              coupon.store?.name?.charAt(0) ||
              coupon.storeName?.charAt(0) ||
              coupon.title.charAt(0)
            )?.toUpperCase();

            // Determine the display store name
            const displayStoreName = coupon.store?.name || coupon.storeName || "Unknown Store";

            return (
              <div
                key={coupon._id || idx}
                className="bg-white rounded-lg shadow-sm flex flex-col"
              >
                <div className="p-4 flex flex-col justify-between h-full">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 bg-purple-700 rounded-md mr-3 flex items-center justify-center text-white font-bold text-lg">
                      {iconLetter}
                    </div>
                    {/* Show store name prominently */}
                    <span className="text-purple-700 font-bold text-base">
                      {displayStoreName}
                    </span>
                  </div>

                  {/* Coupon title smaller and below store name */}
                  <p className="text-sm font-semibold mb-2 text-gray-700">{coupon.title}</p>

                  <span className="text-xs text-purple-600 font-medium mb-4">
                    Expires: <span className="font-bold">{expiration}</span>
                  </span>

                  <button
                    onClick={() => {
                      if (showCodeIndex === idx) {
                        setShowCodeIndex(null);
                      } else {
                        setShowCodeIndex(idx);
                      }
                    }}
                    className="w-full mb-2 bg-gray-200 text-gray-800 font-semibold text-xs rounded-lg py-2 hover:bg-purple-200 transition"
                  >
                    {showCodeIndex === idx ? coupon.couponCode : "Show Coupon Code"}
                  </button>

                  {showCodeIndex === idx && (
                    <button
                      onClick={() => handleCopy(coupon.couponCode, idx)}
                      className="w-full bg-purple-700 text-white font-semibold text-xs rounded-lg py-2 hover:bg-purple-800 transition"
                    >
                      {copiedIndex === idx ? "Copied!" : "Copy Code"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
