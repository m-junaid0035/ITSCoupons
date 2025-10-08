// pages/events/page.tsx
import EventsPageClient from "./EventsPageClient";
import { fetchAllEventsAction } from "@/actions/eventActions";
import { fetchAllStoresAction } from "@/actions/storeActions"; // import your store action

export const revalidate = 60; // cache 1 min

export default async function EventsPage() {
  // Fetch events and stores in parallel
  const [eventsResult, storesResult] = await Promise.all([
    fetchAllEventsAction(),
    fetchAllStoresAction(),
  ]);

  const eventsData =
    eventsResult && Array.isArray(eventsResult.data) ? eventsResult.data : [];
  const storesData =
    storesResult && Array.isArray(storesResult.data) ? storesResult.data : [];

  // pass both events and stores to client
  return <EventsPageClient initialEvents={eventsData} allStores={storesData} />;
}
