import { connectToDatabase } from "@/lib/db";
import { Store } from "@/models/Store";
import { Blog } from "@/models/Blog";
import { Coupon } from "@/models/Coupon";
import { StaticPage } from "@/models/StaticPage";

export const dynamic = "force-dynamic"; // always rebuild dynamically

export default async function sitemap() {
  await connectToDatabase();

  const baseUrl = process.env.DOMAIN;

  // 🧱 Static pages (always present)
  const staticRoutes = [
    "",
    "/coupons",
    "/categories",
    "/contactus",
    "/stores",
    "/blogs",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  // 🏪 Fetch dynamic collections
  const [stores, blogs, staticPages] = await Promise.all([
    Store.find({}, "slug updatedAt createdAt"),
    Blog.find({}, "slug updatedAt createdAt"),
    StaticPage.find({}, "slug updatedAt createdAt"),
  ]);

  // 🏪 Store URLs
  const storeRoutes = stores.map((store) => ({
    url: `${baseUrl}/stores/${store.slug}`,
    lastModified: store.updatedAt || store.createdAt || new Date(),
  }));

  // 📰 Blog URLs
  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: blog.updatedAt || blog.createdAt || new Date(),
  }));

  // 📄 Static Pages (About, Privacy, etc.)
  const staticPageRoutes = staticPages.map((page) => ({
    url: `${baseUrl}/about?slug=${page.slug}`,
    lastModified: page.updatedAt || page.createdAt || new Date(),
  }));

  // ✅ Combine and return all routes
  return [
    ...staticRoutes,
    ...storeRoutes,
    ...blogRoutes,
    ...staticPageRoutes,
  ];
}
