import { fetchSEOByIdAction } from "@/actions/seoActions";
import EditSEOForm from "./EditSEOForm";

export default async function EditSEOPage({ params }: { params: Promise<{ id: "" }> }) {
  const { id = "" } = await params;
  const res = await fetchSEOByIdAction(id);

  if (!res?.data) {
    return <p className="text-red-500 text-center mt-4">SEO entry not found.</p>;
  }

  return <EditSEOForm seo={res.data} />;
}
