"use client";

import { Suspense, useEffect, useState, useOptimistic } from "react";
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
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  createdAt: string;
  updatedAt: string;
}

function SettingsTable({
  settings,
  onView,
  onEdit,
  onDelete,
}: {
  settings: ISetting[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Site Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Meta Title</TableHead>
            <TableHead>Keywords</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settings.length > 0 ? (
            settings.map((setting) => (
              <TableRow key={setting._id} className="hover:bg-muted/40">
                <TableCell>{setting.siteName}</TableCell>
                <TableCell>{setting.contactEmail || "-"}</TableCell>
                <TableCell>{setting.contactPhone || "-"}</TableCell>
                <TableCell>{setting.metaTitle || "-"}</TableCell>
                <TableCell>
                  {setting.metaKeywords?.length
                    ? setting.metaKeywords.join(", ")
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(setting._id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(setting._id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(setting._id)}
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
                className="text-center py-6 text-muted-foreground"
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
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [optimisticSettings, deleteOptimistic] = useOptimistic(
    settings,
    (state, id: string) => state.filter((s) => s._id !== id)
  );

  const loadSettings = async () => {
    setLoading(true);
    const result = await fetchAllSettingsAction();
    if (result.data && Array.isArray(result.data)) {
      setSettings(result.data as ISetting[]);
    } else {
      toast({
        title: "Error",
        description: result.error?.message || "Failed to load settings",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    deleteOptimistic(id);
    const result = await deleteSettingAction(id);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message || "Failed to delete setting",
        variant: "destructive",
      });
      await loadSettings();
    } else {
      toast({ title: "Deleted", description: "Setting deleted successfully." });
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-lg font-semibold">Settings</CardTitle>
        <Button onClick={() => router.push("/admin/settings/new")}>
          Create Setting
        </Button>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<p className="p-4 text-muted-foreground">Loading settings...</p>}>
          <SettingsTable
            settings={optimisticSettings}
            onView={(id) => router.push(`/admin/settings/view/${id}`)}
            onEdit={(id) => router.push(`/admin/settings/edit/${id}`)}
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
