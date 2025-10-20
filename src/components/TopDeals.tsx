// Updated TopDeals component with grid layout on mobile and fixed alignment
"use client";

import React, { useState, useEffect, useRef } from "react";
import type { CouponWithStoreData } from "@/types/couponsWithStoresData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CouponModal from "@/components/coupon_popup";
import Image from "next/image";

interface TopDealsProps {
  deals: CouponWithStoreData[];
  couponId: string;
}

const TopDeals: React.FC<TopDealsProps> = ({ deals, couponId }) => {
  const [selectedDeal, setSelectedDeal] = useState<CouponWithStoreData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (couponId) {
      const coupon = deals.find((c) => c._id === couponId);
      if (coupon) {
        setSelectedDeal(coupon);
        setIsModalOpen(true);
      }
    }
  }, [couponId, deals]);

  if (!deals.length) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 text-center text-purple-700 font-semibold">
        No deals available.
      </div>
    );
  }

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -clientWidth : clientWidth,
      behavior: "smooth",
    });
  };

  const handleGetDealClick = (deal: CouponWithStoreData) => {
    const modalUrl = `/?couponId=${deal._id}`;
    window.open(modalUrl, "_blank", "noopener,noreferrer");

    if (deal.couponUrl) {
      window.location.href = deal.couponUrl;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700 text-center mb-6 sm:mb-8">
        Top Deals
      </h2>

      <div className="flex justify-between items-center mb-4 md:hidden">
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll deals left"
            className="bg-white shadow-md rounded-full p-2 hover:bg-purple-50 focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5 text-purple-700" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll deals right"
            className="bg-white shadow-md rounded-full p-2 hover:bg-purple-50 focus:outline-none"
          >
            <ChevronRight className="w-5 h-5 text-purple-700" />
          </button>
        </div>
        <a href="/coupons" className="text-sm sm:text-base text-purple-700 hover:underline">
          VIEW ALL
        </a>
      </div>

      <div className="flex justify-end mb-4 hidden md:flex">
        <a href="/coupons" className="text-sm sm:text-base text-purple-700 hover:underline">
          VIEW ALL
        </a>
      </div>

      <div className="relative hidden md:block">
        <div className="absolute inset-y-0 -left-10 flex items-center">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll deals left"
            className="bg-white shadow-md rounded-full p-2 hover:bg-purple-50 focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5 text-purple-700" />
          </button>
        </div>
        <div className="absolute inset-y-0 -right-10 flex items-center">
          <button
            onClick={() => scroll("right")}
             aria-label="Scroll deals right"
            className="bg-white shadow-md rounded-full p-2 hover:bg-purple-50 focus:outline-none"
          >
            <ChevronRight className="w-5 h-5 text-purple-700" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 no-scrollbar"
        >
          {deals.map((deal, index) => (
            <div key={deal._id || index} className="flex-shrink-0 snap-start w-[247px]">
              <div className="w-full h-[150px] bg-gray-300 rounded-[16px] overflow-hidden flex items-center justify-center border border-gray-100">
                {deal.store?.image ? (
                  <Image
                    src={`https://itscoupons.com${deal.store.image}`}
                    alt={deal.store?.name || deal.title}
                    width={247}
                    height={150}
                    priority={index < 4}
                    loading={index < 4 ? "eager" : "lazy"}
                    className="w-full h-full object-contain bg-white p-2"
                  />
                ) : (
                  <span className="text-gray-400 text-sm flex items-center justify-center h-full">
                    No Image
                  </span>
                )}
              </div>
              <div className="w-full min-h-[148px] bg-white rounded-[16px] shadow-md -mt-6 z-10 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-2">
                    {deal.title}
                  </h3>
                  <DescriptionWithToggle text={deal.description} />
                </div>
                {deal.couponCode && (
                  <button
                    onClick={() => handleGetDealClick(deal)}
                    aria-label={`Get deal for ${deal.title}`}
                    className="w-full bg-purple-700 text-xs font-semibold text-white rounded-full py-2 hover:bg-purple-200 transition"
                  >
                    Get Deal
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Grid */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
        {deals.map((deal, index) => (
          <div key={deal._id || index} className="w-full">
            <div className="w-full h-[150px] bg-gray-300 rounded-[16px] overflow-hidden flex items-center justify-center border border-gray-100">
              {deal.store?.image ? (
                <Image
                  src={`https://itscoupons.com${deal.store.image}`}
                  alt={deal.store?.name || deal.title}
                  width={247}
                  height={150}
                  className="w-full h-full object-contain bg-white p-2"
                />
              ) : (
                <span className="text-gray-400 text-sm flex items-center justify-center h-full">
                  No Image
                </span>
              )}
            </div>
            <div className="bg-white rounded-[16px] shadow-md -mt-6 z-10 p-4 flex flex-col justify-between min-h-[148px]">
              <h3 className="font-bold text-sm text-gray-900 line-clamp-2">
                {deal.title}
              </h3>
              <DescriptionWithToggle text={deal.description} />
              {deal.couponCode && (
                <button
                  onClick={() => handleGetDealClick(deal)}
                  className="w-full bg-purple-700 text-xs font-semibold text-white rounded-full py-2 hover:bg-purple-200 transition"
                >
                  Get Deal
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <CouponModal
        storeName={selectedDeal?.store?.name}
        storeImageUrl={selectedDeal?.store?.image}
        title={selectedDeal?.title}
        discount={selectedDeal?.discount}
        code={selectedDeal?.couponCode}
        redeemUrl={selectedDeal?.couponUrl}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

const DescriptionWithToggle: React.FC<{ text?: string }> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;
  const words = text.split(" ");
  const shouldTruncate = words.length > 6;
  const displayedText = expanded ? text : words.slice(0, 6).join(" ") + (shouldTruncate ? "..." : "");

  return (
    <div>
      <div className="text-xs text-gray-700 mt-1" dangerouslySetInnerHTML={{ __html: displayedText }} />
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 text-xs m-1 font-medium hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default TopDeals;