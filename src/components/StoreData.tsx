"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTags, FaHandshake, FaClock } from "react-icons/fa";
import type { StoreWithCouponsData } from "@/types/storesWithCouponsData";
import type { CouponData } from "@/types/coupon";
import CouponModal from "@/components/coupon_popup";
import { incrementCouponUsesAction } from "@/actions/couponActions"; // adjust path if needed


/* ───────── Helpers ───────── */
function Stat({
  icon,
  value,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
      onClick={onClick}
    >
      <div className="text-purple-700 text-lg">{icon}</div>
      <div>
        <div className="text-xl font-bold text-purple-700">{value}</div>
        <div className="text-sm">{label}</div>
      </div>
    </div>
  );
}


function isExpired(coupon: CouponData) {
  if (!coupon.expirationDate) return false;
  return new Date(coupon.expirationDate) < new Date();
}

function extractPercent(discount?: string) {
  if (!discount) return 0;
  const match = discount.match(/(\d+)%/);
  return match ? parseInt(match[1], 10) : 0;
}

/* ───────── Component ───────── */
interface StorePageProps {
  store: StoreWithCouponsData;
  couponId: string;
  initialActiveTab?: "all" | "promo" | "deal";
}

export default function StorePage({
  store,
  couponId,
  initialActiveTab = "all",
}: StorePageProps) {
  const [activeTab, setActiveTab] = useState<"all" | "promo" | "deal">(initialActiveTab);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Expanded coupon details
  const [expandedCoupons, setExpandedCoupons] = useState<string[]>([]);
  const toggleDetails = (couponId: string) => {
    setExpandedCoupons((prev) =>
      prev.includes(couponId) ? prev.filter((id) => id !== couponId) : [...prev, couponId]
    );
  };

  // Description expand state for mobile
  const [expandedDesc, setExpandedDesc] = useState(false);

  // Plain text description for single-line preview
  const plainDescription = store.description
    ? store.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    : "";

  const NEEDS_READ_MORE_THRESHOLD = 80; // characters
  const needsReadMore = plainDescription.length > NEEDS_READ_MORE_THRESHOLD;

  const coupons: CouponData[] = store.coupons || [];
  const filteredCoupons = coupons.filter((coupon) => {
    // Only show if expired or no expiration date
    const expiredOrNoDate = !coupon.expirationDate || !(isExpired(coupon));


    if (!expiredOrNoDate) return false;

    switch (activeTab) {
      case "promo":
        return coupon.couponType === "coupon";
      case "deal":
        return coupon.couponType === "deal";
      default:
        return true;
    }
  });


  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const expiredSectionRef = React.useRef<HTMLDivElement>(null);


  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  useEffect(() => setCurrentPage(1), [activeTab]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Auto open modal if couponId in URL
  useEffect(() => {
    if (couponId) {
      const coupon = coupons.find((c) => c._id === couponId);
      if (coupon) {
        setSelectedCoupon(coupon);
        setIsModalOpen(true);
      }
    }
  }, [couponId, coupons]);

  const handleOpenCouponNewTab = async (coupon: CouponData) => {
    try {
      // ✅ Increment coupon uses in DB
      await incrementCouponUsesAction(coupon._id);

      // ✅ Open coupon page in new tab
      const modalUrl = `/stores/${store.slug}?couponId=${coupon._id}`;
      window.open(modalUrl, "_blank", "noopener,noreferrer");

      // ✅ Redirect to the coupon/deal URL if present
      if (coupon.couponUrl) {
        window.location.href = coupon.couponUrl;
      }
    } catch (error) {
      console.error("Failed to increment coupon uses:", error);
    }
  };
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const verifiedCount = coupons.filter((c) => c.verified).length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-0 md:pt-6 pb-6 text-gray-800">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="hidden md:block w-full md:w-1/4 space-y-8">
          <div className="text-center">
            <div className="relative mx-auto w-44 h-44 mb-6 rounded-full border border-gray-300 shadow-md bg-white flex items-center justify-center overflow-hidden transition hover:scale-105">
              <Image
                src={`https://itscoupons.com${store.image}` || "/placeholder-store.png"}
                alt={store.name}
                width={178}
                height={178}
                className="object-contain rounded-full p-6 transition-transform duration-300 hover:scale-110 hover:brightness-105"
              />
            </div>

            <div
              className="text-sm text-gray-600 prose max-w-none text-left"
              dangerouslySetInnerHTML={{ __html: store.description || "" }}
            />

            {/* Shop Button */}
            <a
              href={store.storeNetworkUrl || store.directUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full h-auto mt-3 py-2 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition"
            >
              Shop
            </a>

          </div>

          <div className="grid grid-cols-2 gap-4">
            <Stat icon={<FaTags size={28} />} value={coupons.length} label="Total Coupons" onClick={() => setActiveTab("all")} />
            <Stat
              icon={<FaHandshake size={28} />}
              value={coupons.filter((c) => c.couponType === "coupon").length}
              label="Promo Codes"
              onClick={() => setActiveTab("promo")}
            />
            <Stat
              icon={<FaHandshake size={28} />}
              value={coupons.filter((c) => c.couponType === "deal").length}
              label="Deals"
              onClick={() => setActiveTab("deal")}
            />
            <Stat
              icon={<FaClock size={28} />}
              value={coupons.filter(isExpired).length}
              label="Expired Coupons"
              onClick={() => {
                expiredSectionRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            />

          </div>

        </aside>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* 🔹 Mobile Header */}
          <div className="block md:hidden mb-6">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="relative w-30 md:w-38 rounded-full aspect-square  border-gray-300 bg-white shadow-md flex items-center justify-center">
                <Image
                  src={store.image ? `https://itscoupons.com${store.image}` : "/placeholder-store.png"}
                  alt={store.name}
                  width={96}
                  height={96}
                  className="object-contain rounded-full p-2"
                />
              </div>
              {/* Heading + Verified line stacked */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-extrabold text-gray-900 leading-snug">
                  {store.name} Coupon Codes
                </h2>
                <p className="mt-2 text-gray-600 font-medium text-xs">
                  {verifiedCount} VERIFIED OFFERS ON {today}
                </p>
              </div>
            </div>
            {store.description && (
              <div className="mt-2 text-sm text-gray-600">
                {!expandedDesc ? (
                  <div className="flex items-baseline">
                    <span className="truncate">
                      {plainDescription}
                    </span>
                    {needsReadMore && (
                      <button
                        onClick={() => setExpandedDesc(true)}
                        className="ml-1 text-purple-700 font-medium text-xs underline whitespace-nowrap flex-shrink-0"
                        aria-expanded={expandedDesc}
                        aria-controls="store-description"
                      >
                        Read More
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <span
                      id="store-description"
                      className="prose text-gray-600 max-w-none"
                      dangerouslySetInnerHTML={{ __html: store.description }}
                    />
                    <button
                      onClick={() => setExpandedDesc(false)}
                      className="ml-1 text-purple-700 font-medium text-xs underline whitespace-nowrap"
                      aria-expanded={expandedDesc}
                      aria-controls="store-description"
                    >
                      Read Less
                    </button>
                  </div>
                )}
              </div>
            )}


          </div>
          {/* 🔹 Desktop Header */}
          <div className="hidden md:block mb-10 text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              {store.name} Coupon Codes
            </h1>
            <p className="text-gray-600 font-medium">
              {verifiedCount} VERIFIED OFFERS ON {today}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b text-sm font-medium mb-6">
            {(["all", "promo", "deal"] as const).map((tab) => (
              <button
                key={tab}
                className={`pb-2 ${activeTab === tab
                  ? "border-b-2 border-purple-700 text-purple-700"
                  : "hover:text-purple-600"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "all" && `All Coupons (${coupons.length})`}
                {tab === "promo" && `Promo Codes (${coupons.filter(c => c.couponType === "coupon" && (!c.expirationDate || new Date(c.expirationDate) >= new Date())).length})`}
                {tab === "deal" && `Deals (${coupons.filter(c => c.couponType === "deal" && (!c.expirationDate || new Date(c.expirationDate) >= new Date())).length})`}
              </button>
            ))}

          </div>

          {/* Coupons List */}
          <div className="space-y-6">
            {paginatedCoupons.length === 0 && (
              <p className="text-center text-gray-500">No coupons found.</p>
            )}

            {paginatedCoupons.map((coupon) => {
              const percent = extractPercent(coupon.discount);
              const userSaved = (percent / 100) * 100;
              const avgSavings = (percent / 100) * 50;

              return (
                <div
                  key={coupon._id}
                  className="flex flex-col border border-gray-200 rounded-xl bg-white shadow-md overflow-hidden"
                >
                  {/* Main Content Row (same as desktop) */}
                  <div className="flex flex-row items-stretch">
                    {/* Left Discount Section */}
                    <div className="flex flex-col items-center justify-center min-w-[90px] md:min-w-[120px] p-3 md:p-6 text-purple-700 font-bold">
                      {coupon.discount?.toLowerCase() === "free shipping" ? (
                        <>
                          <span className="text-lg md:text-3xl uppercase">Free</span>
                          <span className="text-[10px] md:text-sm uppercase">Shipping</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] md:text-sm uppercase">Up To</span>
                          <span className="text-lg md:text-3xl">{coupon.discount || "0%"}</span>
                          <span className="text-[10px] md:text-sm uppercase">Off</span>
                        </>
                      )}
                    </div>

                    {/* Middle Content */}
                    <div className="flex-1 p-3 md:p-6">
                      <div className="inline-block bg-gray-100 text-gray-700 text-[10px] md:text-xs font-semibold px-1.5 py-0.5 rounded mb-2 md:mb-3">
                        {coupon.couponType === "coupon" ? "Code" : "Deal"}
                      </div>
                      <h3 className="font-semibold text-sm md:text-xl text-gray-900 mb-2 md:mb-3 line-clamp-2">
                        {coupon.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 md:gap-3 text-[10px] md:text-sm">
                        {coupon.verified && (
                          <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium">
                            Verified
                          </span>
                        )}
                        <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          User saved ${userSaved.toFixed(2)}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                          Avg savings: ${avgSavings.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Right Actions (desktop only) */}
                    <div className="hidden md:flex flex-col items-center justify-center min-w-[120px] md:min-w-[200px] p-3 md:p-6 border-l border-gray-100">
                      <button
                        onClick={() => handleOpenCouponNewTab(coupon)}
                        className="relative w-36 h-11 bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm px-4 py-2 rounded-full text-center"
                      >
                        {coupon.couponType === "coupon" ? "Show Code" : "Get Deal"}
                        <span className="absolute top-0 right-0 w-4 h-5 bg-gradient-to-br from-white to-purple-700 rounded-tr-md"></span>
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); toggleDetails(coupon._id); }}
                        className="text-xs md:text-sm text-purple-700 mt-2 md:mt-3 font-medium hover:underline"
                      >
                        {expandedCoupons.includes(coupon._id) ? "Hide Details -" : "See Details +"}
                      </button>

                      <p className="mt-1 text-[11px] md:text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                        Used {coupon.uses} times
                      </p>
                    </div>
                  </div>

                  {/* Mobile-only Actions */}
                  <div className="flex flex-col md:hidden gap-2 p-3">
                    {/* Full-width button */}
                    <button
                      onClick={() => handleOpenCouponNewTab(coupon)}
                      className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm px-4 py-2 rounded-full text-center"
                    >
                      {coupon.couponType === "coupon" ? "Show Code" : "Get Deal"}
                    </button>

                    {/* Details + Used times row */}
                    <div className="flex justify-between items-center mt-2 text-[11px] text-gray-700">
                      <span
                        className="text-purple-700 font-medium hover:underline"
                        onClick={() => toggleDetails(coupon._id)}
                      >
                        {expandedCoupons.includes(coupon._id) ? "Hide Details -" : "See Details +"}
                      </span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                        Used {coupon.uses} times
                      </span>
                    </div>
                  </div>

                  {/* Expanded Description */}
                  {expandedCoupons.includes(coupon._id) && coupon.description && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50 text-sm text-gray-700">
                      {coupon.description}
                    </div>
                  )}
                </div>
              );
            })}


          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🟣 Store Discount Codes Table */}
      {filteredCoupons.length > 0 && (
        <div className="w-full max-w-7xl mx-auto mt-10 mb-8 bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">
              {store.name} Discount Codes Currently Available –{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 font-semibold">Description</th>
                  <th className="px-4 py-2 font-semibold w-28">Discount</th>
                  <th className="px-4 py-2 font-semibold w-32">End Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr
                    key={coupon._id}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => handleOpenCouponNewTab(coupon)}
                  >
                    <td className="px-4 py-2 text-gray-800">{coupon.title}</td>
                    <td className="px-4 py-2 font-semibold text-purple-700">
                      {coupon.discount || "—"}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {coupon.expirationDate
                        ? new Date(coupon.expirationDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                        : "Always active"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Store content */}
      {store.content && (
        <div className="max-w-[1150px] mx-auto mt-10 px-4 sm:px-6 md:px-8 py-8 bg-gray-100 rounded-lg shadow-md text-gray-800">
          <div
            className="prose text-gray-800 max-w-none"
            dangerouslySetInnerHTML={{ __html: store.content }}
          />
        </div>
      )}

      {/* 🟥 Expired Coupons Section */}
      {coupons.some(
        (c) => c.expirationDate && new Date(c.expirationDate) < new Date()
      ) && (
          <div ref={expiredSectionRef} className="w-full max-w-7xl mx-auto mt-12 text-center">
            {/* Section Heading */}
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
              Expired {store.name} Coupon Codes
            </h2>
            <p className="text-black mb-6">
              Check out these expired coupons for a {store.name} discount — sometimes they still work!
            </p>

            {/* Container Box (Wide) */}
            <div className="w-full max-w-7xl mx-auto rounded-xl p-4 md:p-6 bg-gray-50 shadow-sm space-y-6 text-left">
              {coupons
                .filter(
                  (c) => c.expirationDate && new Date(c.expirationDate) < new Date()
                )
                .map((coupon) => (
                  <div
                    key={coupon._id}
                    className="max-w-4xl w-full mx-auto flex flex-col border border-black rounded-xl bg-white shadow-md overflow-hidden opacity-75"
                  >
                    {/* ─── Main Row ─── */}
                    <div className="flex flex-row items-stretch">
                      {/* Left: Discount */}
                      <div className="flex flex-col items-center justify-center min-w-[90px] md:min-w-[120px] p-3 md:p-6 text-black font-bold">
                        {coupon.discount?.toLowerCase() === "free shipping" ? (
                          <>
                            <span className="text-lg md:text-3xl uppercase">Free</span>
                            <span className="text-[10px] md:text-sm uppercase">Shipping</span>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] md:text-sm uppercase">Up To</span>
                            <span className="text-lg md:text-3xl">
                              {coupon.discount || "0%"}
                            </span>
                            <span className="text-[10px] md:text-sm uppercase">Off</span>
                          </>
                        )}
                      </div>

                      {/* Middle: Content */}
                      <div className="flex-1 p-3 md:p-6">
                        <div className="inline-block bg-gray-100 text-black text-[10px] md:text-xs font-semibold px-1.5 py-0.5 rounded mb-2 md:mb-3">
                          {coupon.couponType === "coupon" ? "Code" : "Deal"}
                        </div>
                        <h3 className="font-semibold text-sm md:text-xl text-black mb-2 md:mb-3 line-clamp-2">
                          {coupon.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 md:gap-3 text-[10px] md:text-sm">
                          <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
                            Expired
                          </span>
                          {coupon.expirationDate && (
                            <span className="bg-gray-100 text-black px-1.5 py-0.5 rounded">
                              {new Date(coupon.expirationDate).toISOString().split("T")[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions (Desktop) */}
                      <div className="hidden md:flex flex-col items-center justify-center min-w-[120px] md:min-w-[200px] p-3 md:p-6 border-l border-black">
                        <button
                          onClick={() => handleOpenCouponNewTab(coupon)}
                          className="w-36 h-11 bg-black hover:bg-gray-500 text-white font-semibold text-sm px-4 py-2 rounded-full"
                        >
                          Expired
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDetails(coupon._id);
                          }}
                          className="text-xs md:text-sm text-purple-700 mt-2 md:mt-3 font-medium hover:underline"
                        >
                          {expandedCoupons.includes(coupon._id)
                            ? "Hide Details -"
                            : "See Details +"}
                        </button>
                        <p className="mt-1 text-[11px] md:text-xs bg-gray-100 text-black px-2 py-0.5 rounded-full font-medium">
                          Used {coupon.uses} times
                        </p>
                      </div>
                    </div>

                    {/* ─── Mobile Actions ─── */}
                    <div className="flex flex-col md:hidden gap-2 p-3">
                      <button
                        onClick={() => handleOpenCouponNewTab(coupon)}
                        className="w-full bg-black hover:bg-gray-500 text-white font-semibold text-sm px-4 py-2 rounded-full cursor-not-allowed"
                      >
                        Expired
                      </button>

                      <div className="flex justify-between items-center mt-2 text-[11px] text-black">
                        <span
                          className="text-purple-700 font-medium hover:underline"
                          onClick={() => toggleDetails(coupon._id)}
                        >
                          {expandedCoupons.includes(coupon._id)
                            ? "Hide Details -"
                            : "See Details +"}
                        </span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                          Used {coupon.uses} times
                        </span>
                      </div>
                    </div>

                    {/* ─── Expanded Description ─── */}
                    {expandedCoupons.includes(coupon._id) && coupon.description && (
                      <div className="border-t border-black p-4 bg-gray-50 text-sm text-black">
                        {coupon.description}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}



      {/* Coupon Modal */}
      <CouponModal
        storeName={store.name}
        title={selectedCoupon?.title}
        discount={selectedCoupon?.discount}
        code={selectedCoupon?.couponCode}
        redeemUrl={selectedCoupon?.couponUrl}
        description={selectedCoupon?.description}
        storeImageUrl={store?.image}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
