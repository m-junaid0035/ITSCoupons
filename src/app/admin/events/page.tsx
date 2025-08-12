"use client";

import { Suspense, useEffect, useState, useOptimistic } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

function EventsTable({
  events,
  onView,
  onEdit,
  onDelete,
}: {
  events: IEvent[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Meta Title</TableHead>
            <TableHead>Meta Desc</TableHead>
            <TableHead>Meta Keywords</TableHead>
            <TableHead>Focus Keywords</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="w-[140px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length > 0 ? (
            events.map((event) => (
              <TableRow key={event._id} className="hover:bg-muted/40">
                <TableCell>{event.title}</TableCell>
                <TableCell>
                  {new Date(event.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {event.description || "-"}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>{event.metaTitle || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {event.metaDescription || "-"}
                </TableCell>
                <TableCell>{event.metaKeywords || "-"}</TableCell>
                <TableCell>{event.focusKeywords || "-"}</TableCell>
                <TableCell>{event.slug || "-"}</TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(event._id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(event._id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(event._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-6 text-muted-foreground"
              >
                No events found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [optimisticEvents, deleteOptimistic] = useOptimistic(
    events,
    (state, id: string) => state.filter((e) => e._id !== id)
  );

  const loadEvents = async () => {
    setLoading(true);
    const result = await fetchAllEventsAction();
    if (result.data && Array.isArray(result.data)) {
      setEvents(result.data as IEvent[]);
    } else {
      toast({
        title: "Error",
        description: result.error?.message || "Failed to load events",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    deleteOptimistic(id);
    const result = await deleteEventAction(id);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete event",
        variant: "destructive",
      });
      await loadEvents();
    } else {
      toast({ title: "Deleted", description: "Event deleted successfully." });
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold">Events</CardTitle>
        <Button onClick={() => router.push("/admin/events/new")}>
          Create Event
        </Button>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<p className="p-4 text-muted-foreground">Loading events...</p>}>
          <EventsTable
            events={optimisticEvents}
            onView={(id) => router.push(`/admin/events/view/${id}`)}
            onEdit={(id) => router.push(`/admin/events/edit/${id}`)}
            onDelete={(id) => setConfirmDeleteId(id)}
          />
        </Suspense>
      </CardContent>

      <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this event? This action cannot be undone.</p>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setConfirmDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDeleteId) handleDelete(confirmDeleteId);
                setConfirmDeleteId(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
