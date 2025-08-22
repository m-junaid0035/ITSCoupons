"use client";

import React from "react";
import Image from "next/image";
import type { BlogData } from "@/types/blog";

interface BlogShowProps {
  blog: BlogData;
}

export default function BlogShow({ blog }: BlogShowProps) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-800 mb-4 leading-tight">
        {blog.title}
      </h1>

      {blog.date && (
        <p className="text-gray-500 text-sm sm:text-base mb-6">
          {new Date(blog.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      {blog.image && (
        <div className="w-full h-64 sm:h-80 md:h-96 mb-8 overflow-hidden rounded-2xl shadow-lg relative">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover object-center transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>
      )}

      <div
        className="prose prose-purple max-w-full sm:prose-lg md:prose-xl mx-auto"
        dangerouslySetInnerHTML={{
          __html: blog.description || "<p>No description available.</p>",
        }}
      />

    </section>
  );
}
