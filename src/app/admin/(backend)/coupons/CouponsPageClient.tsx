"use client";

import {
  Suspense,
  useState,
  useOptimistic,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  deleteCouponAction,
} from "@/actions/couponActions";

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
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import CouponModal, { ICoupon } from "@/components/views/CouponModal";

function CouponsTable({
  coupons,
  onView,
  onEdit,
  onDelete,
}: {
  coupons: ICoupon[];
  onView: (coupon: ICoupon) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-muted">
            <TableHead>Title</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Top One</TableHead>
            <TableHead className="w-[140px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <TableRow
                key={coupon._id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="font-medium">{coupon.title}</TableCell>
                <TableCell>{coupon.couponCode}</TableCell>
                <TableCell className="capitalize">{coupon.couponType}</TableCell>
                <TableCell className="capitalize">{coupon.status}</TableCell>
                <TableCell>
                  {coupon?.expirationDate && !isNaN(Date.parse(coupon.expirationDate))
                    ? new Date(coupon.expirationDate).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>{coupon.storeName || "-"}</TableCell>
                <TableCell>
                  {coupon.isTopOne ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(coupon)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(coupon._id)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(coupon._id)}
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
                colSpan={8}
                className="text-center text-muted-foreground py-6"
              >
                No coupons found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function CouponsPageClient({
  initialCoupons,
  initialStores,
  storeId,
}: {
  initialCoupons: ICoupon[];
  initialStores: { _id: string; name: string }[];
  storeId: string | undefined;
}) {
  const router = useRouter();
  const [coupons, setCoupons] = useState<ICoupon[]>(initialCoupons);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [viewCoupon, setViewCoupon] = useState<ICoupon | null>(null);

  const pageSize = 8;

  const [optimisticCoupons, deleteOptimistic] = useOptimistic(
    coupons,
    (state, id: string) => state.filter((c) => c._id !== id)
  );

  const storesMap: Record<string, string> = {};
  initialStores.forEach((store) => {
    storesMap[store._id] = store.name;
  });

  const handleDelete = async (id: string) => {
    startTransition(() => {
      deleteOptimistic(id);
    });
    const result = await deleteCouponAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete coupon",
        variant: "destructive",
      });
      setCoupons(initialCoupons); // rollback
    } else {
      setCoupons((prev) => prev.filter((coupon) => coupon._id !== id));
      toast({
        title: "Deleted",
        description: "Coupon deleted successfully.",
      });
    }
  };

  // Filter and paginate
  const filteredCoupons = optimisticCoupons.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCoupons.length / pageSize);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Coupons</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search coupons..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="sm:w-64"
          />
          <Button onClick={() => router.push("/admin/coupons/new")}>
            Create Coupon
          </Button>
        </div>
      </CardHeader>

      <CardContent>
          <CouponsTable
            coupons={paginatedCoupons.map((c) => ({
              ...c,
              storeName: storesMap[c.storeId] || "-",
            }))}
            onView={(coupon) => setViewCoupon(coupon)}
            onEdit={(id) => router.push(`/admin/coupons/edit/${id}`)}
            onDelete={(id) => setConfirmDeleteId(id)}
          />

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this coupon? This action cannot be
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

      {/* Coupon Modal */}
      {viewCoupon && (
        <CouponModal
          coupon={viewCoupon}
          isOpen={!!viewCoupon}
          onClose={() => setViewCoupon(null)}
        />
      )}
    </Card>
  );
}
