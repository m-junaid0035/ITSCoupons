import EventsPageClient from "./EventsPageClient";
import { fetchAllEventsAction } from "@/actions/eventActions";

export const revalidate = 60; // cache 1 min

export default async function EventsPage() {
  const eventsResult = await fetchAllEventsAction();

  // normalize with safe fallback
  const eventsData =
    eventsResult && Array.isArray(eventsResult.data) ? eventsResult.data : [];

  return <EventsPageClient initialEvents={eventsData} />;
}
