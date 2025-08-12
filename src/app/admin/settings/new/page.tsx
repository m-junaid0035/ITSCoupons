"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react"; // or your actual import
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

import { createSettingAction } from "@/actions/settingActions";

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

export default function SettingForm() {
  const router = useRouter();
  const [formState, dispatch, isPending] = useActionState(
    createSettingAction,
    initialState
  );

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  // Redirect or any action on success
  useEffect(() => {
    if (formState.data && !formState.error) {
      // Example: redirect to settings list page or show a toast
      router.push("/admin/settings");
    }
  }, [formState, router]);

  return (
    <Card className="max-w-3xl mx-auto shadow-lg bg-white">
      <CardHeader className="flex items-center justify-between border-none">
        <CardTitle>Update Settings</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={dispatch} className="space-y-6 max-w-2xl mx-auto">
          {/* Site Name */}
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" name="siteName" required className="border-none shadow-sm" />
            {errorFor("siteName") && (
              <p className="text-sm text-red-500">{errorFor("siteName")}</p>
            )}
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <Label htmlFor="logo">Site Logo URL</Label>
            <Input id="logo" name="logo" type="url" className="border-none shadow-sm" />
            {errorFor("logo") && (
              <p className="text-sm text-red-500">{errorFor("logo")}</p>
            )}
          </div>

          {/* Favicon */}
          <div className="space-y-2">
            <Label htmlFor="favicon">Favicon URL</Label>
            <Input id="favicon" name="favicon" type="url" className="border-none shadow-sm" />
            {errorFor("favicon") && (
              <p className="text-sm text-red-500">{errorFor("favicon")}</p>
            )}
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" name="contactEmail" type="email" className="border-none shadow-sm" />
            {errorFor("contactEmail") && (
              <p className="text-sm text-red-500">{errorFor("contactEmail")}</p>
            )}
          </div>

          {/* Contact Phone */}
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input id="contactPhone" name="contactPhone" className="border-none shadow-sm" />
            {errorFor("contactPhone") && (
              <p className="text-sm text-red-500">{errorFor("contactPhone")}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" name="address" rows={2} className="border-none shadow-sm" />
            {errorFor("address") && (
              <p className="text-sm text-red-500">{errorFor("address")}</p>
            )}
          </div>

          {/* Meta Title */}
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input id="metaTitle" name="metaTitle" className="border-none shadow-sm" />
            {errorFor("metaTitle") && (
              <p className="text-sm text-red-500">{errorFor("metaTitle")}</p>
            )}
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea id="metaDescription" name="metaDescription" rows={3} className="border-none shadow-sm" />
            {errorFor("metaDescription") && (
              <p className="text-sm text-red-500">{errorFor("metaDescription")}</p>
            )}
          </div>

          {/* Meta Keywords */}
          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Meta Keywords (comma-separated)</Label>
            <Input id="metaKeywords" name="metaKeywords" className="border-none shadow-sm" />
            {errorFor("metaKeywords") && (
              <p className="text-sm text-red-500">{errorFor("metaKeywords")}</p>
            )}
          </div>

          {/* Social URLs */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <Input id="facebookUrl" name="facebookUrl" type="url" className="border-none shadow-sm" />
              {errorFor("facebookUrl") && (
                <p className="text-sm text-red-500">{errorFor("facebookUrl")}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterUrl">Twitter URL</Label>
              <Input id="twitterUrl" name="twitterUrl" type="url" className="border-none shadow-sm" />
              {errorFor("twitterUrl") && (
                <p className="text-sm text-red-500">{errorFor("twitterUrl")}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input id="instagramUrl" name="instagramUrl" type="url" className="border-none shadow-sm" />
              {errorFor("instagramUrl") && (
                <p className="text-sm text-red-500">{errorFor("instagramUrl")}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input id="linkedinUrl" name="linkedinUrl" type="url" className="border-none shadow-sm" />
              {errorFor("linkedinUrl") && (
                <p className="text-sm text-red-500">{errorFor("linkedinUrl")}</p>
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
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : "Save Settings"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
