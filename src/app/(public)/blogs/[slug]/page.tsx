// app/blog/[id]/page.tsx
import React from "react";
import { fetchBlogBySlugAction } from "@/actions/blogActions";
import type { BlogData } from "@/types/blog";
import BlogShow from "@/components/BlogShow";

import { Metadata } from "next";

/* ---------------------- Generate Metadata Dynamically ---------------------- */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const result = await fetchBlogBySlugAction(slug);
  const blog: BlogData | null = result?.data ?? null;

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The blog you are looking for does not exist.",
    };
  }

  const metaTitle = blog.metaTitle || blog.title;
  const metaDescription = blog.metaDescription || blog.description || "";

  // ✅ Handle keywords correctly (string only, fallback to title)
  const metaKeywords =
    blog.metaKeywords ||
    blog.focusKeywords ||
    blog.title;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      url: `${process.env.DOMAIN}/blog/${blog._id}/${blog.slug}`,
      images: [
        {
          url: blog.image || `${process.env.DOMAIN}/default-blog.jpg`,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [blog.image || `${process.env.DOMAIN}/default-blog.jpg`],
    },
  };
}


/* ---------------------- Blog Page Component ---------------------- */
export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await fetchBlogBySlugAction(decodeURIComponent(slug));
  const blog: BlogData | null = result.data ?? null;

  if (!blog) {
    return (
      <div className="py-16 text-center text-red-600">
        <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="text-lg">
          {result.error?.message || "Failed to load the blog."}
        </p>
      </div>
    );
  }

  return <BlogShow blog={blog} />;
}
