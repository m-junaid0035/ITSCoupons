"use client";

import {
  Suspense,
  useEffect,
  useState,
  useOptimistic,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import { deleteSEOAction } from "@/actions/seoActions";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import SEOModal from "@/components/views/SEOModal";

export interface ISEO {
  _id: string;
  metaTitle: string;
  slug: string;
  templateType: string;
  createdAt?: string;
  updatedAt?: string;
}

function SEOTable({
  seoList,
  onView,
  onEdit,
  onDelete,
}: {
  seoList: ISEO[];
  onView: (seo: ISEO) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-muted">
            <TableHead>Meta Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Template Type</TableHead>
            <TableHead className="w-[140px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seoList.length > 0 ? (
            seoList.map((seo) => (
              <TableRow
                key={seo._id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="font-medium">{seo.metaTitle}</TableCell>
                <TableCell>{seo.slug}</TableCell>
                <TableCell>{seo.templateType}</TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(seo)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(seo._id)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(seo._id)}
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
                colSpan={4}
                className="text-center text-muted-foreground py-6"
              >
                No SEO entries found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function SEOPageClient({
  initialSEO,
}: {
  initialSEO: ISEO[];
}) {
  const router = useRouter();
  const [seoList, setSEOList] = useState<ISEO[]>(initialSEO);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [viewSEO, setViewSEO] = useState<ISEO | null>(null);

  const [pageSize, setPageSize] = useState(8);

  const [optimisticSEO, deleteOptimistic] = useOptimistic(
    seoList,
    (state, id: string) => state.filter((seo) => seo._id !== id)
  );

  const handleDelete = async (id: string) => {
    startTransition(() => {
      deleteOptimistic(id);
    });

    const result = await deleteSEOAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete SEO entry",
        variant: "destructive",
      });
      setSEOList(initialSEO); // rollback
    } else {
      setSEOList((prev) => prev.filter((seo) => seo._id !== id));
      toast({
        title: "Deleted",
        description: "SEO entry deleted successfully.",
      });
    }
  };

  // Filter + paginate
  const filteredSEO = optimisticSEO.filter((seo) =>
    seo.metaTitle.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredSEO.length / pageSize);
  const paginatedSEO = filteredSEO.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">SEO Entries</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search SEO..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="sm:w-64"
          />
          <Button onClick={() => router.push("/admin/seo/new")}>
            Create SEO
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <SEOTable
          seoList={paginatedSEO}
          onView={(seo) => setViewSEO(seo)}
          onEdit={(id) => router.push(`/admin/seo/edit/${id}`)}
          onDelete={(id) => setConfirmDeleteId(id)}
        />
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
            Are you sure you want to delete this SEO entry? This action cannot
            be undone.
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

      {/* SEO Modal */}
      {viewSEO && (
        <SEOModal seo={viewSEO} isOpen={!!viewSEO} onClose={() => setViewSEO(null)} />
      )}
    </Card>
  );
}
