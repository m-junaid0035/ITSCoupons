"use client";

import { useActionState } from "react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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

  return (
    <form action={dispatch} className="space-y-6 max-w-2xl">
      {/* Site Name */}
      <div className="space-y-2">
        <Label htmlFor="siteName">Site Name</Label>
        <Input id="siteName" name="siteName" required />
        {errorFor("siteName") && <p className="text-sm text-red-500">{errorFor("siteName")}</p>}
      </div>

      {/* Logo */}
      <div className="space-y-2">
        <Label htmlFor="logo">Site Logo URL</Label>
        <Input id="logo" name="logo" type="url" />
        {errorFor("logo") && <p className="text-sm text-red-500">{errorFor("logo")}</p>}
      </div>

      {/* Favicon */}
      <div className="space-y-2">
        <Label htmlFor="favicon">Favicon URL</Label>
        <Input id="favicon" name="favicon" type="url" />
        {errorFor("favicon") && <p className="text-sm text-red-500">{errorFor("favicon")}</p>}
      </div>

      {/* Contact Email */}
      <div className="space-y-2">
        <Label htmlFor="contactEmail">Contact Email</Label>
        <Input id="contactEmail" name="contactEmail" type="email" />
        {errorFor("contactEmail") && <p className="text-sm text-red-500">{errorFor("contactEmail")}</p>}
      </div>

      {/* Contact Phone */}
      <div className="space-y-2">
        <Label htmlFor="contactPhone">Contact Phone</Label>
        <Input id="contactPhone" name="contactPhone" />
        {errorFor("contactPhone") && <p className="text-sm text-red-500">{errorFor("contactPhone")}</p>}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" rows={2} />
        {errorFor("address") && <p className="text-sm text-red-500">{errorFor("address")}</p>}
      </div>

      {/* Meta Title */}
      <div className="space-y-2">
        <Label htmlFor="metaTitle">Meta Title</Label>
        <Input id="metaTitle" name="metaTitle" />
        {errorFor("metaTitle") && <p className="text-sm text-red-500">{errorFor("metaTitle")}</p>}
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea id="metaDescription" name="metaDescription" rows={3} />
        {errorFor("metaDescription") && <p className="text-sm text-red-500">{errorFor("metaDescription")}</p>}
      </div>

      {/* Meta Keywords */}
      <div className="space-y-2">
        <Label htmlFor="metaKeywords">Meta Keywords (comma-separated)</Label>
        <Input id="metaKeywords" name="metaKeywords" />
        {errorFor("metaKeywords") && <p className="text-sm text-red-500">{errorFor("metaKeywords")}</p>}
      </div>

      {/* Social URLs */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="facebookUrl">Facebook URL</Label>
          <Input id="facebookUrl" name="facebookUrl" type="url" />
          {errorFor("facebookUrl") && <p className="text-sm text-red-500">{errorFor("facebookUrl")}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitterUrl">Twitter URL</Label>
          <Input id="twitterUrl" name="twitterUrl" type="url" />
          {errorFor("twitterUrl") && <p className="text-sm text-red-500">{errorFor("twitterUrl")}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input id="instagramUrl" name="instagramUrl" type="url" />
          {errorFor("instagramUrl") && <p className="text-sm text-red-500">{errorFor("instagramUrl")}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input id="linkedinUrl" name="linkedinUrl" type="url" />
          {errorFor("linkedinUrl") && <p className="text-sm text-red-500">{errorFor("linkedinUrl")}</p>}
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Settings"}
      </Button>

      {/* General Error */}
      {"message" in (formState.error ?? {}) && (
        <p className="text-sm text-red-500">
          {(formState.error as any).message?.[0]}
        </p>
      )}
    </form>
  );
}
