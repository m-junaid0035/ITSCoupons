"use client";

import { useEffect, useState } from "react";
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

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<ISetting[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadSettings() {
    setLoading(true);
    const result = await fetchAllSettingsAction();

    if (result.data && Array.isArray(result.data)) {
      setSettings(result.data as ISetting[]);
    } else {
      console.error("Failed to fetch settings", result.error);
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this setting?")) return;
    setLoading(true);

    const result = await deleteSettingAction(id);

    if (result.error) {
      alert(result.error.message?.[0] || "Failed to delete setting");
    } else {
      await loadSettings();
    }

    setLoading(false);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Settings</CardTitle>
        <Button onClick={() => router.push("/admin/settings/new")}>
          Create Setting
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Site Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Meta Title</th>
                <th className="p-2 text-left">Keywords</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.length > 0 ? (
                settings.map((setting) => (
                  <tr key={setting._id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{setting.siteName}</td>
                    <td className="p-2">{setting.contactEmail || "-"}</td>
                    <td className="p-2">{setting.contactPhone || "-"}</td>
                    <td className="p-2">{setting.metaTitle || "-"}</td>
                    <td className="p-2">
                      {setting.metaKeywords?.join(", ") || "-"}
                    </td>
                    <td className="p-2 space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => router.push(`/admin/settings/view/${setting._id}`)}
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => router.push(`/admin/settings/edit/${setting._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(setting._id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    No settings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
