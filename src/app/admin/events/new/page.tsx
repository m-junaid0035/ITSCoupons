import { fetchLatestSEOAction } from "@/actions/seoActions";
import EventCreateForm from "./EventCreateForm";

export default async function EventCreatePage() {
  // ✅ Fetch SEO defaults server-side
  const { data: latestSEO } = await fetchLatestSEOAction("events");

  return <EventCreateForm latestSEO={latestSEO} />;
}
