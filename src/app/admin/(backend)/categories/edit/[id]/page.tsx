import { fetchCategoryByIdAction } from "@/actions/categoryActions";
import EditCategoryForm from "./EditCategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: "" }>
}) {
  const { id = "" } = await params;
  const res = await fetchCategoryByIdAction(id);

  if (!res?.data) {
    return (
      <p className="text-red-500 text-center mt-4">Category not found</p>
    );
  }

  return <EditCategoryForm category={res.data} />;
}
