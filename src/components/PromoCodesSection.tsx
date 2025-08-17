"use client";

import React, { useState, useEffect } from "react";
import type { CouponWithStoreData } from "@/types/couponsWithStoresData";
import CouponModal from "@/components/coupon_popup";
import { useSearchParams } from "next/navigation";

interface PromoCodesSectionProps {
  coupons: CouponWithStoreData[];
  loading?: boolean;
}

export default function PromoCodesSection({
  coupons,
  loading = false,
}: PromoCodesSectionProps) {
  const [selectedCoupon, setSelectedCoupon] = useState<CouponWithStoreData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const couponIdFromUrl = searchParams.get("couponId");

  // Auto-open modal if couponId is in query params
  useEffect(() => {
    if (couponIdFromUrl && coupons.length) {
      const foundCoupon = coupons.find((c) => c._id === couponIdFromUrl);
      if (foundCoupon) {
        setSelectedCoupon(foundCoupon);
        setIsModalOpen(true);
      }
    }
  }, [couponIdFromUrl, coupons]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

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

  const handleGetCouponClick = (coupon: CouponWithStoreData) => {
    // Open your site in a new tab with modal
    const modalUrl = `/?couponId=${coupon._id}`;
    window.open(modalUrl, "_blank", "noopener,noreferrer");

    // Redirect current tab to store URL
    if (coupon.couponUrl) {
      window.location.href = coupon.couponUrl;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-purple-700 text-center mb-2">
        Top Coupons & Promo Codes
      </h2>

      <div className="flex justify-end mb-4">
        <a href="/coupons" className="text-sm text-purple-700 hover:underline">
          VIEW ALL
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
        {coupons.map((coupon, idx) => {
          const expiration = coupon.expirationDate
            ? new Date(coupon.expirationDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
              })
            : "N/A";

          const displayStoreName =
            coupon.store?.name || coupon.storeName || "Unknown Store";
          const storeInitial = displayStoreName.charAt(0).toUpperCase();

          return (
            <div
              key={coupon._id || idx}
              className="flex flex-col items-center w-full max-w-[247px]"
            >
              {/* Image Box */}
              <div className="w-full h-[150px] bg-gray-100 rounded-[12px] overflow-hidden flex items-center justify-center">
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

              {/* White Card */}
              <div className="w-full h-[148px] bg-white rounded-[12px] shadow-md -mt-6 z-10 flex flex-col justify-between p-4">
                <div>
                  {/* Store Icon + Name */}
                  <div className="flex items-center mb-1 -mt-10">
                    <div
                      className="bg-purple-700 flex items-center justify-center text-white text-xl font-bold"
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
                    GET COUPON CODE
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Coupon Modal */}
      <CouponModal
        storeName={selectedCoupon?.store?.name}
        title={selectedCoupon?.title}
        code={selectedCoupon?.couponCode}
        redeemUrl={selectedCoupon?.couponUrl}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
