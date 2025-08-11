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
      setTimeout(() => setCopiedIndex(null), 2000);
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {coupons.map((coupon, idx) => {
            const expiration = coupon.expirationDate
              ? new Date(coupon.expirationDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A";

            const iconLetter = (
              coupon.store?.name?.charAt(0) ||
              coupon.storeName?.charAt(0) ||
              coupon.title.charAt(0)
            )?.toUpperCase();

            const displayStoreName =
              coupon.store?.name || coupon.storeName || "Unknown Store";

            return (
              <div
                key={coupon._id || idx}
                className="w-[301px] mx-auto rounded-[12px] overflow-hidden shadow-md"
              >
                {/* Upper image box */}
                <div className="relative">
                  {coupon.store?.image ? (
                    <img
                      src={coupon.store.image}
                      alt={displayStoreName}
                      className="w-[301px] h-[150px] object-cover rounded-t-[12px]"
                    />
                  ) : (
                    <div className="bg-gray-300 w-[301px] h-[150px] rounded-t-[12px]" />
                  )}

                  {/* Middle purple icon box */}
                  <div
                    className="absolute -bottom-[32px] left-[20px] w-[65.82px] h-[65.82px] 
                    bg-purple-700 flex items-center justify-center text-white font-bold text-lg 
                    rounded-md shadow-md"
                  >
                    {iconLetter}
                  </div>

                  {/* Store name next to icon */}
                  <div className="absolute -bottom-[20px] left-[95px] text-purple-700 font-bold text-base">
                    {displayStoreName}
                  </div>
                </div>

                {/* Lower content box */}
                <div
                  className="bg-white rounded-b-[12px] px-4 pt-[50px] pb-4 text-left 
                  h-[148px] flex flex-col justify-between 
                  shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                >
                  <p className="text-sm font-semibold text-gray-700">
                    {coupon.title}
                  </p>

                  <span className="text-xs text-purple-600 font-medium">
                    Expires:{" "}
                    <span className="font-bold">{expiration}</span>
                  </span>

                  {/* Show coupon code button inside lower box */}
                  <div className="mt-2">
                    <button
                      onClick={() =>
                        setShowCodeIndex(showCodeIndex === idx ? null : idx)
                      }
                      className="w-[218.07px] h-[19.55px] 
                      bg-gray-200 text-gray-800 font-semibold text-xs rounded-full 
                      py-[3px] px-[14px] hover:bg-purple-200 transition"
                    >
                      {showCodeIndex === idx
                        ? coupon.couponCode
                        : "Show Coupon Code"}
                    </button>

                    {showCodeIndex === idx && (
                      <button
                        onClick={() => handleCopy(coupon.couponCode, idx)}
                        className="mt-2 w-full bg-purple-700 text-white font-semibold text-xs rounded-full py-2 hover:bg-purple-800 transition"
                      >
                        {copiedIndex === idx ? "Copied!" : "Copy Code"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
