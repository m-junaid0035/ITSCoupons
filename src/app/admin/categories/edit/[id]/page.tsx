import { fetchCategoryByIdAction } from "@/actions/categoryActions";
import EditCategoryForm from "./EditCategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetchCategoryByIdAction(params.id);

  if (!res?.data) {
    return (
      <p className="text-red-500 text-center mt-4">Category not found</p>
    );
  }

  return <EditCategoryForm category={res.data} />;
}
