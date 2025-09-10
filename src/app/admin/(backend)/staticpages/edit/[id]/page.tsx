// app/admin/staticpages/[id]/page.tsx
import { fetchStaticPageByIdAction } from "@/actions/staticPagesActions";
import EditStaticPageFormClient from "./EditStaticPageFormClient";

interface Props {
  params: { id: string };
}

export default async function EditStaticPagePage({ params }: Props) {
  const { id } = params;

  const res = await fetchStaticPageByIdAction(id);
  const page = res?.data || null;

  return <EditStaticPageFormClient pageId={id} initialPage={page} />;
}
