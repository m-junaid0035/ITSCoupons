// app/blog/[id]/page.tsx
import React from "react";
import { fetchBlogBySlugAction } from "@/actions/blogActions";
import type { BlogData } from "@/types/blog";
import BlogShow from "@/components/BlogShow";
import { Metadata } from "next";
import BlogNotFound from "./BlogNotFound";

/* ---------------------- Generate Metadata Dynamically ---------------------- */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const result = await fetchBlogBySlugAction(decodeURIComponent(slug));
  const blog: BlogData | null = result?.data ?? null;

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The blog you are looking for does not exist.",
    };
  }

  const metaTitle = blog.metaTitle || blog.title;
  const metaDescription = blog.metaDescription || blog.description || "";
  const metaKeywords = blog.metaKeywords || blog.focusKeywords || blog.title;
  const blogUrl = `${process.env.DOMAIN}/blog/${blog.slug}`;
  const blogImage = blog.image
    ? blog.image.startsWith("http")
      ? blog.image
      : `${process.env.DOMAIN}${blog.image}`
    : `${process.env.DOMAIN}/default-blog.jpg`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: {
      canonical: blogUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      url: blogUrl,
      images: [
        {
          url: blogImage,
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
      images: [blogImage],
    },
    // Optional: structured data for blog article
    metadataBase: new URL(process.env.DOMAIN || "https://itscoupons.com"),
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
    return <BlogNotFound />;
  }

  return <BlogShow blog={blog} />;
}
