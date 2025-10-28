import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/drafts/", "/search"],
    },
    sitemap: "https://www.itscoupons.com/sitemap.xml",
    host: "https://www.itscoupons.com",
  };
}
