"use client";

import {
  useState,
  useOptimistic,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import { deleteNetworkAction } from "@/actions/networkActions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Eye, Pencil, Trash2 } from "lucide-react";
import NetworkModal from "@/components/views/NetworkModal";

type INetwork = {
  _id: string;
  networkName: string;
  totalStores?: number;
};

// Networks Table
function NetworksTable({
  networks,
  onView,
  onEdit,
  onDelete,
  onStoresClick,
}: {
  networks: INetwork[];
  onView: (network: INetwork) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStoresClick: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-muted">
            <TableHead>Network Name</TableHead>
            <TableHead>Total Stores</TableHead>
            <TableHead className="w-[160px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {networks.length > 0 ? (
            networks.map((network) => (
              <TableRow
                key={network._id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="font-medium">
                  {network.networkName}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onStoresClick(network._id)}
                    className="text-blue-600 hover:underline"
                  >
                    {network.totalStores ?? 0}
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(network)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(network._id)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(network._id)}
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
                colSpan={3}
                className="text-center text-muted-foreground py-6"
              >
                No networks found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Networks Client Page
export default function NetworksPageClient({
  initialNetworks,
}: {
  initialNetworks: INetwork[];
}) {
  const router = useRouter();
  const [networks, setNetworks] = useState<INetwork[]>(initialNetworks);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<INetwork | null>(null);

  const [pageSize, setPageSize] = useState(8);

  const [optimisticNetworks, deleteOptimistic] = useOptimistic(
    networks,
    (state, id: string) => state.filter((net) => net._id !== id)
  );

  const handleDelete = async (id: string) => {
    startTransition(() => {
      deleteOptimistic(id);
    });

    const result = await deleteNetworkAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete network",
        variant: "destructive",
      });
      setNetworks(initialNetworks); // rollback
    } else {
      setNetworks((prev) => prev.filter((net) => net._id !== id));
      toast({ title: "Deleted", description: "Network deleted successfully." });
    }
  };

  const handleStoresClick = (networkId: string) => {
    router.push(`/admin/stores?networkId=${networkId}`);
  };

  const filteredNetworks = optimisticNetworks.filter((n) =>
    n.networkName.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredNetworks.length / pageSize);
  const paginatedNetworks = filteredNetworks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Networks</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search networks..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="sm:w-64"
          />
          <Button onClick={() => router.push("/admin/networks/new")}>
            Create Network
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <NetworksTable
          networks={paginatedNetworks}
          onView={(network) => setSelectedNetwork(network)}
          onEdit={(id) => router.push(`/admin/networks/edit/${id}`)}
          onDelete={(id) => setConfirmDeleteId(id)}
          onStoresClick={handleStoresClick}
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Confirm Delete Dialog */}
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this network? This action cannot be
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

      {/* Network Modal */}
      {selectedNetwork && (
        <NetworkModal
          network={selectedNetwork}
          isOpen={!!selectedNetwork}
          onClose={() => setSelectedNetwork(null)}
        />
      )}
    </Card>
  );
}
