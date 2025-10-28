"use client";

import { useState, useEffect, startTransition } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { createSettingAction } from "@/actions/settingActions";

interface FieldErrors {
  [key: string]: string[];
}
interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
}
const initialState: FormState = { error: {} };

export default function SettingForm({
  latestSEO,
}: {
  latestSEO?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
}) {
  const router = useRouter();
  const [formState, dispatch, isPending] = useActionState(
    createSettingAction,
    initialState
  );
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  /** ---------------- SEO state ---------------- */
  const [seo, setSeo] = useState({
    metaTitle: latestSEO?.metaTitle || "",
    metaDescription: latestSEO?.metaDescription || "",
    metaKeywords: (latestSEO?.metaKeywords || []).join(", "),
  });

  /** ---------------- Logo + Favicon ---------------- */
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "favicon"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "logo") {
        setLogoFile(file);
        setLogoPreview(reader.result as string);
      } else {
        setFaviconFile(file);
        setFaviconPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (type: "logo" | "favicon") => {
    if (type === "logo") {
      setLogoFile(null);
      setLogoPreview(null);
    } else {
      setFaviconFile(null);
      setFaviconPreview(null);
    }
  };

  // ✅ Auto SEO update when site name changes
  const updateSEO = (siteName: string) => {
    if (!latestSEO) return;

    const replaceSiteName = (text: string) =>
      text.replace(/{{blogTitle}}|s_n/gi, siteName);

    setSeo({
      metaTitle: replaceSiteName(latestSEO.metaTitle || ""),
      metaDescription: replaceSiteName(latestSEO.metaDescription || ""),
      metaKeywords: (latestSEO.metaKeywords || [])
        .map(replaceSiteName)
        .join(", "),
    });
  };

  useEffect(() => {
    const input = document.getElementById("siteName") as HTMLInputElement | null;
    if (!input) return;

    const listener = () => {
      const name = input.value.trim();
      if (name) updateSEO(name);
    };

    input.addEventListener("input", listener);
    return () => input.removeEventListener("input", listener);
  }, [latestSEO]);

  /** ---------------- Helpers ---------------- */
  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  useEffect(() => {
    if (formState.data && !formState.error) {
      setSuccessDialogOpen(true);
    }

    if (formState.error && "message" in formState.error) {
      toast({
        title: "Error",
        description:
          (formState.error as any).message?.[0] || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [formState]);

  /** ---------------- Submit handler ---------------- */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // ✅ attach SEO fields
    formData.set("metaTitle", seo.metaTitle);
    formData.set("metaDescription", seo.metaDescription);
    formData.set("metaKeywords", seo.metaKeywords);

    // ✅ attach logo + favicon
    if (logoFile) {
      formData.set("logoFile", logoFile);
    }
    if (faviconFile) {
      formData.set("faviconFile", faviconFile);
    }

    startTransition(() => dispatch(formData));
  };

  return (
    <>
      <Card className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">
            Create Setting
          </CardTitle>
          <Button
            variant="secondary"
            onClick={() => router.push("/admin/settings")}
          >
            Back to Settings
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Site Name */}
            <div className="space-y-2">
              <Label htmlFor="siteName">
                Site Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="siteName"
                name="siteName"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter site name"
              />
              {errorFor("siteName") && (
                <p className="text-sm text-red-500">{errorFor("siteName")}</p>
              )}
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logoFile">Site Logo</Label>
              <Input
                id="logoFile"
                name="logoFile"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "logo")}
              />
              {logoPreview && (
                <div className="mt-2">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-32 h-32 object-contain border rounded-md"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFile("logo")}
                    className="mt-2"
                  >
                    Remove Logo
                  </Button>
                </div>
              )}
              {errorFor("logo") && (
                <p className="text-sm text-red-500">{errorFor("logo")}</p>
              )}
            </div>

            {/* Favicon Upload */}
            <div className="space-y-2">
              <Label htmlFor="faviconFile">Favicon</Label>
              <Input
                id="faviconFile"
                name="faviconFile"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "favicon")}
              />
              {faviconPreview && (
                <div className="mt-2">
                  <img
                    src={faviconPreview}
                    alt="Favicon Preview"
                    className="w-16 h-16 object-contain border rounded-md"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFile("favicon")}
                    className="mt-2"
                  >
                    Remove Favicon
                  </Button>
                </div>
              )}
              {errorFor("favicon") && (
                <p className="text-sm text-red-500">{errorFor("favicon")}</p>
              )}
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="contact@example.com"
              />
              {errorFor("contactEmail") && (
                <p className="text-sm text-red-500">{errorFor("contactEmail")}</p>
              )}
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="+1234567890"
              />
              {errorFor("contactPhone") && (
                <p className="text-sm text-red-500">{errorFor("contactPhone")}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                rows={2}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter your address"
              />
              {errorFor("address") && (
                <p className="text-sm text-red-500">{errorFor("address")}</p>
              )}
            </div>

            {/* SEO */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                value={seo.metaTitle}
                onChange={(e) =>
                  setSeo((prev) => ({ ...prev, metaTitle: e.target.value }))
                }
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Meta title for SEO"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={seo.metaDescription}
                onChange={(e) =>
                  setSeo((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                rows={3}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Meta description for SEO"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords (comma-separated)</Label>
              <Input
                id="metaKeywords"
                name="metaKeywords"
                value={seo.metaKeywords}
                onChange={(e) =>
                  setSeo((prev) => ({ ...prev, metaKeywords: e.target.value }))
                }
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            {/* Social URLs */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  name="facebookUrl"
                  type="url"
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="https://facebook.com/yourpage"
                />
                {errorFor("facebookUrl") && (
                  <p className="text-sm text-red-500">{errorFor("facebookUrl")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="XUrl">X URL</Label>
                <Input
                  id="XUrl"
                  name="XUrl"
                  type="url"
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="https://x.com/yourprofile"
                />
                {errorFor("XUrl") && (
                  <p className="text-sm text-red-500">{errorFor("XUrl")}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  name="instagramUrl"
                  type="url"
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="https://instagram.com/yourprofile"
                />
                {errorFor("instagramUrl") && (
                  <p className="text-sm text-red-500">{errorFor("instagramUrl")}</p>
                )}
              </div>

              {/* ✅ Added LinkedIn URL */}
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  type="url"
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="https://linkedin.com/company/yourpage"
                />
                {errorFor("linkedinUrl") && (
                  <p className="text-sm text-red-500">{errorFor("linkedinUrl")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="yahooUrl">Yahoo URL</Label>
                <Input
                  id="yahooUrl"
                  name="yahooUrl"
                  type="url"
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="https://yahoo.com/yourprofile"
                />
                {errorFor("yahooUrl") && (
                  <p className="text-sm text-red-500">{errorFor("yahooUrl")}</p>
                )}
              </div>
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">
                {(formState.error as any).message?.[0]}
              </p>
            )}

            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Settings saved successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/settings");
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
