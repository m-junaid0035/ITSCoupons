"use client";

import { Suspense, useEffect, useState, useOptimistic, startTransition, use } from "react";
import { useRouter } from "next/navigation";
import { fetchAllSEOAction, deleteSEOAction } from "@/actions/seoActions";

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import SEOModal, { ISEO } from "@/components/views/SEOModal"; // Make sure path is correct

function SEOTable({
  seoList,
  onView,
  onEdit,
  onDelete,
  loading,
}: {
  seoList: ISEO[];
  onView: (seo: ISEO) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading SEO entries...
      </div>
    );
  }

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
              <TableRow key={seo._id} className="hover:bg-muted/40 transition-colors">
                <TableCell className="font-medium">{seo.metaTitle}</TableCell>
                <TableCell>{seo.slug}</TableCell>
                <TableCell>{seo.templateType}</TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onView(seo)} title="View">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(seo._id)} title="Edit">
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
              <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                No SEO entries found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function SEOPage() {
  const router = useRouter();
  const [seoList, setSEOList] = useState<ISEO[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [viewSEO, setViewSEO] = useState<ISEO | null>(null); // NEW: selected SEO modal
  const pageSize = 8;

  const [optimisticSEO, deleteOptimistic] = useOptimistic(
    seoList,
    (state, id: string) => state.filter((seo) => seo._id !== id)
  );

  const loadSEOList = async () => {
    setLoading(true);
    const result = await fetchAllSEOAction();
    if (result?.data && Array.isArray(result.data)) {
      setSEOList(result.data);
    } else {
      toast({
        title: "Error",
        description: result?.error?.message || "Failed to fetch SEO entries",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

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
      await loadSEOList(); // rollback optimistic update
    } else {
      setSEOList((prev) => prev.filter((seo) => seo._id !== id));
      toast({
        title: "Deleted",
        description: "SEO entry deleted successfully.",
      });
    }
  };

  useEffect(() => {
    loadSEOList();
  }, []);

  // Filter and paginate
  const filteredSEO = optimisticSEO.filter((seo) =>
    seo.metaTitle.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredSEO.length / pageSize);
  const paginatedSEO = filteredSEO.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
          <Button onClick={() => router.push("/admin/seo/new")}>Create SEO</Button>
        </div>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin mr-2" />}>
          <SEOTable
            seoList={paginatedSEO}
            onView={(seo) => setViewSEO(seo)} // open modal
            onEdit={(id) => router.push(`/admin/seo/edit/${id}`)}
            onDelete={(id) => setConfirmDeleteId(id)}
            loading={loading}
          />
        </Suspense>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this SEO entry? This action cannot be undone.</p>
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

      {/* SEO Modal */}
      {viewSEO && <SEOModal seo={viewSEO} isOpen={!!viewSEO} onClose={() => setViewSEO(null)} />}
    </Card>
  );
}
