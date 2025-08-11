"use client";

import { useEffect, useState } from "react";
import type { BlogData } from "@/types/blog";
import { fetchAllBlogsAction } from "@/actions/blogActions"; // adjust import path as needed

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBlogs() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAllBlogsAction();
        if (result.error) {
          setError(result.error.message?.[0] || "Failed to fetch blogs");
          setBlogs([]);
        } else if (result.data && Array.isArray(result.data)) {
          setBlogs(result.data);
        } else {
          setBlogs([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch blogs");
      }
      setLoading(false);
    }
    loadBlogs();
  }, []);

  // For example, use first 3 as featured, rest recent titles
  const featured = blogs.slice(0, 3);
  const recent = blogs.slice(3);

  if (loading) {
    return <div className="text-center py-20">Loading blogs...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="text-gray-800">
      {/* Hero Section */}
      <section className="bg-purple-800 text-white text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">Coupon Hunt Blogs</h1>
        <p className="text-sm max-w-2xl mx-auto">
          Stay updated with expert saving strategies, shopping guides, and industry
          insights that help you shop smarter every day.
        </p>
      </section>

      {/* Blog Tabs (static for now) */}
      <section className="py-10 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">
          Money-Saving Insights & Tips
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm font-medium">
          {[
            "All",
            "Shopping Tips",
            "Black Friday",
            "Coupon Stacking",
            "Grocery Savings",
          ].map((tab, i) => (
            <button
              key={i}
              className={`px-4 py-2 border rounded-full ${
                i === 0
                  ? "bg-purple-700 text-white"
                  : "text-purple-700 border-purple-300 hover:bg-purple-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Featured Blogs */}
        <div className="space-y-8">
          {featured.map((item) => (
            <div key={item._id} className="border rounded-xl shadow-sm overflow-hidden">
              <div className="bg-purple-700 text-white px-6 py-4 text-lg font-bold">
                {/* Using slug or metaTitle as category fallback */}
                {item.metaTitle || item.slug || "Category"}
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-xs text-gray-500">
                  {/* Format date to readable */}
                  {item.date
                    ? new Date(item.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-10 px-4 max-w-5xl mx-auto">
        <h3 className="text-lg font-semibold mb-6">Recent Articles</h3>
        <div className="space-y-6">
          {recent.length === 0 && (
            <p className="text-center text-gray-500">No recent articles.</p>
          )}
          {recent.map((item) => (
            <div
              key={item._id}
              className="flex items-start border-l-4 border-purple-600 pl-4 pb-3"
            >
              <div className="text-sm">
                <p className="font-medium text-purple-700 mb-1">
                  {/* fallback category */}
                  {item.metaTitle || item.slug || "Category"}
                </p>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.date
                    ? new Date(item.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded">
            Load More Articles
          </button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-100 py-12 px-4 text-center">
        <h3 className="text-lg font-semibold mb-2">Stay Updated with Our Latest Deals</h3>
        <p className="text-sm text-gray-600 mb-4">
          Join our newsletter for exclusive savings, new coupons, and more.
        </p>
        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <button className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-md">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
