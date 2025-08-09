"use client";

import React, { useState } from "react";

type Coupon = {
  _id?: string;
  title: string;
  couponCode: string;
  expirationDate: string; // ISO string date
  storeName?: string;
};

interface PromoCodesSectionProps {
  coupons: Coupon[];
  loading?: boolean;
}

const PromoCodesSection: React.FC<PromoCodesSectionProps> = ({
  coupons,
  loading = false,
}) => {
  const [showCodeIndex, setShowCodeIndex] = useState<number | null>(null);

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

  return (
    <div className="bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-2">
          Top Coupons & Promo Codes
        </h2>

        {/* View All aligned right just under heading */}
        <div className="flex justify-end mb-4">
          <a href="#" className="text-sm text-purple-700 hover:underline">
            VIEW ALL
          </a>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {coupons.map((coupon, idx) => {
            const expiration = coupon.expirationDate
              ? new Date(coupon.expirationDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A";

            return (
              <div
                key={coupon._id || idx}
                className="bg-white rounded-lg shadow-sm flex flex-col"
              >
                <div className="p-4 flex flex-col justify-between h-full">
                  {/* Store Name */}
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 bg-purple-700 rounded-md mr-3 flex items-center justify-center text-white font-bold">
                      {(coupon.storeName?.charAt(0) || coupon.title.charAt(0)).toUpperCase()}
                    </div>
                    <span className="text-purple-700 font-semibold text-sm">
                      {coupon.storeName || coupon.title}
                    </span>
                  </div>

                  {/* Coupon Title / Offer */}
                  <p className="text-sm font-semibold mb-2">{coupon.title}</p>

                  {/* Expiration Date */}
                  <span className="text-xs text-purple-600 font-medium mb-4">
                    Expires: <span className="font-bold">{expiration}</span>
                  </span>

                  {/* Show Coupon Code Button */}
                  <button
                    onClick={() =>
                      setShowCodeIndex(showCodeIndex === idx ? null : idx)
                    }
                    className="w-full mt-auto bg-gray-200 text-gray-800 font-semibold text-xs rounded-lg py-2 hover:bg-purple-200 transition"
                  >
                    {showCodeIndex === idx
                      ? coupon.couponCode
                      : "Show Coupon Code"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PromoCodesSection;
