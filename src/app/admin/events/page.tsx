"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAllEventsAction,
  deleteEventAction,
} from "@/actions/eventActions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface IEvent {
  _id: string;
  title: string;
  date: string;
  description?: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeywords?: string;
  slug?: string;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadEvents() {
    setLoading(true);
    const result = await fetchAllEventsAction();

    if (result.data && Array.isArray(result.data)) {
      setEvents(result.data as IEvent[]);
    } else {
      console.error("Failed to fetch events", result.error);
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setLoading(true);

    const result = await deleteEventAction(id);

    if (result.error) {
      alert(result.error.message?.[0] || "Failed to delete event");
    } else {
      await loadEvents();
    }

    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Events</CardTitle>
        <Button onClick={() => router.push("/admin/events/new")}>
          Create Event
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Meta Title</th>
                <th className="p-2 text-left">Meta Desc</th>
                <th className="p-2 text-left">Meta Keywords</th>
                <th className="p-2 text-left">Focus Keywords</th>
                <th className="p-2 text-left">Slug</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event._id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{event.title}</td>
                    <td className="p-2">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="p-2 max-w-[200px] truncate">
                      {event.description || "-"}
                    </td>
                    <td className="p-2">
                      {event.image ? (
                        <Image
                          src={event.image}
                          alt={event.title}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">{event.metaTitle || "-"}</td>
                    <td className="p-2 max-w-[200px] truncate">
                      {event.metaDescription || "-"}
                    </td>
                    <td className="p-2">{event.metaKeywords || "-"}</td>
                    <td className="p-2">{event.focusKeywords || "-"}</td>
                    <td className="p-2">{event.slug || "-"}</td>
                    <td className="p-2 space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => router.push(`/admin/events/view/${event._id}`)}
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => router.push(`/admin/events/edit/${event._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(event._id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-4 text-center text-muted-foreground">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
