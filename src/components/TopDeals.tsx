"use client";

import React, { useState } from "react";
import type { CouponWithStoreData } from "@/types/couponsWithStoresData";
import CouponModal from "@/components/coupon_popup";

interface TopDealsProps {
  deals: CouponWithStoreData[];
}

const TopDeals: React.FC<TopDealsProps> = ({ deals }) => {
  const [selectedDeal, setSelectedDeal] = useState<CouponWithStoreData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lock background scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  if (!deals.length) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 text-center text-purple-700 font-semibold">
        No deals available.
      </div>
    );
  }

  const handleGetDealClick = (deal: CouponWithStoreData) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700 text-center mb-6 sm:mb-8">
        Top Deals
      </h2>

      <div className="flex justify-end mb-4">
        <a href="/coupons" className="text-sm sm:text-base text-purple-700 hover:underline">
          VIEW ALL
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 justify-items-center">
        {deals.map((deal, index) => (
          <div
            key={deal._id || index}
            className="flex flex-col items-center w-full max-w-[247px]"
          >
            {/* Upper Box (Image) */}
            <div className="w-full h-[150px] bg-gray-300 rounded-[16px] overflow-hidden flex items-center justify-center">
              {deal.store?.image ? (
                <img
                  src={deal.store.image}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm flex items-center justify-center h-full">
                  No Image
                </span>
              )}
            </div>

            {/* Lower Box (Details) */}
            <div className="w-full h-[148px] bg-white rounded-[16px] shadow-md -mt-6 z-10 flex flex-col justify-between p-4">
              <div>
                <h3 className="font-bold text-sm text-gray-900 line-clamp-2">
                  {deal.title}
                </h3>
                <p className="text-xs text-gray-700 mt-1 line-clamp-2">{deal.description}</p>
              </div>

              {deal.couponCode && (
                <button
                  onClick={() => handleGetDealClick(deal)}
                  className="w-full bg-gray-200 text-xs font-semibold text-black rounded-full py-1 hover:bg-purple-200 transition"
                >
                  GET DEAL
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Modal */}
      <CouponModal
        storeName={selectedDeal?.store?.name}
        title={selectedDeal?.title}
        code={selectedDeal?.couponCode}
        redeemUrl={selectedDeal?.couponUrl}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TopDeals;
