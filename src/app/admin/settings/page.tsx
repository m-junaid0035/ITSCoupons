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
  fetchAllSettingsAction,
  deleteSettingAction,
} from "@/actions/settingActions";

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
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";

interface ISetting {
  _id: string;
  siteName: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  facebookUrl?: string;
  XUrl?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  createdAt: string;
  updatedAt: string;
}

function SettingsTable({
  settings,
  onView,
  onEdit,
  onDelete,
  loading,
}: {
  settings: ISetting[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-muted">
            <TableHead>Site Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Meta Title</TableHead>
            <TableHead>Keywords</TableHead>
            <TableHead className="w-[140px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settings.length > 0 ? (
            settings.map((setting) => (
              <TableRow
                key={setting._id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="font-medium">{setting.siteName}</TableCell>
                <TableCell>{setting.contactEmail || "-"}</TableCell>
                <TableCell>{setting.contactPhone || "-"}</TableCell>
                <TableCell>{setting.metaTitle || "-"}</TableCell>
                <TableCell>
                  {setting.metaKeywords?.length
                    ? setting.metaKeywords.join(", ")
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(setting._id)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(setting._id)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(setting._id)}
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
                No settings found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<ISetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const pageSize = 8;

  const [optimisticSettings, deleteOptimistic] = useOptimistic(
    settings,
    (state, id: string) => state.filter((s) => s._id !== id)
  );

  const loadSettings = async () => {
    setLoading(true);
    const result = await fetchAllSettingsAction();
    if (result?.data && Array.isArray(result.data)) {
      setSettings(result.data);
    } else {
      toast({
        title: "Error",
        description: result?.error?.message || "Failed to fetch settings",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    startTransition(() => {
      deleteOptimistic(id);
    });

    const result = await deleteSettingAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete setting",
        variant: "destructive",
      });
      await loadSettings(); // rollback optimistic update
    } else {
      setSettings((prev) => prev.filter((setting) => setting._id !== id)); // keep state in sync
      toast({
        title: "Deleted",
        description: "Setting deleted successfully.",
      });
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Filter and paginate settings
  const filteredSettings = optimisticSettings.filter((setting) =>
    setting.siteName.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredSettings.length / pageSize);
  const paginatedSettings = filteredSettings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Settings</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Search settings..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="sm:w-64"
          />
          <Button onClick={() => router.push("/admin/settings/new")}>
            Create Setting
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading settings...
            </div>
          }
        >
          <SettingsTable
            settings={paginatedSettings}
            onView={(id) => router.push(`/admin/settings/view/${id}`)}
            onEdit={(id) => router.push(`/admin/settings/edit/${id}`)}
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

      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this setting? This action cannot be undone.
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
