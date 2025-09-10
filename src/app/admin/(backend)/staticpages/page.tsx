import StaticPagesPageClient, { IStaticPage } from "./StaticPagesPageClient";
import { fetchAllStaticPagesAction } from "@/actions/staticPagesActions";

export default async function StaticPagesPage() {
  const result = await fetchAllStaticPagesAction();
  let pages: IStaticPage[] = [];

  if (result?.data && Array.isArray(result.data)) {
    pages = result.data;
  }

  return <StaticPagesPageClient initialPages={pages} />;
}
