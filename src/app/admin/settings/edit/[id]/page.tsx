"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useParams, useRouter } from "next/navigation";

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
import LoadingSkeleton from "./loading";
import { toast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  fetchSettingByIdAction,
  updateSettingAction,
} from "@/actions/settingActions";

interface FieldErrors {
  [key: string]: string[];
}

interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

export default function EditSettingForm() {
  const { id } = useParams();
  const router = useRouter();
  const settingId = id as string;

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      return await updateSettingAction(prevState, settingId, formData);
    },
    initialState
  );

  const [setting, setSetting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  useEffect(() => {
    async function loadSetting() {
      const res = await fetchSettingByIdAction(settingId);
      if (res.data) {
        setSetting(res.data);
      }
      setLoading(false);
    }
    loadSetting();
  }, [settingId]);

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

  if (loading) return <LoadingSkeleton />;
  if (!setting) return <p className="text-red-500">Setting not found.</p>;

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Edit Setting</CardTitle>
          <Button
            variant="secondary"
            onClick={() => router.push("/admin/settings")}
          >
            Back to Settings
          </Button>
        </CardHeader>

        <CardContent>
          <form action={dispatch} className="space-y-6 max-w-2xl mx-auto">
            {/* Site Name */}
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                name="siteName"
                required
                defaultValue={setting.siteName}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("siteName") && (
                <p className="text-sm text-red-500">{errorFor("siteName")}</p>
              )}
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <Label htmlFor="logo">Site Logo URL</Label>
              <Input
                id="logo"
                name="logo"
                type="url"
                defaultValue={setting.logo}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("logo") && (
                <p className="text-sm text-red-500">{errorFor("logo")}</p>
              )}
            </div>

            {/* Favicon */}
            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon URL</Label>
              <Input
                id="favicon"
                name="favicon"
                type="url"
                defaultValue={setting.favicon}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
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
                defaultValue={setting.contactEmail}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("contactEmail") && (
                <p className="text-sm text-red-500">
                  {errorFor("contactEmail")}
                </p>
              )}
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                defaultValue={setting.contactPhone}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("contactPhone") && (
                <p className="text-sm text-red-500">
                  {errorFor("contactPhone")}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                rows={2}
                defaultValue={setting.address}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("address") && (
                <p className="text-sm text-red-500">{errorFor("address")}</p>
              )}
            </div>

            {/* Meta Title */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                defaultValue={setting.metaTitle}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("metaTitle") && (
                <p className="text-sm text-red-500">{errorFor("metaTitle")}</p>
              )}
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                rows={3}
                defaultValue={setting.metaDescription}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("metaDescription") && (
                <p className="text-sm text-red-500">
                  {errorFor("metaDescription")}
                </p>
              )}
            </div>

            {/* Meta Keywords */}
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords (comma-separated)</Label>
              <Input
                id="metaKeywords"
                name="metaKeywords"
                defaultValue={
                  Array.isArray(setting.metaKeywords)
                    ? setting.metaKeywords.join(", ")
                    : setting.metaKeywords || ""
                }
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("metaKeywords") && (
                <p className="text-sm text-red-500">
                  {errorFor("metaKeywords")}
                </p>
              )}
            </div>

            {/* Social URLs */}
            {/* Social URLs */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  name="facebookUrl"
                  type="url"
                  defaultValue={setting.facebookUrl}
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="https://facebook.com/yourpage"
                />
                {errorFor("facebookUrl") && (
                  <p className="text-sm text-red-500">
                    {errorFor("facebookUrl")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="XUrl">X URL</Label>
                <Input
                  id="XUrl"
                  name="XUrl"
                  type="url"
                  defaultValue={setting.XUrl}
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
                  defaultValue={setting.instagramUrl}
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="https://instagram.com/yourprofile"
                />
                {errorFor("instagramUrl") && (
                  <p className="text-sm text-red-500">
                    {errorFor("instagramUrl")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappUrl">WhatsApp URL</Label>
                <Input
                  id="whatsappUrl"
                  name="whatsappUrl"
                  type="url"
                  defaultValue={setting.whatsappUrl}
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="https://wa.me/yourNumber"
                />
                {errorFor("whatsappUrl") && (
                  <p className="text-sm text-red-500">
                    {errorFor("whatsappUrl")}
                  </p>
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
                {isPending ? "Saving..." : "Update Settings"}
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
          <p>Settings updated successfully!</p>
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
