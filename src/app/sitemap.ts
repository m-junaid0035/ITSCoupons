// app/sitemap.ts
import type { MetadataRoute } from "next";

export const revalidate = 300; // regenerate every 5 minutes
const BASE_URL = "https://www.itscoupons.com";

// Fetch main static pages
async function getMainPages() {
  return [
    { slug: "/", lastModified: new Date() },
    { slug: "/about", lastModified: new Date() },
    { slug: "/contact", lastModified: new Date() },
    { slug: "/privacy-policy", lastModified: new Date() },
    { slug: "/terms", lastModified: new Date() },
    { slug: "/blog", lastModified: new Date() },
    { slug: "/stores", lastModified: new Date() },
  ];
}

// Dummy example: replace with DB/API calls
async function getBlogPosts() {
  return [
    { slug: "/blog/best-coupon-sites-2025", lastModified: new Date("2025-10-10") },
    { slug: "/blog/how-to-save-online", lastModified: new Date("2025-10-05") },
  ];
}

async function getStores() {
  return [
    { slug: "/stores/amazon", lastModified: new Date("2025-10-12") },
    { slug: "/stores/ebay", lastModified: new Date("2025-10-09") },
  ];
}

// ✅ Correct export format
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getMainPages();
  const blogs = await getBlogPosts();
  const stores = await getStores();

  const allPages = [...pages, ...blogs, ...stores];

  return allPages.map((page) => ({
    url: `${BASE_URL}${page.slug}`,
    lastModified: page.lastModified,
    changeFrequency: "daily",
    priority: 0.8,
  }));
}
