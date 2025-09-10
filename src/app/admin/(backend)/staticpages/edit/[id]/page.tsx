// app/admin/staticpages/[id]/page.tsx
import { fetchStaticPageByIdAction } from "@/actions/staticPagesActions";
import EditStaticPageFormClient from "./EditStaticPageFormClient";


export default async function EditStaticPagePage({ params }: { params: Promise<{ id: "" }>}) {
  const { id = "" } = await params;

  const res = await fetchStaticPageByIdAction(id);
  const page = res?.data || null;

  return <EditStaticPageFormClient pageId={id} initialPage={page} />;
}
