"use client";

import {
  Suspense,
  useEffect,
  useState,
  useOptimistic,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  fetchAllStoresAction,
  deleteStoreAction,
} from "@/actions/storeActions";
import { fetchCouponCountByStoreIdAction } from "@/actions/storeActions";
import { fetchAllNetworksAction } from "@/actions/networkActions"; // NEW: fetch networks

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
import { toast } from "@/hooks/use-toast";
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
import { Eye, Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";

interface IStore {
  _id: string;
  name: string;
  network?: string | null; // store.network now stores only network ID
  totalCoupons?: number;
  image?: string;
  slug?: string;
}

interface INetwork {
  _id: string;
  name: string;
}

function StoresTable({
  stores,
  networks,
  onView,
  onEdit,
  onDelete,
  onCouponsClick,
  loading,
}: {
  stores: IStore[];
  networks: INetwork[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCouponsClick: (id: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading stores...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-muted">
            <TableHead>Name</TableHead>
            <TableHead>Network</TableHead>
            <TableHead>Total Coupons</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Live View</TableHead>
            <TableHead className="w-[140px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.length > 0 ? (
            stores.map((store) => (
              <TableRow
                key={store._id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell>
                  {store.network
                    ? networks.find((n) => n._id === store.network)?.name || "N/A"
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onCouponsClick(store._id)}
                    className="text-blue-600 hover:underline"
                  >
                    {store.totalCoupons ?? 0}
                  </button>
                </TableCell>
                <TableCell>
                  {store.image ? (
                    <img
                      src={store.image}
                      alt={store.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{store.slug ?? "-"}</TableCell>
                <TableCell>
                  {store.slug ? (
                    <a
                      href={`/stores/${store._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Live View <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(store._id)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(store._id)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(store._id)}
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
                colSpan={7}
                className="text-center text-muted-foreground py-6"
              >
                No stores found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function StoresPage() {
  const router = useRouter();
  const [stores, setStores] = useState<IStore[]>([]);
  const [networks, setNetworks] = useState<INetwork[]>([]); // NEW
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const pageSize = 8;

  const [optimisticStores, deleteOptimistic] = useOptimistic(
    stores,
    (state, id: string) => state.filter((store) => store._id !== id)
  );

  const loadNetworks = async () => {
  const res = await fetchAllNetworksAction();
  if (res?.data && Array.isArray(res.data)) {
    // Map networkName => name
    const mappedNetworks = res.data.map((n: any) => ({
      _id: n._id,
      name: n.networkName, // <-- rename here
    }));
    setNetworks(mappedNetworks);
  }
};


  const loadStores = async () => {
    setLoading(true);
    const result = await fetchAllStoresAction();
    if (result?.data && Array.isArray(result.data)) {
      const storesWithCounts = await Promise.all(
        result.data.map(async (store: IStore) => {
          const countRes = await fetchCouponCountByStoreIdAction(store._id);
          return {
            ...store,
            totalCoupons: countRes?.data ?? 0,
          };
        })
      );
      setStores(storesWithCounts);
    } else {
      toast({
        title: "Error",
        description: result?.error?.message || "Failed to fetch stores",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    startTransition(() => {
      deleteOptimistic(id);
    });

    const result = await deleteStoreAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete store",
        variant: "destructive",
      });
      await loadStores(); // rollback optimistic update
    } else {
      setStores((prev) => prev.filter((store) => store._id !== id));
      toast({
        title: "Deleted",
        description: "Store deleted successfully.",
      });
    }
  };

  useEffect(() => {
    loadNetworks();
    loadStores();
  }, []);

  const filteredStores = optimisticStores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredStores.length / pageSize);
  const paginatedStores = filteredStores.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Stores</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search stores..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="sm:w-64"
          />
          <Button onClick={() => router.push("/admin/stores/new")}>
            Create Store
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading stores...
            </div>
          }
        >
          <StoresTable
            stores={paginatedStores}
            networks={networks} // pass networks
            onView={(id) => router.push(`/admin/stores/view/${id}`)}
            onEdit={(id) => router.push(`/admin/stores/edit/${id}`)}
            onDelete={(id) => setConfirmDeleteId(id)}
            onCouponsClick={(id) =>
              router.push(`/admin/coupons?storeId=${id}`)
            }
            loading={loading}
          />
        </Suspense>

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
      </CardContent>

      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this store? This action cannot be
            undone.
          </p>
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
