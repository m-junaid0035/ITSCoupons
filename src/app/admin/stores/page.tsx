"use client";

import { useEffect, useState, Suspense, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { fetchAllStoresAction, deleteStoreAction } from "@/actions/storeActions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface IStore {
  _id: string;
  name: string;
  storeNetworkUrl: string;
  categories: string[];
  image: string;
  slug: string;
  isPopular?: boolean;
  isActive?: boolean;
}

function StoresTable({
  stores,
  onView,
  onEdit,
  onDelete,
}: {
  stores: IStore[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Store Network URL</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Popular</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.length > 0 ? (
            stores.map((store) => (
              <TableRow key={store._id} className="hover:bg-muted/40">
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.storeNetworkUrl}</TableCell>
                <TableCell>
                  {store.categories.length > 0
                    ? store.categories.join(", ")
                    : "-"}
                </TableCell>
                <TableCell>
                  <img
                    src={store.image}
                    alt={store.name}
                    className="h-10 w-10 rounded object-cover border"
                  />
                </TableCell>
                <TableCell>{store.slug}</TableCell>
                <TableCell>{store.isPopular ? "✅" : "❌"}</TableCell>
                <TableCell>{store.isActive ? "✅" : "❌"}</TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(store._id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(store._id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(store._id)}
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
                colSpan={8}
                className="text-center py-6 text-muted-foreground"
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
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [optimisticStores, deleteOptimistic] = useOptimistic(
    stores,
    (state, id: string) => state.filter((s) => s._id !== id)
  );

  const loadStores = async () => {
    setLoading(true);
    const result = await fetchAllStoresAction();
    if (result.data && Array.isArray(result.data)) {
      setStores(result.data as IStore[]);
    } else {
      toast({
        title: "Error",
        description: result.error?.message || "Failed to load stores",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    deleteOptimistic(id);
    const result = await deleteStoreAction(id);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete store",
        variant: "destructive",
      });
      await loadStores();
    } else {
      toast({ title: "Deleted", description: "Store deleted successfully." });
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Stores</CardTitle>
        <Button onClick={() => router.push("/admin/stores/new")}>
          Create Store
        </Button>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<p className="p-4 text-muted-foreground">Loading stores...</p>}>
          <StoresTable
            stores={optimisticStores}
            onView={(id) => router.push(`/admin/stores/view/${id}`)}
            onEdit={(id) => router.push(`/admin/stores/edit/${id}`)}
            onDelete={(id) => setConfirmDeleteId(id)}
          />
        </Suspense>
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
            Are you sure you want to delete this store? This action cannot be undone.
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
    </Card>
  );
}
