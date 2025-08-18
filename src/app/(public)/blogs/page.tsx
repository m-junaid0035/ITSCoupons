// app/page.tsx
import Blogs from "@/components/Blogs"; // Your Blogs component
import { fetchCategoryNamesAction } from "@/actions/categoryActions";
import { fetchAllBlogsAction } from "@/actions/blogActions";

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
