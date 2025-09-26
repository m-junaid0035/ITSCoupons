"use client";

import React from "react";
import Image from "next/image";
import type { BlogData } from "@/types/blog";

interface BlogSectionProps {
  blogs: BlogData[];
}

export default function BlogSection({ blogs }: BlogSectionProps): JSX.Element {
  if (!blogs.length) {
    return <p className="text-center py-10">No blogs available.</p>;
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-8">
        The Latest from our blogs
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 max-w-6xl mx-auto justify-items-center">
        {blogs.map((blog, index) => {
          const formattedDate = blog.date
            ? new Date(blog.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "";

          return (
            <div
              key={blog._id}
              className="flex flex-col items-center w-full max-w-[301px]"
            >
              {/* Image box */}
              <div className="w-full h-[160px] bg-gray-200 rounded-[12px] overflow-hidden flex items-center justify-center border border-gray-100">
                {blog.image ? (
                  <Image
                    src={`https://itscoupons.com${blog.image}`}
                    alt={blog.title || "Blog image"}
                    width={301}
                    height={160}
                    priority={index < 4} // preload first row
                    loading={index < 4 ? "eager" : "lazy"}
                    className="-mt-6 w-full h-full object-contain bg-white p-2 transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <span className="text-gray-400 text-sm flex items-center justify-center h-full">
                    No Image
                  </span>
                )}
              </div>

              {/* Lower content box */}
              <div
                className="w-full min-h-[148px] bg-white rounded-[12px] shadow-md -mt-6 z-10 flex flex-col justify-between p-4 text-left"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <p className="text-xs text-gray-500">{formattedDate}</p>
                <h3 className="text-sm font-semibold line-clamp-2">
                  {blog.title}
                </h3>
                <a
                  href={`/blogs/${blog.slug}`}
                  className="text-purple-700 font-semibold hover:underline flex items-center text-sm"
                >
                  Read More... <span className="ml-1 text-purple-700">→</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
