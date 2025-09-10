import { fetchAllBlogsAction } from "@/actions/blogActions";
import BlogsPageClient from "./BlogsPageClient";

export const revalidate = 60; // cache 1 min

export default async function BlogsPage() {
  const result = await fetchAllBlogsAction();

  const blogs =
    result && "data" in result && Array.isArray(result.data)
      ? (result.data as any[])
      : [];

  return <BlogsPageClient initialBlogs={blogs} />;
}
