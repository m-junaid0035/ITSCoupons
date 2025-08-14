"use client";

import { startTransition, Suspense, useEffect, useState, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { fetchAllSubscribersAction, deleteSubscriberAction } from "@/actions/subscriberActions";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ISubscriber {
  _id: string;
  email: string;
  createdAt: string;
}

function SubscribersTable({
  subscribers,
  onDelete,
  loading,
}: {
  subscribers: ISubscriber[];
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading subscribers...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.length > 0 ? (
            subscribers.map((sub) => (
              <TableRow key={sub._id} className="hover:bg-muted/40">
                <TableCell>{sub.email}</TableCell>
                <TableCell>{new Date(sub.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(sub._id)}
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
              <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                No subscribers found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function SubscribersPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<ISubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const pageSize = 8;

  const [optimisticSubs, deleteOptimistic] = useOptimistic(subscribers, (state, id: string) =>
    state.filter((s) => s._id !== id)
  );

  const loadSubscribers = async () => {
    setLoading(true);
    const result = await fetchAllSubscribersAction();
    if (result?.data && Array.isArray(result.data)) {
      setSubscribers(result.data);
    } else {
      toast({
        title: "Error",
        description: result?.error?.message || "Failed to fetch subscribers",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    startTransition(() => deleteOptimistic(id));
    const result = await deleteSubscriberAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete subscriber",
        variant: "destructive",
      });
      await loadSubscribers(); // rollback if failed
    } else {
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
      toast({
        title: "Deleted",
        description: "Subscriber deleted successfully.",
      });
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const filteredSubs = optimisticSubs.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredSubs.length / pageSize);
  const paginatedSubs = filteredSubs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Subscribers</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search subscribers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="sm:w-64"
          />
        </div>
      </CardHeader>

      <CardContent>
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading subscribers...
            </div>
          }
        >
          <SubscribersTable
            subscribers={paginatedSubs}
            onDelete={(id) => setConfirmDeleteId(id)}
            loading={loading}
          />
        </Suspense>
      </CardContent>

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
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this subscriber? This action cannot be
            undone.
          </p>
          <DialogFooter className="flex gap-2">
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
    </Card>
  );
}
