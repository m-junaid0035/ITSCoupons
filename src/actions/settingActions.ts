"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createSetting,
  deleteSetting,
  getAllSettings,
  getLatestSetting,
  getSettingById,
  updateSetting,
} from "@/functions/settingFunctions";

// -------------------------------
// ✅ Zod Validation Schema
// -------------------------------
const settingSchema = z.object({
  siteName: z.string().trim().min(2, "Site name is required"),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      return val.split(",").map((k) => k.trim()).filter(Boolean);
    }),
  facebookUrl: z
    .string()
    .url("Invalid Facebook URL")
    .optional()
    .or(z.literal("")),
  XUrl: z.string().url("Invalid X URL").optional().or(z.literal("")),
  instagramUrl: z
    .string()
    .url("Invalid Instagram URL")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Invalid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  yahooUrl: z.string().url("Invalid Yahoo URL").optional().or(z.literal("")),
});

type SettingFormData = z.infer<typeof settingSchema>;

export type SettingFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

// -------------------------------
// ✅ PARSE FORMDATA (HELPER)
// -------------------------------
async function parseSettingFormData(
  formData: FormData,
  requireImages = false
): Promise<SettingFormData & { logoFile?: File; faviconFile?: File }> {
  const logoFile = formData.get("logoFile") as File | null;
  const faviconFile = formData.get("faviconFile") as File | null;

  let logoPath = String(formData.get("logo") || "");
  let faviconPath = String(formData.get("favicon") || "");
  return {
    siteName: String(formData.get("siteName") || ""),
    logo: logoPath,
    favicon: faviconPath,
    contactEmail: String(formData.get("contactEmail") || ""),
    contactPhone: String(formData.get("contactPhone") || ""),
    address: String(formData.get("address") || ""),
    metaTitle: String(formData.get("metaTitle") || ""),
    metaDescription: String(formData.get("metaDescription") || ""),
    metaKeywords: String(formData.get("metaKeywords") || "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    facebookUrl: String(formData.get("facebookUrl") || ""),
    XUrl: String(formData.get("XUrl") || ""),
    instagramUrl: String(formData.get("instagramUrl") || ""),
    linkedinUrl: String(formData.get("linkedinUrl") || ""), // ✅ added
    yahooUrl: String(formData.get("yahooUrl") || ""),
    logoFile: logoFile || undefined,
    faviconFile: faviconFile || undefined,
  };
}

// -------------------------------
// ✅ ACTIONS
// -------------------------------

// CREATE SETTING
export async function createSettingAction(
  prevState: SettingFormState,
  formData: FormData
): Promise<SettingFormState> {
  await connectToDatabase();

  try {
    const parsed = await parseSettingFormData(formData, true);
    const result = settingSchema.safeParse(parsed);

    if (!result.success) return { error: result.error.flatten().fieldErrors };

    // Pass files only if they exist
    const setting = await createSetting({
      ...result.data,
      logoFile: parsed.logoFile!,
      faviconFile: parsed.faviconFile!,
    });

    return { data: setting };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to create setting"] } };
  }
}

// UPDATE SETTING
export async function updateSettingAction(
  prevState: SettingFormState,
  id: string,
  formData: FormData
): Promise<SettingFormState> {
  await connectToDatabase();

  try {
    const parsed = await parseSettingFormData(formData);
    const result = settingSchema.safeParse(parsed);

    if (!result.success) return { error: result.error.flatten().fieldErrors };

    // Only include logoFile/favIconFile if they exist to satisfy TS
    const payload: any = { ...result.data };
    if (parsed.logoFile) payload.logoFile = parsed.logoFile;
    if (parsed.faviconFile) payload.faviconFile = parsed.faviconFile;

    const updated = await updateSetting(id, payload);

    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update setting"] } };
  }
}

// DELETE SETTING
export async function deleteSettingAction(id: string) {
  await connectToDatabase();
  try {
    const deleted = await deleteSetting(id);
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete setting"] } };
  }
}

// FETCH ALL SETTINGS
export async function fetchAllSettingsAction() {
  await connectToDatabase();
  try {
    const settings = await getAllSettings();
    return { data: settings };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch settings"] } };
  }
}

// FETCH SINGLE SETTING
export async function fetchSettingByIdAction(id: string) {
  await connectToDatabase();
  try {
    const setting = await getSettingById(id);
    if (!setting) return { error: { message: ["Setting not found"] } };
    return { data: setting };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch setting"] } };
  }
}

// FETCH LATEST SETTING
export async function fetchLatestSettingAction() {
  await connectToDatabase();
  try {
    const setting = await getLatestSetting();
    if (!setting) return { error: { message: ["No settings found"] } };
    return { data: setting };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch latest setting"] } };
  }
}
