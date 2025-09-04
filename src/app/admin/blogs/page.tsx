"use client";
import { startTransition, Suspense, useEffect, useState, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { fetchAllBlogsAction, deleteBlogAction } from "@/actions/blogActions";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import BlogModal from "@/components/views/BlogModal"; // import your modal

interface IBlog {
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
  writer?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

function BlogsTable({
  blogs,
  onView,
  onEdit,
  onDelete,
  loading,
}: {
  blogs: IBlog[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading blogs...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-muted">
            <TableHead>Title</TableHead>
            <TableHead>Writer</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Meta Title</TableHead>
            <TableHead>Meta Description</TableHead>
            <TableHead>Meta Keywords</TableHead>
            <TableHead>Focus Keywords</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="w-[140px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <TableRow key={blog._id} className="hover:bg-muted/40 transition-colors">
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>{blog.writer || "-"}</TableCell>
                <TableCell>{blog.category || "-"}</TableCell>
                <TableCell>{new Date(blog.date).toLocaleDateString()}</TableCell>
                <TableCell className="line-clamp-2 max-w-xs">
                  {blog.description ? (
                    <div
                      className="line-clamp-2 max-w-xs"
                      dangerouslySetInnerHTML={{ __html: blog.description }}
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell>
                  {blog.image ? (
                    <img src={blog.image} alt="Blog" className="h-10 w-10 object-cover rounded" />
                  ) : "-"}
                </TableCell>
                <TableCell>{blog.metaTitle || "-"}</TableCell>
                <TableCell className="line-clamp-2 max-w-xs">{blog.metaDescription || "-"}</TableCell>
                <TableCell>{blog.metaKeywords || "-"}</TableCell>
                <TableCell>{blog.focusKeywords || "-"}</TableCell>
                <TableCell>{blog.slug || "-"}</TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(blog._id)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(blog._id)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(blog._id)}
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
              <TableCell colSpan={12} className="text-center text-muted-foreground py-6">
                No blogs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const pageSize = 8;

  const [optimisticBlogs, deleteOptimistic] = useOptimistic(
    blogs,
    (state, id: string) => state.filter((blog) => blog._id !== id)
  );

  // NEW: state for selected blog modal
  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadBlogs() {
    setLoading(true);
    const result = await fetchAllBlogsAction();
    if (result?.data && Array.isArray(result.data)) {
      setBlogs(result.data as IBlog[]);
    } else {
      toast({
        title: "Error",
        description: result?.error?.message || "Failed to fetch blogs",
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    startTransition(() => {
      deleteOptimistic(id);
    });

    const result = await deleteBlogAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete blog",
        variant: "destructive",
      });
      await loadBlogs();
    } else {
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      toast({
        title: "Deleted",
        description: "Blog deleted successfully.",
      });
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const filteredBlogs = optimisticBlogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredBlogs.length / pageSize);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <Card className="w-full border-none shadow-none">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="text-lg font-semibold">Blogs</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Input
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="sm:w-64"
            />
            <Button onClick={() => router.push("/admin/blogs/new")}>Create Blog</Button>
          </div>
        </CardHeader>

        <CardContent>
          <Suspense fallback={<p className="p-4 text-muted-foreground">Loading blogs...</p>}>
            <BlogsTable
              blogs={paginatedBlogs}
              onView={(id) => {
                const blog = blogs.find((b) => b._id === id);
                if (blog) {
                  setSelectedBlog(blog);
                  setIsModalOpen(true);
                }
              }}
              onEdit={(id) => router.push(`/admin/blogs/edit/${id}`)}
              onDelete={(id) => setConfirmDeleteId(id)}
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
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>

        <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this blog? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
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

      {/* NEW: Blog Modal */}
      {selectedBlog && (
        <BlogModal
          blog={selectedBlog}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
