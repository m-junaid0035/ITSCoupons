"use client";

import {
  Suspense,
  useState,
  useOptimistic,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import { deleteSettingAction } from "@/actions/settingActions";

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
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";

import SettingModal from "@/components/views/SettingModal";

export interface ISetting {
  _id: string;
  siteName: string;
  contactEmail?: string;
  contactPhone?: string;
  metaTitle?: string;
  metaKeywords?: string[];
}

// ====================== Table ======================
function SettingsTable({
  settings,
  onView,
  onEdit,
  onDelete,
}: {
  settings: ISetting[];
  onView: (setting: ISetting) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {

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
                      onClick={() => onView(setting)}
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

// ====================== Client Page ======================
export default function SettingsPageClient({
  initialSettings,
}: {
  initialSettings: ISetting[];
}) {
  const router = useRouter();
  const [settings, setSettings] = useState<ISetting[]>(initialSettings);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [viewSetting, setViewSetting] = useState<ISetting | null>(null);
  const [pageSize, setPageSize] = useState(8);

  const [optimisticSettings, deleteOptimistic] = useOptimistic(
    settings,
    (state, id: string) => state.filter((s) => s._id !== id)
  );

  const handleDelete = async (id: string) => {
    startTransition(() => deleteOptimistic(id));

    const result = await deleteSettingAction(id);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete setting",
        variant: "destructive",
      });
      setSettings(initialSettings); // rollback
    } else {
      setSettings((prev) => prev.filter((s) => s._id !== id));
      toast({
        title: "Deleted",
        description: "Setting deleted successfully.",
      });
    }
  };

  // Filter and paginate
  const filteredSettings = optimisticSettings.filter((s) =>
    s.siteName.toLowerCase().includes(search.toLowerCase())
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
        <SettingsTable
          settings={paginatedSettings}
          onView={(s) => setViewSetting(s)}
          onEdit={(id) => router.push(`/admin/settings/edit/${id}`)}
          onDelete={(id) => setConfirmDeleteId(id)}
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
      </CardContent>

      {/* Delete Confirmation */}
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>This action cannot be undone. Are you sure?</p>
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

      {/* Setting Modal */}
      {viewSetting && (
        <SettingModal
          setting={viewSetting}
          isOpen={!!viewSetting}
          onClose={() => setViewSetting(null)}
        />
      )}
    </Card>
  );
}
