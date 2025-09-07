"use client";

import React, { ReactElement, useMemo, useState, useEffect } from "react";
import { FaSortAmountDown } from "react-icons/fa";
import type { CouponWithStoreData } from "@/types/couponsWithStoresData";
import CouponModal from "@/components/coupon_popup";
import type { CategoryData } from "@/types/category";

interface AllCouponsPageProps {
  category: string | undefined;
  coupons: CouponWithStoreData[];
  categories?: CategoryData[];
  couponId?: string;
}

function extractPercent(discount?: string | null): number {
  if (!discount) return 0;
  const m = /([0-9]{1,3})%/.exec(discount);
  return m ? Number(m[1]) : 0;
}

function pluralize(n: number, s: string, p = s + "s") {
  return `${n} ${n === 1 ? s : p}`;
}

/* ─────────────────────────── Component ─────────────────────────── */
export default function AllCouponsPage({
  coupons,
  categories = [],
  couponId,
  category,
}: AllCouponsPageProps): ReactElement {
  const [activeTab, setActiveTab] = useState<"all" | "promo" | "deal">("all");

  // Sidebar filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [quickVerified, setQuickVerified] = useState(false);
  const [quickCodesOnly, setQuickCodesOnly] = useState(false);
  const [quickDealsOnly, setQuickDealsOnly] = useState(false);
  const [quickFreeShipping, setQuickFreeShipping] = useState(false);

  // Sorting & pagination
  const [sortBy, setSortBy] = useState<"relevance" | "newest" | "discount_desc" | "discount_asc" | "most_used">("relevance");
  const [perPage, setPerPage] = useState<number>(10);
  const [page, setPage] = useState(1);

  // Modal
  const [selectedCoupon, setSelectedCoupon] = useState<CouponWithStoreData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ───────── URL couponId support ─────────
  useEffect(() => {
    if (couponId) {
      const coupon = coupons.find(c => c._id === couponId);
      if (coupon) {
        setSelectedCoupon(coupon);
        setIsModalOpen(true);
      }
    }
  }, [couponId, coupons]);

  useEffect(() => {
    if (category) {
      const matchedCategory = categories.find(
        (c) => c._id === category || c.slug === category || c.name === category
      );
      if (matchedCategory) {
        setSelectedCategories([matchedCategory._id]);
      }
    }
  }, [category, categories]);

  // ─── Filter coupons
  const filtered = useMemo(() => {
    let arr = coupons.slice();

    if (activeTab === "promo") arr = arr.filter(c => c.couponType === "coupon");
    if (activeTab === "deal") arr = arr.filter(c => c.couponType === "deal");

    if (selectedCategories.length) {
      arr = arr.filter(c => c.store?.categories?.some(catId => selectedCategories.includes(catId)));
    }

    if (quickVerified) arr = arr.filter(c => Boolean(c.verified));
    if (quickCodesOnly) arr = arr.filter(c => c.couponType === "coupon");
    if (quickDealsOnly) arr = arr.filter(c => c.couponType === "deal");
    if (quickFreeShipping) arr = arr.filter(c => (c.discount || "").toLowerCase().includes("free ship"));

    return arr;
  }, [coupons, activeTab, selectedCategories, quickVerified, quickCodesOnly, quickDealsOnly, quickFreeShipping]);

  // ─── Sorting
  const sorted = useMemo(() => {
    const arr = filtered.slice();
    switch (sortBy) {
      case "discount_desc":
        arr.sort((a, b) => extractPercent(b.discount) - extractPercent(a.discount));
        break;
      case "discount_asc":
        arr.sort((a, b) => extractPercent(a.discount) - extractPercent(b.discount));
        break;
      case "most_used":
        arr.sort((a, b) => (b.uses || 0) - (a.uses || 0));
        break;
      case "newest":
        arr.sort((a, b) => {
          const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bd - ad;
        });
        break;
      default:
        break;
    }
    return arr;
  }, [filtered, sortBy]);

  // ─── Pagination
  const total = sorted.length;
  const totalPages = perPage === Infinity ? 1 : Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    if (perPage === Infinity) return sorted;
    const start = (safePage - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [sorted, perPage, safePage]);

  useEffect(() => {
    setPage(1);
  }, [perPage, activeTab, selectedCategories, quickVerified, quickCodesOnly, quickDealsOnly, quickFreeShipping, sortBy]);

  // ───────── Open coupon in new tab & modal
  const handleOpenCouponNewTab = (coupon: CouponWithStoreData) => {
    const url = `/coupons/?couponId=${coupon._id}`;
    window.open(url, "_blank", "noopener,noreferrer");
    if (coupon.couponUrl) {
      window.location.href = coupon.couponUrl;
    }
  };

  // ───────── Render ─────────
  return (
    <div className="px-4 md:px-10 py-10 max-w-7xl mx-auto text-gray-800">
      <h2 className="text-3xl font-bold mb-6">All Coupons</h2>

      {/* Top bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm text-gray-600 mb-6">
        <div>{`Showing ${paginated.length} of ${pluralize(total, "coupon")}`}</div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span>Per page:</span>
            <select
              className="border rounded px-2 py-1"
              value={perPage === Infinity ? "all" : String(perPage)}
              onChange={(e) => setPerPage(e.target.value === "all" ? Infinity : Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="all">All</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <FaSortAmountDown className="opacity-60" />
            <span>Sort by:</span>
            <select className="border rounded px-2 py-1" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="discount_desc">Discount: High → Low</option>
              <option value="discount_asc">Discount: Low → High</option>
              <option value="most_used">Most Used</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b text-sm font-medium mb-6">
        {(["all", "promo", "deal"] as const).map((tab) => (
          <button
            key={tab}
            className={`pb-2 ${activeTab === tab ? "border-b-2 border-purple-700 text-purple-700" : "hover:text-purple-600"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "all" && `All Coupons (${coupons.length})`}
            {tab === "promo" && `Promo Codes (${coupons.filter((c) => c.couponType === "coupon").length})`}
            {tab === "deal" && `Deals (${coupons.filter((c) => c.couponType === "deal").length})`}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Mobile Filters (dropdown) */}
        <div className="md:hidden mb-6">
          <details className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
            <summary className="cursor-pointer px-4 py-3 font-semibold text-gray-700">
              Filters
            </summary>
            <div className="p-4 space-y-6 text-sm">
              {/* Categories */}
              <div>
                <h4 className="font-semibold mb-3">Categories</h4>
                <ul className="space-y-2 max-h-60 overflow-auto pr-1">
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-purple-600"
                        checked={selectedCategories.length === 0}
                        onChange={() => setSelectedCategories([])}
                      />
                      <span>All Categories ({coupons.length})</span>
                    </label>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="accent-purple-600"
                          checked={selectedCategories.includes(cat._id)}
                          onChange={(e) => {
                            setSelectedCategories((prev) => {
                              if (e.target.checked) return [...new Set([...prev, cat._id])];
                              return prev.filter((c) => c !== cat._id);
                            });
                          }}
                        />
                        <span>{cat.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Filters */}
              <div>
                <h4 className="font-semibold mb-3">Quick Filters</h4>
                <ul className="space-y-2">
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-purple-600" checked={quickVerified} onChange={(e) => setQuickVerified(e.target.checked)} />
                      <span>Currently Verified</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-purple-600" checked={quickCodesOnly} onChange={(e) => setQuickCodesOnly(e.target.checked)} />
                      <span>Coupon Codes</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-purple-600" checked={quickDealsOnly} onChange={(e) => setQuickDealsOnly(e.target.checked)} />
                      <span>Offers / Deals</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-purple-600" checked={quickFreeShipping} onChange={(e) => setQuickFreeShipping(e.target.checked)} />
                      <span>Free Shipping</span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </details>
        </div>

        {/* Sidebar for desktop */}
        <aside className="hidden md:block w-full md:w-1/4 space-y-6 text-sm">
          {/* Categories */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 max-h-72 overflow-auto pr-1">
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-purple-600"
                    checked={selectedCategories.length === 0}
                    onChange={() => setSelectedCategories([])}
                  />
                  <span>All Categories ({coupons.length})</span>
                </label>
              </li>
              {categories.map((cat) => (
                <li key={cat._id}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-purple-600"
                      checked={selectedCategories.includes(cat._id)}
                      onChange={(e) => {
                        setSelectedCategories((prev) => {
                          if (e.target.checked) return [...new Set([...prev, cat._id])];
                          return prev.filter((c) => c !== cat._id);
                        });
                      }}
                    />
                    <span>{cat.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Filters */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold mb-3">Quick Filters</h4>
            <ul className="space-y-2">
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-purple-600" checked={quickVerified} onChange={(e) => setQuickVerified(e.target.checked)} />
                  <span>Currently Verified</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-purple-600" checked={quickCodesOnly} onChange={(e) => setQuickCodesOnly(e.target.checked)} />
                  <span>Coupon Codes</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-purple-600" checked={quickDealsOnly} onChange={(e) => setQuickDealsOnly(e.target.checked)} />
                  <span>Offers / Deals</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-purple-600" checked={quickFreeShipping} onChange={(e) => setQuickFreeShipping(e.target.checked)} />
                  <span>Free Shipping</span>
                </label>
              </li>
            </ul>
          </div>
        </aside>

        {/* Results */}
        <section className="w-full md:w-3/4 space-y-6">
          {paginated.length === 0 && <p>No coupons match your filters.</p>}

          {paginated.map((coupon) => {
            const percent = extractPercent(coupon.discount);
            const userSaved = (percent / 100) * 100; // assume base $100
            const avgSavings = (percent / 100) * 50; // assume avg purchase $50

            return (
              <div
                key={coupon._id}
                className="flex items-stretch border border-gray-200 rounded-xl bg-white shadow-md overflow-hidden"
              >
                {/* Left Discount Section */}
                <div className="flex flex-col items-center justify-center min-w-[90px] md:min-w-[120px] p-3 md:p-6 text-purple-700 font-bold">
                  <span className="text-[10px] md:text-sm uppercase">Up To</span>
                  <span className="text-lg md:text-3xl">{coupon.discount || "0%"}</span>
                  <span className="text-[10px] md:text-sm uppercase">Off</span>
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

                {/* Right Actions */}
                <div className="flex flex-col items-center justify-center min-w-[120px] md:min-w-[200px] p-3 md:p-6 border-l border-gray-100">
                  <button
                    onClick={() => handleOpenCouponNewTab(coupon)}
                    className="relative bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs md:text-base px-4 md:px-8 py-2 md:py-3 rounded-full"
                  >
                     {coupon.couponType === "coupon" ? "Show Code" : "Get Deal"}
                    <span className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-white to-purple-700 rounded-tr-md"></span>
                  </button>
                  <button className="text-xs md:text-sm text-gray-500 mt-2 md:mt-3 hover:underline">
                    See Details +
                  </button>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`px-3 py-1 rounded border ${page === 1 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "text-purple-700 border-purple-200 hover:bg-purple-50"}`}
              >
                Previous
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`h-8 w-8 rounded border text-sm ${n === page ? "bg-purple-700 text-white border-purple-700" : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`px-3 py-1 rounded border ${page === totalPages ? "text-gray-400 border-gray-200 cursor-not-allowed" : "text-purple-700 border-purple-200 hover:bg-purple-50"}`}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>

      <CouponModal
        storeName={selectedCoupon?.store?.name}
        storeImageUrl={selectedCoupon?.store?.image}
        title={selectedCoupon?.title}
        discount={selectedCoupon?.discount}
        code={selectedCoupon?.couponCode}
        redeemUrl={selectedCoupon?.couponUrl}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
