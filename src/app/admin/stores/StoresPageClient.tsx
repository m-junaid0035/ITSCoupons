"use client";

import {
    Suspense,
    useState,
    useOptimistic,
    startTransition,
} from "react";
import { useRouter } from "next/navigation";
import { deleteStoreAction, updateStoreInline } from "@/actions/storeActions";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye, Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";
import StoreModal, { IStore } from "@/components/views/StoreModel";

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
    onInlineUpdate,
}: {
    stores: IStore[];
    networks: INetwork[];
    onView: (store: IStore) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onCouponsClick: (id: string) => void;
    loading: boolean;
    onInlineUpdate: (id: string, field: string, value: string) => void;
}) {
    const [editingNetworkId, setEditingNetworkId] = useState<string | null>(null);
    const [editingNameId, setEditingNameId] = useState<string | null>(null);
    const [tempName, setTempName] = useState("");
    const [networkSearch, setNetworkSearch] = useState(""); // 🔍 added state

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
                                {/* Store Name Editing */}
                                <TableCell
                                    className="font-medium cursor-pointer"
                                    onDoubleClick={() => {
                                        setEditingNameId(store._id);
                                        setTempName(store.name);
                                    }}
                                >
                                    {editingNameId === store._id ? (
                                        <Input
                                            value={tempName}
                                            autoFocus
                                            onChange={(e) => setTempName(e.target.value)}
                                            onBlur={() => {
                                                onInlineUpdate(store._id, "name", tempName);
                                                setEditingNameId(null);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    onInlineUpdate(store._id, "name", tempName);
                                                    setEditingNameId(null);
                                                }
                                            }}
                                        />
                                    ) : (
                                        store.name
                                    )}
                                </TableCell>

                                {/* Network Editing with Search */}
                                <TableCell
                                    onDoubleClick={() => setEditingNetworkId(store._id)}
                                    className="cursor-pointer"
                                >
                                    {editingNetworkId === store._id ? (
                                        <Select
                                            value={store.network || ""}
                                            onValueChange={(value) => {
                                                onInlineUpdate(store._id, "network", value);
                                                setEditingNetworkId(null);
                                                setNetworkSearch(""); // reset search after selection
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        networks.find(
                                                            (n) => n._id === String(store.network)
                                                        )?.name || "Select network"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {/* 🔍 Search input */}
                                                <div className="p-2">
                                                    <Input
                                                        placeholder="Search network..."
                                                        value={networkSearch}
                                                        onChange={(e) => setNetworkSearch(e.target.value)}
                                                        className="h-8"
                                                    />
                                                </div>

                                                {/* Filtered list */}
                                                {networks
                                                    .filter((network) =>
                                                        network.name
                                                            .toLowerCase()
                                                            .includes(networkSearch.toLowerCase())
                                                    )
                                                    .map((network) => (
                                                        <SelectItem key={network._id} value={network._id}>
                                                            {network.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        networks.find((n) => n._id === String(store.network))
                                            ?.name || "N/A"
                                    )}
                                </TableCell>

                                {/* Coupons Count */}
                                <TableCell>
                                    <button
                                        onClick={() => onCouponsClick(store._id)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {store.totalCoupons ?? 0}
                                    </button>
                                </TableCell>

                                {/* Image */}
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

                                {/* Actions */}
                                <TableCell>
                                    <div className="flex justify-end items-center gap-1.5">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => onView(store)}
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

export default function StoresPageClient({
    initialStores,
    initialNetworks,
}: {
    initialStores: IStore[];
    initialNetworks: INetwork[];
}) {
    const router = useRouter();
    const [stores, setStores] = useState<IStore[]>(initialStores);
    const [networks, setNetworks] = useState<INetwork[]>(initialNetworks);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [searchType, setSearchType] = useState<"store" | "network">("store");
    const [viewStore, setViewStore] = useState<IStore | null>(null);

    const pageSize = 8;

    const [optimisticStores, deleteOptimistic] = useOptimistic(
        stores,
        (state, id: string) => state.filter((store) => store._id !== id)
    );

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
        } else {
            setStores((prev) => prev.filter((store) => store._id !== id));
            toast({ title: "Deleted", description: "Store deleted successfully." });
        }
    };

    const handleInlineUpdate = async (id: string, field: string, value: string) => {
        const updateData = field === "network" ? { network: value } : { [field]: value };
        const result = await updateStoreInline(id, updateData);
        if (result?.data) {
            setStores((prev) =>
                prev.map((store) => (store._id === id ? { ...store, ...result.data } : store))
            );
            toast({ title: "Updated", description: "Store updated successfully." });
        } else if (result?.error) {
            toast({
                title: "Error",
                description: result.error.message?.[0] || "Failed to update store",
                variant: "destructive",
            });
        }
    };

    // ✅ keep your search, pagination, and UI logic the same
    const filteredStores = optimisticStores.filter((store) => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        if (searchType === "store") {
            return store.name.toLowerCase().includes(searchLower);
        } else if (searchType === "network") {
            const networkName = networks.find((n) => n._id === String(store.network))?.name || "";
            return networkName.toLowerCase().includes(searchLower);
        }

        return true;
    });

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
                    <Select value={searchType} onValueChange={(value: "store" | "network") => setSearchType(value)}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Search by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="store">Store Name</SelectItem>
                            <SelectItem value="network">Network</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder={`Search ${searchType === "store" ? "stores" : "networks"}...`}
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
                        networks={networks}
                        onView={(store) => setViewStore(store)} // pass the store here
                        onEdit={(id) => router.push(`/admin/stores/edit/${id}`)}
                        onDelete={(id) => setConfirmDeleteId(id)}
                        onCouponsClick={(id) => router.push(`/admin/coupons?storeId=${id}`)}
                        loading={loading}
                        onInlineUpdate={handleInlineUpdate}
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
                    <p>Are you sure you want to delete this store? This action cannot be undone.</p>
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

            {viewStore && (
                <StoreModal
                    store={viewStore}
                    isOpen={!!viewStore}
                    onClose={() => setViewStore(null)}
                />
            )}

        </Card>
    );
}
