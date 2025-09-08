import BlogCreatePageClient from "./BlogCreatePageClient";
import { fetchCategoryNamesAction } from "@/actions/categoryActions";
import { fetchLatestSEOAction } from "@/actions/seoActions";

export default async function BlogCreatePage() {
  // Fetch all data in parallel
  const [categoriesRes, seoRes] = await Promise.all([
    fetchCategoryNamesAction(),
    fetchLatestSEOAction("blogs"),
  ]);

  const categories = categoriesRes?.data || [];
  const latestSEO = seoRes?.data || null;

  return (
    <BlogCreatePageClient
      categories={categories}
      latestSEO={latestSEO}
    />
  );
}
