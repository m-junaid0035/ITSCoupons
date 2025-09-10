import { fetchBlogByIdAction } from "@/actions/blogActions";
import { fetchCategoryNamesAction } from "@/actions/categoryActions";
import { fetchLatestSEOAction } from "@/actions/seoActions";
import EditBlogForm from "./EditBlogForm";

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const blogId = params.id;

  // ✅ Fetch server-side
  const blogRes = await fetchBlogByIdAction(blogId);
  const categoriesRes = await fetchCategoryNamesAction();
  const seoTemplateRes = await fetchLatestSEOAction("blogs");

  return (
    <EditBlogForm
      blogId={blogId}
      blog={blogRes?.data ?? null}
      categories={categoriesRes?.data ?? []}
      seoTemplate={seoTemplateRes?.data ?? null}
    />
  );
}
