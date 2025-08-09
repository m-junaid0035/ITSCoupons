"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createSetting,
  deleteSetting,
  getAllSettings,
  getSettingById,
  updateSetting,
} from "@/functions/settingFunctions";

// ✅ Zod Validation Schema
const settingSchema = z.object({
  siteName: z.string().trim().min(2, "Site name is required"),
  logo: z.string().url("Invalid logo URL").optional(),
  favicon: z.string().url("Invalid favicon URL").optional(),
  contactEmail: z.string().email("Invalid email").optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((k) => k.trim()) : [])),
  facebookUrl: z.string().url("Invalid Facebook URL").optional(),
  twitterUrl: z.string().url("Invalid Twitter URL").optional(),
  instagramUrl: z.string().url("Invalid Instagram URL").optional(),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional(),
});

type SettingFormData = z.infer<typeof settingSchema>;

export type SettingFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

// ✅ Helper: Parse FormData (Don't convert metaKeywords manually!)
function parseSettingFormData(formData: FormData): Record<string, any> {
  return {
    siteName: formData.get("siteName") || "",
    logo: formData.get("logo") || "",
    favicon: formData.get("favicon") || "",
    contactEmail: formData.get("contactEmail") || "",
    contactPhone: formData.get("contactPhone") || "",
    address: formData.get("address") || "",
    metaTitle: formData.get("metaTitle") || "",
    metaDescription: formData.get("metaDescription") || "",
    metaKeywords: formData.get("metaKeywords") || "", // Zod will transform this
    facebookUrl: formData.get("facebookUrl") || "",
    twitterUrl: formData.get("twitterUrl") || "",
    instagramUrl: formData.get("instagramUrl") || "",
    linkedinUrl: formData.get("linkedinUrl") || "",
  };
}

// ✅ CREATE SETTING
export async function createSettingAction(
  prevState: SettingFormState,
  formData: FormData
): Promise<SettingFormState> {
  await connectToDatabase();

  const parsed = parseSettingFormData(formData);
  const result = settingSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const setting = await createSetting(result.data);
    return { data: setting };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to create setting"] } };
  }
}

// ✅ UPDATE SETTING
export async function updateSettingAction(
  prevState: SettingFormState,
  id: string,
  formData: FormData
): Promise<SettingFormState> {
  await connectToDatabase();

  const parsed = parseSettingFormData(formData);
  const result = settingSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const updated = await updateSetting(id, result.data);
    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update setting"] } };
  }
}

// ✅ DELETE SETTING
export async function deleteSettingAction(id: string) {
  await connectToDatabase();

  try {
    const deleted = await deleteSetting(id);
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete setting"] } };
  }
}

// ✅ FETCH ALL SETTINGS
export async function fetchAllSettingsAction() {
  await connectToDatabase();

  try {
    const settings = await getAllSettings();
    return { data: settings };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch settings"] } };
  }
}

// ✅ FETCH SINGLE SETTING
export async function fetchSettingByIdAction(id: string) {
  await connectToDatabase();

  try {
    const setting = await getSettingById(id);
    if (!setting) {
      return { error: { message: ["Setting not found"] } };
    }
    return { data: setting };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch setting"] } };
  }
}
