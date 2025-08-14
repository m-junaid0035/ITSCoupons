"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

  if (loading) {
    return <div className="text-center py-20">Loading blogs...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (blogs.length === 0) {
    return <div className="text-center py-20 text-gray-500">No blogs available.</div>;
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

      {/* Featured Blogs */}
      <section className="py-12 px-4 max-w-6xl mx-auto space-y-8">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="border rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row"
          >
            {/* Blog Image */}
            {blog.image && (
              <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Blog Content */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                {blog.date && (
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(blog.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                <p className="text-sm text-gray-600 mb-4">
                  {blog.description || "No description available."}
                </p>
              </div>
              <div>
                <Link
                  href={`/blogs/${blog._id}`}
                  className="inline-block bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-md font-semibold"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
