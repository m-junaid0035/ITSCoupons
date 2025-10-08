import React from "react";
import type { Metadata } from "next";
import type { BlogData } from "@/types/blog";
import type { CouponWithStoreData } from "@/types/couponsWithStoresData";
import { fetchBlogBySlugAction, fetchTopBlogsAction } from "@/actions/blogActions";
import { fetchTopDealsWithStoresAction } from "@/actions/couponActions";
import BlogClient from "./BlogClient";
import BlogNotFound from "./BlogNotFound";

export default async function BlogPage({ params, searchParams } : { params:  Promise<{ slug: string;}>, searchParams: Promise<{ couponId?: string; }>}) {
  const { slug } = await params;
  const {couponId} =  await searchParams;

  // Fetch blog, top blogs, and top deals in parallel
  const blogRes = await fetchBlogBySlugAction(decodeURIComponent(slug));
  const blog: BlogData | null = blogRes?.data ?? null;

  if (!blog) return <BlogNotFound />;

  const [topBlogsRes, topDealsRes] = await Promise.all([
    fetchTopBlogsAction(),
    fetchTopDealsWithStoresAction(),
  ]);

  const topBlogs: BlogData[] = topBlogsRes?.data?.filter((b: any) => b._id !== blog._id) ?? [];
  const topDeals: CouponWithStoreData[] = topDealsRes?.data ?? [];

  return (
    <BlogClient
      blog={blog}
      topBlogs={topBlogs}
      topDeals={topDeals}
      couponId={couponId}
      slug={slug} // <-- pass couponId to client component
    />
  );
}

/* ---------------------- Optional Metadata ---------------------- */
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const blogRes = await fetchBlogBySlugAction(decodeURIComponent(slug));
  const blog: BlogData | null = blogRes?.data ?? null;

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
  const blogImage = blog.image?.startsWith("http")
    ? blog.image
    : `${process.env.DOMAIN}${blog.image || "/default-blog.jpg"}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: { canonical: blogUrl },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      url: blogUrl,
      images: [{ url: blogImage, width: 1200, height: 630, alt: blog.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [blogImage],
    },
    metadataBase: new URL(process.env.DOMAIN || "https://itscoupons.com"),
  };
}
