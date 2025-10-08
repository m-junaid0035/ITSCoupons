import { fetchLatestSEOAction } from "@/actions/seoActions";
import { fetchAllStoresAction } from "@/actions/storeActions"; // make sure this exists
import EventCreateForm from "./EventCreateForm";

export default async function EventCreatePage() {
  // ✅ Fetch SEO defaults server-side
  const { data: latestSEO } = await fetchLatestSEOAction("events");

  // ✅ Fetch all stores server-side
  const storesResult = await fetchAllStoresAction();
  const allStores =
    storesResult && Array.isArray(storesResult.data) ? storesResult.data : [];

  return <EventCreateForm latestSEO={latestSEO} allStores={allStores} />;
}
