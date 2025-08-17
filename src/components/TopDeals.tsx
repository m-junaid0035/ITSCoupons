"use client";

import React from "react";
import type { CouponWithStoreData } from "@/types/couponsWithStoresData"; // Adjust path as needed

interface TopDealsProps {
  deals: CouponWithStoreData[];
  loading?: boolean;
}

const TopDeals: React.FC<TopDealsProps> = ({ deals, loading = false }) => {
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 flex justify-center items-center text-purple-700 font-semibold">
        Loading deals...
      </div>
    );
  }

  if (!deals.length) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 text-center text-purple-700 font-semibold">
        No deals available.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Title */}
      <h2 className="text-2xl font-bold text-purple-700 text-center mb-2">
        Top Deals
      </h2>

      {/* View All */}
      <div className="flex justify-end mb-4">
        <a href="/coupons" className="text-sm text-purple-700 hover:underline">
          VIEW ALL
        </a>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
        {deals.map((deal, index) => (
          <div
            key={deal._id || index}
            className="flex flex-col items-center w-full max-w-[247px]"
          >
            {/* Upper Box (Image) */}
            <div className="w-full h-[150px] bg-gray-300 rounded-[12px] overflow-hidden">
              {deal.store?.image && (
                <img
                  src={deal.store?.image}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Lower Box (Details) */}
            <div className="w-full h-[148px] bg-white rounded-[12px] shadow-md -mt-6 z-10 flex flex-col justify-between p-4">
              <div>
                <h3 className="font-bold text-sm text-gray-900">{deal.title}</h3>
                <p className="text-xs text-gray-700 mt-1">{deal.description}</p>
              </div>

              {deal.couponCode && (
                <span className="inline-block px-3 py-1 text-[10px] font-semibold rounded-full bg-gray-200 text-gray-800 shadow-sm">
                  Coupon Code
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDeals;
