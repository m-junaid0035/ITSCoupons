"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import type { BlogData } from "@/types/blog";
import type { CouponWithStoreData } from "@/types/couponsWithStoresData";
import BlogShow from "@/components/BlogShow";
import CouponModal from "@/components/coupon_popup";

interface BlogClientProps {
  blog: BlogData;
  topBlogs: BlogData[];
  topDeals: CouponWithStoreData[];
  couponId?: string;
  slug?: string; // optional couponId to auto-open modal
}

const BlogClient: React.FC<BlogClientProps> = ({ blog, topBlogs, topDeals, couponId, slug }) => {
  const [selectedDeal, setSelectedDeal] = useState<CouponWithStoreData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-open modal if couponId prop matches a deal
  useEffect(() => {
    if (couponId) {
      const deal = topDeals.find((d) => d._id === couponId);
      if (deal) {
        setSelectedDeal(deal);
        setIsModalOpen(true);
      }
    }
  }, [couponId, topDeals]);

  // Lock background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Handle clicking "Get Deal" button
    const handleGetDealClick = (deal: CouponWithStoreData) => {
      const modalUrl = `/blogs/${slug}/?couponId=${deal._id}`;
      window.open(modalUrl, "_blank", "noopener,noreferrer");
  
      if (deal.couponUrl) {
        window.location.href = deal.couponUrl;
      }
    };
  

  return (
    <div className="w-full flex justify-center bg-gray-50">
      <div className="max-w-7xl w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Blog Content */}
        <main className="lg:col-span-9 bg-white rounded-xl shadow border border-gray-100">
          <BlogShow blog={blog} />
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Top Blogs */}
          <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">Top Blogs</h3>
            <ul className="space-y-2">
              {topBlogs.map((item) => (
                <li key={item._id} className="flex items-center space-x-2">
                  {item.image && (
                    <Image
                      src={item.image.startsWith("http") ? item.image : `${process.env.DOMAIN}${item.image}`}
                      alt={item.title}
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                  )}
                  <a
                    href={`/blog/${item.slug}`}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Deals */}
          <div className="space-y-4">
            {topDeals.map((deal) => {
              const storeName = deal.store?.name || "Unknown Store";
              const storeInitial = storeName.charAt(0).toUpperCase();
              const usedTimes = deal.uses ?? 0;
              const expiration = deal.expirationDate
                ? new Date(deal.expirationDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : null;

              return (
                <div key={deal._id} className="flex flex-col bg-white rounded-lg shadow p-3 border border-gray-100">
                  <div className="flex items-center mb-2">
                    {deal.store?.image ? (
                      <Image
                        src={`https://itscoupons.com${deal.store.image}`}
                        width={36}
                        height={36}
                        alt={storeName}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="bg-purple-700 text-white font-bold flex items-center justify-center rounded-md w-9 h-9">
                        {storeInitial}
                      </div>
                    )}
                    <a
                      href={`/stores/${deal.store?.slug || ""}`}
                      className="ml-2 text-sm font-medium text-purple-700 hover:underline"
                    >
                      {storeName} Coupons
                    </a>
                  </div>

                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{deal.title}</h4>
                  <p className="text-xs text-gray-700 mb-2 line-clamp-3">{deal.description}</p>

                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => handleGetDealClick(deal)}
                      className="text-xs text-white bg-purple-700 rounded-full py-1 px-2 hover:bg-purple-800 transition"
                    >
                      Get Deal
                    </button>
                    <span className="text-xs text-gray-500">
                      {expiration ? `Expires: ${expiration}` : `Used: ${usedTimes}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Coupon Modal */}
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

export default BlogClient;
