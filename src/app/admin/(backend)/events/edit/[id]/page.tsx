// app/admin/events/[id]/page.tsx
import { fetchEventByIdAction } from "@/actions/eventActions";
import { fetchAllStoresAction } from "@/actions/storeActions";
import { fetchLatestSEOAction } from "@/actions/seoActions";
import EditEventForm from "./EditEventForm";

export default async function EditEventPage({ params }: { params: Promise<{ id: "" }>; }) {
  const { id = "" } = await params;

  const [eventRes, storesRes, seoRes] = await Promise.all([
    fetchEventByIdAction(id),
    fetchAllStoresAction(),
    fetchLatestSEOAction("events"),
  ]);

  const event = eventRes?.data || null;
  const stores = storesRes?.data || [];
  const latestSEO = seoRes?.data || null;

  if (!event) {
    return <p className="text-red-500">Event not found.</p>;
  }

  return (
    <EditEventForm
      event={event}
      stores={stores}
      latestSEO={latestSEO}
    />
  );
}
