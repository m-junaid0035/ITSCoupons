// app/page.tsx
import Blogs from "@/components/Blogs"; // Your Blogs component
import { fetchCategoryNamesAction } from "@/actions/categoryActions";
import { fetchAllBlogsAction } from "@/actions/blogActions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Blogs & Guides - ITSCoupons",
  description:
    "Read the latest blogs, guides, and saving tips from ITSCoupons. Learn how to maximize your discounts with verified coupons and promo codes.",
  alternates: {
    canonical: `${process.env.DOMAIN}/blogs`,
  },
  openGraph: {
    title: "All Blogs & Guides - ITSCoupons",
    description:
      "Explore saving tips, shopping hacks, and couponing guides from ITSCoupons. Stay updated with the latest money-saving strategies.",
    url: `${process.env.DOMAIN}/blogs`,
    type: "website",
    images: [
      {
        url: `${process.env.DOMAIN}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ITSCoupons Blogs Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Blogs & Guides - ITSCoupons",
    description:
      "Read money-saving blogs, coupon guides, and shopping tips on ITSCoupons. Stay ahead with the latest verified offers and advice.",
    images: [`${process.env.DOMAIN}/images/og-image.png`],
  },
}

export default async function Home() {
  // Fetch blogs and categories in parallel
  const [blogsResult, categoriesResult] = await Promise.allSettled([
    fetchAllBlogsAction(),
    fetchCategoryNamesAction(),
  ]);

  const blogs = blogsResult.status === "fulfilled" ? blogsResult.value?.data ?? [] : [];
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value?.data ?? [] : [];

  return <Blogs blogs={blogs} categories={categories} />;
}
