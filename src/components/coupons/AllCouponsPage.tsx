"use client";

import React, { ReactElement, useMemo, useState, useEffect } from "react";
import { FaSortAmountDown } from "react-icons/fa";
import type { CouponWithStoreData } from "@/types/couponsWithStoresData";
import CouponModal from "@/components/coupon_popup";
import type { CategoryData } from "@/types/category";
import { CheckCircle, Clock } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface AllCouponsPageProps {
  coupons: CouponWithStoreData[];
  categories?: CategoryData[];
}

/* ─────────────────────────── Helpers ─────────────────────────── */
function getDiscountColor(discount: string): string {
  if (!discount) return "bg-gray-400";
  const discountLower = discount.toLowerCase();
  if (discountLower.includes("free ship") || discountLower.includes("free shipping")) {
    return "bg-yellow-400 text-black";
  }
  const match = discountLower.match(/(\d+)%/);
  if (match) {
    const value = parseInt(match[1], 10);
    return value >= 20 ? "bg-purple-700" : "bg-orange-500";
  }
  return "bg-gray-400";
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
  const searchParams = useSearchParams();
  useEffect(() => {
    const couponId = searchParams.get("couponId");
    if (couponId) {
      const coupon = coupons.find(c => c._id === couponId);
      if (coupon) {
        setSelectedCoupon(coupon);
        setIsModalOpen(true);
      }
    }
  }, [searchParams, coupons]);

  // ─── Filter coupons
  const filtered = useMemo(() => {
    let arr = coupons.slice();

    // Tabs
    if (activeTab === "promo") arr = arr.filter(c => c.couponType === "coupon");
    if (activeTab === "deal") arr = arr.filter(c => c.couponType === "deal");

    // Categories
    if (selectedCategories.length) {
      arr = arr.filter(c => c.store?.categories?.some(catId => selectedCategories.includes(catId)));
    }

    // Quick filters
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
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 space-y-6 text-sm">
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

          {paginated.map((coupon) => (
            <div key={coupon._id} className="flex border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className={`w-1/6 min-w-[80px] flex items-center justify-center text-white text-lg font-bold p-4 ${getDiscountColor(coupon.discount || "")}`}>
                {coupon.discount || (coupon.couponType === "deal" ? "Deal" : "Code")}
              </div>

              <div className="flex-1 p-4">
                <h3 className="font-semibold text-base mb-1">{coupon.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{coupon.description}</p>
              </div>

              <div className="flex flex-col items-end justify-between p-4 w-[170px] border-l border-gray-100">
                <button
                  onClick={() => handleOpenCouponNewTab(coupon)}
                  className={`text-white text-sm font-semibold w-full py-2 rounded ${coupon.couponType === "coupon" ? "bg-purple-700 hover:bg-purple-800" : "bg-orange-500 hover:bg-orange-600"}`}
                >
                  {coupon.couponType === "coupon" ? "GET CODE" : "GET DEAL"}
                </button>
                <div className="text-xs mt-2 text-right flex flex-col items-end gap-1">
                  {coupon.verified && (
                    <div className="flex items-center gap-1 text-purple-600 font-medium text-sm">
                      <CheckCircle size={16} /> Coupon verified
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Clock size={14} /> {coupon.uses || 0} used today
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className={`px-3 py-1 rounded border ${page === 1 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "text-purple-700 border-purple-200 hover:bg-purple-50"}`}>Previous</button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => setPage(n)} className={`h-8 w-8 rounded border text-sm ${n === page ? "bg-purple-700 text-white border-purple-700" : "border-gray-200 hover:bg-gray-50"}`}>{n}</button>
                ))}
              </div>
              <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className={`px-3 py-1 rounded border ${page === totalPages ? "text-gray-400 border-gray-200 cursor-not-allowed" : "text-purple-700 border-purple-200 hover:bg-purple-50"}`}>Next</button>
            </div>
          )}
        </section>
      </div>

      <CouponModal
        storeName={selectedCoupon?.store?.name}
        storeImageUrl={selectedCoupon?.store?.image}
        title={selectedCoupon?.title}
        code={selectedCoupon?.couponCode}
        redeemUrl={selectedCoupon?.couponUrl}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
