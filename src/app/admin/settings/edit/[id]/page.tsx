"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  const settingId = id as string;

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      return await updateSettingAction(prevState, settingId, formData);
    },
    initialState
  );

  const [setting, setSetting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const errorFor = (field: string) =>
    formState.error &&
    typeof formState.error === "object" &&
    field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;

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

  if (loading) return <p>Loading setting...</p>;
  if (!setting) return <p className="text-red-500">Setting not found.</p>;

  return (
    <form action={dispatch} className="space-y-6 max-w-2xl">
      {/* Site Name */}
      <div className="space-y-2">
        <Label htmlFor="siteName">Site Name</Label>
        <Input id="siteName" name="siteName" defaultValue={setting.siteName} required />
        {errorFor("siteName") && <p className="text-sm text-red-500">{errorFor("siteName")}</p>}
      </div>

      {/* Logo */}
      <div className="space-y-2">
        <Label htmlFor="logo">Site Logo URL</Label>
        <Input id="logo" name="logo" type="url" defaultValue={setting.logo} />
        {errorFor("logo") && <p className="text-sm text-red-500">{errorFor("logo")}</p>}
      </div>

      {/* Favicon */}
      <div className="space-y-2">
        <Label htmlFor="favicon">Favicon URL</Label>
        <Input id="favicon" name="favicon" type="url" defaultValue={setting.favicon} />
        {errorFor("favicon") && <p className="text-sm text-red-500">{errorFor("favicon")}</p>}
      </div>

      {/* Contact Email */}
      <div className="space-y-2">
        <Label htmlFor="contactEmail">Contact Email</Label>
        <Input id="contactEmail" name="contactEmail" type="email" defaultValue={setting.contactEmail} />
        {errorFor("contactEmail") && <p className="text-sm text-red-500">{errorFor("contactEmail")}</p>}
      </div>

      {/* Contact Phone */}
      <div className="space-y-2">
        <Label htmlFor="contactPhone">Contact Phone</Label>
        <Input id="contactPhone" name="contactPhone" defaultValue={setting.contactPhone} />
        {errorFor("contactPhone") && <p className="text-sm text-red-500">{errorFor("contactPhone")}</p>}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" rows={2} defaultValue={setting.address} />
        {errorFor("address") && <p className="text-sm text-red-500">{errorFor("address")}</p>}
      </div>

      {/* Meta Title */}
      <div className="space-y-2">
        <Label htmlFor="metaTitle">Meta Title</Label>
        <Input id="metaTitle" name="metaTitle" defaultValue={setting.metaTitle} />
        {errorFor("metaTitle") && <p className="text-sm text-red-500">{errorFor("metaTitle")}</p>}
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea id="metaDescription" name="metaDescription" rows={3} defaultValue={setting.metaDescription} />
        {errorFor("metaDescription") && <p className="text-sm text-red-500">{errorFor("metaDescription")}</p>}
      </div>

      {/* Meta Keywords */}
      <div className="space-y-2">
        <Label htmlFor="metaKeywords">Meta Keywords (comma-separated)</Label>
        <Input
          id="metaKeywords"
          name="metaKeywords"
          defaultValue={Array.isArray(setting.metaKeywords) ? setting.metaKeywords.join(", ") : ""}
        />
        {errorFor("metaKeywords") && <p className="text-sm text-red-500">{errorFor("metaKeywords")}</p>}
      </div>

      {/* Social Links */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="facebookUrl">Facebook URL</Label>
          <Input id="facebookUrl" name="facebookUrl" type="url" defaultValue={setting.facebookUrl} />
          {errorFor("facebookUrl") && <p className="text-sm text-red-500">{errorFor("facebookUrl")}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitterUrl">Twitter URL</Label>
          <Input id="twitterUrl" name="twitterUrl" type="url" defaultValue={setting.twitterUrl} />
          {errorFor("twitterUrl") && <p className="text-sm text-red-500">{errorFor("twitterUrl")}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input id="instagramUrl" name="instagramUrl" type="url" defaultValue={setting.instagramUrl} />
          {errorFor("instagramUrl") && <p className="text-sm text-red-500">{errorFor("instagramUrl")}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input id="linkedinUrl" name="linkedinUrl" type="url" defaultValue={setting.linkedinUrl} />
          {errorFor("linkedinUrl") && <p className="text-sm text-red-500">{errorFor("linkedinUrl")}</p>}
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Update Settings"}
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
