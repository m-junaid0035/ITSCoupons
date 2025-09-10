import { fetchBlogByIdAction } from "@/actions/blogActions";
import { fetchCategoryNamesAction } from "@/actions/categoryActions";
import { fetchLatestSEOAction } from "@/actions/seoActions";
import EditBlogForm from "./EditBlogForm";

export default async function EditBlogPage({ params }: { params: Promise<{ id: "" }> }) {
  const { id = "" } = await params;

  // ✅ Fetch server-side
  const blogRes = await fetchBlogByIdAction(id);
  const categoriesRes = await fetchCategoryNamesAction();
  const seoTemplateRes = await fetchLatestSEOAction("blogs");

  return (
    <EditBlogForm
      blogId={id}
      blog={blogRes?.data ?? null}
      categories={categoriesRes?.data ?? []}
      seoTemplate={seoTemplateRes?.data ?? null}
    />
  );
}
