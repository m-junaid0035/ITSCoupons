// app/admin/seo/page.tsx
import SEOPageClient, { ISEO } from "./SEOPageClient";
import { fetchAllSEOAction } from "@/actions/seoActions";

export default async function SEOPage() {
  const result = await fetchAllSEOAction();
  let seoList: ISEO[] = [];

  if (result?.data && Array.isArray(result.data)) {
    seoList = result.data;
  }

  return <SEOPageClient initialSEO={seoList} />;
}
