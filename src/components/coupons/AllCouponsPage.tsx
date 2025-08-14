"use client";

import React, { ReactElement, useMemo, useState } from "react";
import { FaSortAmountDown } from "react-icons/fa";
import type { CouponWithStoreData } from "@/types/couponsWithStoresData";

interface AllCouponsPageProps {
  coupons: CouponWithStoreData[];
  loading: boolean;
  error: string | null;
}

/* ────────────────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────────────────── */
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

/* ────────────────────────────────────────────────────────────────────────────
   Modal (unchanged, refined visuals)
   ──────────────────────────────────────────────────────────────────────────── */
function CouponModal({
  coupon,
  isOpen,
  onClose,
}: {
  coupon: CouponWithStoreData | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  if (!isOpen || !coupon) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.couponCode || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
          aria-label="Close"
        >
          ×
        </button>

        <div className="p-8">
          <div className="mx-auto -mt-12 mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-[#2b5aa6] text-white shadow-md">
            <span className="text-2xl font-semibold">C</span>
          </div>

          <h2 className="text-center text-2xl font-semibold text-slate-900">{coupon.title}</h2>
          <p className="mt-3 text-center text-sm text-slate-600">
            Copy and paste this code at{" "}
            <span className="font-medium text-[#2b5aa6]">{coupon.storeName}</span>
          </p>

          <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
            <div className="rounded-md bg-slate-100 p-1">
              <div className="flex items-center justify-center rounded-md bg-[#8d5ab9]/20 p-3">
                <span className="font-semibold tracking-wider text-[#8d5ab9]">
                  {coupon.couponCode || "No code available"}
                </span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="rounded-md bg-[#7a2db6] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:opacity-100"
            >
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Main Page with full client-side filters, sorting & pagination
   ──────────────────────────────────────────────────────────────────────────── */
export default function AllCouponsPage({ coupons, loading, error }: AllCouponsPageProps): ReactElement {
  const [activeTab, setActiveTab] = useState<"all" | "promo" | "deal">("all");

  // sidebar state
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [quickVerified, setQuickVerified] = useState(false);
  const [quickCodesOnly, setQuickCodesOnly] = useState(false);
  const [quickDealsOnly, setQuickDealsOnly] = useState(false);
  const [quickFreeShipping, setQuickFreeShipping] = useState(false);

  // sort & pagination state
  const [sortBy, setSortBy] = useState<
    "relevance" | "newest" | "discount_desc" | "discount_asc" | "most_used"
  >("relevance");
  const [perPage, setPerPage] = useState<number>(10);
  const [page, setPage] = useState(1);

  // modal
  const [selectedCoupon, setSelectedCoupon] = useState<CouponWithStoreData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // derived lists
  const storeCounts = useMemo(() => {
    const map = new Map<string, number>();
    coupons.forEach((c) => {
      const name = c.storeName || "Unknown";
      map.set(name, (map.get(name) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [coupons]);

  // build filtered list according to tabs + sidebar quick filters
  const filtered = useMemo(() => {
    let arr = coupons.slice();

    // tabs
    if (activeTab === "promo") arr = arr.filter((c) => c.couponType === "coupon");
    if (activeTab === "deal") arr = arr.filter((c) => c.couponType === "deal");

    // sidebar store filter
    if (selectedStores.length) {
      const set = new Set(selectedStores);
      arr = arr.filter((c) => set.has(c.storeName || "Unknown"));
    }

    // quick filters
    if (quickVerified) arr = arr.filter((c) => Boolean(c.verified));
    if (quickCodesOnly) arr = arr.filter((c) => c.couponType === "coupon");
    if (quickDealsOnly) arr = arr.filter((c) => c.couponType === "deal");
    if (quickFreeShipping)
      arr = arr.filter((c) => (c.discount || "").toLowerCase().includes("free ship"));

    return arr;
  }, [coupons, activeTab, selectedStores, quickVerified, quickCodesOnly, quickDealsOnly, quickFreeShipping]);

  // sorting
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
          const ad = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
          const bd = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
          return bd - ad;
        });
        break;
      default:
        // relevance (keep as-is)
        break;
    }
    return arr;
  }, [filtered, sortBy]);

  // pagination
  const total = sorted.length;
  const totalPages = perPage === Infinity ? 1 : Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    if (perPage === Infinity) return sorted;
    const start = (safePage - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [sorted, perPage, safePage]);

  // reset page when dependencies change
  React.useEffect(() => {
    setPage(1);
  }, [perPage, activeTab, selectedStores, quickVerified, quickCodesOnly, quickDealsOnly, quickFreeShipping, sortBy]);

  /* ────────────────────────────────────────────────────────────────────────── */
  return (
    <div className="px-4 md:px-10 py-10 max-w-7xl mx-auto text-gray-800">
      {/* header */}
      <h2 className="text-3xl font-bold mb-6">All Coupons</h2>

      {/* top bar: status + per page + sort */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm text-gray-600 mb-6">
        <div>
          {loading
            ? "Loading coupons..."
            : error
            ? `Error: ${error}`
            : `Showing ${paginated.length} of ${pluralize(total, "coupon")}`}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span>Per page:</span>
            <select
              className="border rounded px-2 py-1"
              disabled={loading}
              value={perPage === Infinity ? "all" : String(perPage)}
              onChange={(e) => {
                const v = e.target.value;
                setPerPage(v === "all" ? Infinity : Number(v));
              }}
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
            <select
              className="border rounded px-2 py-1"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
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
            className={`pb-2 ${
              activeTab === tab
                ? "border-b-2 border-purple-700 text-purple-700"
                : "hover:text-purple-600"
            }`}
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
          {/* Categories (Stores) */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 max-h-72 overflow-auto pr-1">
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-purple-600"
                    checked={selectedStores.length === 0}
                    onChange={() => setSelectedStores([])}
                  />
                  <span>All Stores ({coupons.length})</span>
                </label>
              </li>
              {storeCounts.map(([name, count]) => (
                <li key={name}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-purple-600"
                      checked={selectedStores.includes(name)}
                      onChange={(e) => {
                        setSelectedStores((prev) => {
                          if (e.target.checked) return [...new Set([...prev, name])];
                          return prev.filter((s) => s !== name);
                        });
                      }}
                    />
                    <span>
                      {name} ({count})
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort By (duplicate small control for sidebar look) */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <FaSortAmountDown className="opacity-60" /> Sort By
            </h4>
            <select
              className="w-full border rounded px-2 py-1"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="discount_desc">Discount: High → Low</option>
              <option value="discount_asc">Discount: Low → High</option>
              <option value="most_used">Most Used</option>
            </select>
          </div>

          {/* Quick Filters */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold mb-3">Quick Filters</h4>
            <ul className="space-y-2">
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-purple-600"
                    checked={quickVerified}
                    onChange={(e) => setQuickVerified(e.target.checked)}
                  />
                  <span>Currently Verified</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-purple-600"
                    checked={quickCodesOnly}
                    onChange={(e) => setQuickCodesOnly(e.target.checked)}
                  />
                  <span>Coupon Codes</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-purple-600"
                    checked={quickDealsOnly}
                    onChange={(e) => setQuickDealsOnly(e.target.checked)}
                  />
                  <span>Offers / Deals</span>
                </label>
              </li>
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-purple-600"
                    checked={quickFreeShipping}
                    onChange={(e) => setQuickFreeShipping(e.target.checked)}
                  />
                  <span>Free Shipping</span>
                </label>
              </li>
            </ul>
          </div>
        </aside>

        {/* Results */}
        <section className="w-full md:w-3/4 space-y-6">
          {loading && <p>Loading coupons...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && sorted.length === 0 && <p>No coupons match your filters.</p>}

          {!loading && !error && paginated.map((coupon) => (
            <div key={coupon._id} className="flex border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div
                className={`w-1/6 min-w-[80px] flex items-center justify-center text-white text-lg font-bold p-4 ${getDiscountColor(
                  coupon.discount || ""
                )}`}
              >
                {coupon.discount || (coupon.couponType === "deal" ? "Deal" : "Code")}
              </div>

              <div className="flex-1 p-4">
                <h3 className="font-semibold text-base mb-1">{coupon.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{coupon.description}</p>
              </div>

              <div className="flex flex-col items-end justify-between p-4 w-[170px] border-l border-gray-100">
                <div className="w-full flex flex-col items-end space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCoupon(coupon);
                      setIsModalOpen(true);
                    }}
                    className={`text-white text-sm font-semibold w-full py-2 rounded ${
                      coupon.couponType === "coupon"
                        ? "bg-[#7a2db6] hover:bg-[#6a26a0]"
                        : "bg-purple-700 hover:bg-purple-800"
                    }`}
                  >
                    {coupon.couponType === "coupon" ? "GET CODE" : "GET DEAL"}
                  </button>

                  <div className="text-xs bg-gray-100 w-full text-center py-1 rounded text-gray-700 tracking-wider">
                    {coupon.couponCode || "N/A"}
                  </div>
                </div>
                <div className="text-xs text-right mt-3 space-y-1">
                  {coupon.verified && <div className="text-purple-600 font-medium">Coupon verified</div>}
                  <div className="text-gray-600">{coupon.uses || 0} used today</div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <button
                className={`px-3 py-1 rounded border ${page === 1 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "text-purple-700 border-purple-200 hover:bg-purple-50"}`}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`h-8 w-8 rounded border text-sm ${
                      n === page ? "bg-purple-700 text-white border-purple-700" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                className={`px-3 py-1 rounded border ${page === totalPages ? "text-gray-400 border-gray-200 cursor-not-allowed" : "text-purple-700 border-purple-200 hover:bg-purple-50"}`}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>

      <CouponModal coupon={selectedCoupon} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}