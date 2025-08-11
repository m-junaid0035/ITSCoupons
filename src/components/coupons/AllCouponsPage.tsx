"use client";

import React, { ReactElement } from "react";
import { FaSortAmountDown } from "react-icons/fa";

import type { CouponWithStoreData } from "@/types/couponsWithStoresData";

interface AllCouponsPageProps {
  coupons: CouponWithStoreData[];
  loading: boolean;
  error: string | null;
}

export default function AllCouponsPage({
  coupons,
  loading,
  error,
}: AllCouponsPageProps): ReactElement {
  return (
    <div className="px-4 md:px-10 py-10 max-w-7xl mx-auto text-gray-800">
      <h2 className="text-3xl font-bold mb-6">All Coupons</h2>

      <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
        <div>
          {loading
            ? "Loading coupons..."
            : error
            ? `Error: ${error}`
            : `Showing ${coupons.length} of ${coupons.length} coupons`}
        </div>
        <div className="flex items-center gap-2">
          <span>Per page:</span>
          <select className="border rounded px-2 py-1" disabled={loading}>
            <option>5</option>
            <option>10</option>
            <option>All</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-1/4 space-y-6 text-sm">
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold mb-2">Categories</h4>
            <ul className="space-y-1 pl-1 text-gray-700">
              <li>All Coupons ({coupons.length})</li>
              <li>Food & Dining (4)</li>
              <li>Retail (2)</li>
              <li>Entertainment (1)</li>
              <li>Grocery (1)</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold mb-2">Sort By</h4>
            <button className="w-full p-2 bg-gray-100 rounded border text-left flex items-center gap-2">
              <FaSortAmountDown className="text-gray-500" /> Newest First
            </button>
          </div>
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold mb-2">Quick Filters</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-purple-600" />
                Verified Only
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-purple-600" />
                Expiring Soon
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-purple-600" />
                Free Shipping
              </label>
            </div>
          </div>
        </aside>

        <section className="w-full md:w-3/4 space-y-6">
          {loading && <p>Loading coupons...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && coupons.length === 0 && <p>No coupons found.</p>}

          {!loading &&
            !error &&
            coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="flex border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
              >
                <div
                  className={`w-1/6 min-w-[80px] flex items-center justify-center text-white text-lg font-bold p-4 ${getDiscountColor(
                    coupon.discount ?? ""
                  )}`}
                >
                  {coupon.discount || "Deal"}
                </div>
                <div className="flex-1 p-4">
                  <h3 className="font-semibold text-base mb-1">{coupon.title}</h3>
                  <p className="text-sm text-gray-600">{coupon.description}</p>
                </div>
                <div className="flex flex-col items-end justify-between p-4 w-[160px] border-l border-gray-100">
                  <div className="w-full flex flex-col items-end space-y-2">
                    <button className="bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold w-full py-2 rounded">
                      SHOW CODE
                    </button>
                    <div className="text-xs bg-gray-100 w-full text-center py-1 rounded text-gray-700 tracking-wider">
                      {coupon.couponCode || "N/A"}
                    </div>
                  </div>
                  <div className="text-xs text-right mt-3">
                    {coupon.verified && (
                      <div className="text-purple-600 font-medium">Coupon verified</div>
                    )}
                    <div className="text-gray-600">{coupon.uses || 0} used today</div>
                  </div>
                </div>
              </div>
            ))}

          <div className="flex justify-end gap-4 mt-8 text-sm">
            <button className="text-gray-400 cursor-not-allowed">Previous</button>
            <span className="text-gray-700">Page 1 of 2</span>
            <button className="text-purple-600 font-medium">Next</button>
          </div>
        </section>
      </div>
    </div>
  );
}

// Helper function to determine color based on discount string
function getDiscountColor(discount: string): string {
  if (!discount) return "bg-gray-400";

  const discountLower = discount.toLowerCase();

  if (discountLower.includes("free ship") || discountLower.includes("free shipping")) {
    return "bg-yellow-400 text-black";
  }

  // Extract the numeric percentage value from the discount string
  const match = discountLower.match(/(\d+)%/);
  if (match) {
    const value = parseInt(match[1], 10);
    if (value >= 20) {
      return "bg-purple-700";
    } else {
      return "bg-orange-500";
    }
  }

  // Default color if no percentage or free shipping found
  return "bg-gray-400";
}
