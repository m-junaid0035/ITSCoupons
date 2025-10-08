"use client";

import {
  Suspense,
  useEffect,
  useState,
  useOptimistic,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import { deleteEventAction } from "@/actions/eventActions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import EventModal, { IEvent } from "@/components/views/EventModal";

function EventsTable({
  events,
  stores,
  onView,
  onEdit,
  onDelete,
}: {
  events: IEvent[];
  stores: { _id: string; name: string }[];
  onView: (event: IEvent) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const getStoreName = (storeId?: string) => {
    if (!storeId) return "-";
    const store = stores.find((s) => s._id === storeId);
    return store ? store.name : "-";
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Store</TableHead>
            <TableHead className="w-[140px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length > 0 ? (
            events.map((event) => (
              <TableRow key={event._id} className="hover:bg-muted/40">
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  {new Date(event.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {event.image ? (
                    <Image
                      src={`https://www.itscoupons.com${event.image}`}
                      alt={event.title}
                      width={50}
                      height={50}
                      className="rounded"
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{event.slug || "-"}</TableCell>
                <TableCell>{getStoreName(event.store)}</TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(event)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(event._id)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(event._id)}
                      title="Delete"
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
                colSpan={6}
                className="text-center text-muted-foreground py-6"
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

export default function EventsPageClient({
  initialEvents,
  allStores,
}: {
  initialEvents: IEvent[];
  allStores: { _id: string; name: string }[];
}) {
  const router = useRouter();
  const [events, setEvents] = useState<IEvent[]>(initialEvents);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [viewEvent, setViewEvent] = useState<IEvent | null>(null);
  const [pageSize, setPageSize] = useState(8);

  const [optimisticEvents, deleteOptimistic] = useOptimistic(
    events,
    (state, id: string) => state.filter((e) => e._id !== id)
  );

  const handleDelete = async (id: string) => {
    startTransition(() => {
      deleteOptimistic(id);
    });

    const result = await deleteEventAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete event",
        variant: "destructive",
      });
      setEvents(initialEvents); // rollback
    } else {
      setEvents((prev) => prev.filter((event) => event._id !== id));
      toast({
        title: "Deleted",
        description: "Event deleted successfully.",
      });
    }
  };

  // Filter + paginate
  const filteredEvents = optimisticEvents.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchesStore =
      selectedStore === "all" || e.store === selectedStore;
    return matchesSearch && matchesStore;
  });

  const totalPages = Math.ceil(filteredEvents.length / pageSize);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Events</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="sm:w-64"
          />
          <Select
            value={selectedStore}
            onValueChange={(value) => {
              setSelectedStore(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter by store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {allStores.map((store) => (
                <SelectItem key={store._id} value={store._id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => router.push("/admin/events/new")}>
            Create Event
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <EventsTable
          events={paginatedEvents}
          stores={allStores}
          onView={(event) => setViewEvent(event)}
          onEdit={(id) => router.push(`/admin/events/edit/${id}`)}
          onDelete={(id) => setConfirmDeleteId(id)}
        />
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  />
                </PaginationItem>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => setPageSize(Number(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="8">8 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                  </SelectContent>
                </Select>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation */}
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this event? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmDeleteId(null)}>
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

      {/* Event Modal */}
      {viewEvent && (
        <EventModal
          event={viewEvent}
          isOpen={!!viewEvent}
          onClose={() => setViewEvent(null)}
        />
      )}
    </Card>
  );
}
