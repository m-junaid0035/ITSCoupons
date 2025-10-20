import { Setting } from "@/models/Setting";
import { saveSettingLogo, saveSettingFavicon } from "@/lib/uploadSettingImage"; // ✅ new

/**
 * Sanitize and format incoming settings data.
 */
const sanitizeSettingData = (data: {
  siteName: string;
  logo: string;
  favicon: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  facebookUrl?: string;
  XUrl?: string;
  instagramUrl?: string;
  yahooUrl?: string;
}) => ({
  siteName: data.siteName.trim(),
  logo: data.logo?.trim(),
  favicon: data.favicon?.trim(),
  contactEmail: data.contactEmail?.trim(),
  contactPhone: data.contactPhone?.trim(),
  address: data.address?.trim(),
  metaTitle: data.metaTitle?.trim(),
  metaDescription: data.metaDescription?.trim(),
  metaKeywords: data.metaKeywords || [],
  facebookUrl: data.facebookUrl?.trim(),
  XUrl: data.XUrl?.trim(),
  instagramUrl: data.instagramUrl?.trim(),
  yahooUrl: data.yahooUrl?.trim(),
});

/**
 * Convert Setting document to plain object.
 */
const serializeSetting = (setting: any) => ({
  _id: setting._id.toString(),
  siteName: setting.siteName,
  logo: setting.logo,
  favicon: setting.favicon,
  contactEmail: setting.contactEmail,
  contactPhone: setting.contactPhone,
  address: setting.address,
  metaTitle: setting.metaTitle,
  metaDescription: setting.metaDescription,
  metaKeywords: setting.metaKeywords,
  facebookUrl: setting.facebookUrl,
  XUrl: setting.XUrl,
  instagramUrl: setting.instagramUrl,
  yahooUrl: setting.yahooUrl,
  createdAt: setting.createdAt?.toISOString?.(),
  updatedAt: setting.updatedAt?.toISOString?.(),
});

/* ------------------------------------------------------------------ */
/*                               CRUD                                 */
/* ------------------------------------------------------------------ */

/**
 * Create a new setting (with logo & favicon upload).
 */
export const createSetting = async (data: {
  siteName: string;
  logoFile: File;     // ✅ upload
  faviconFile: File;  // ✅ upload
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  facebookUrl?: string;
  XUrl?: string;
  instagramUrl?: string;
  yahooUrl?: string;
}) => {
  // ✅ Save uploaded images
  const logoPath = await saveSettingLogo(data.logoFile);
  const faviconPath = await saveSettingFavicon(data.faviconFile);

  const settingData = sanitizeSettingData({
    ...data,
    logo: logoPath,
    favicon: faviconPath,
  });

  const setting = await new Setting(settingData).save();
  return serializeSetting(setting);
};

/**
 * Get all settings
 */
export const getAllSettings = async () => {
  const settings = await Setting.find().sort({ createdAt: -1 }).lean();
  return settings.map(serializeSetting);
};

/**
 * Get setting by ID
 */
export const getSettingById = async (id: string) => {
  const setting = await Setting.findById(id).lean();
  return setting ? serializeSetting(setting) : null;
};

/**
 * Update setting by ID (optionally with new logo & favicon).
 */
export const updateSetting = async (
  id: string,
  data: {
    siteName: string;
    logoFile?: File;     // ✅ optional upload
    faviconFile?: File;  // ✅ optional upload
    logo?: string;
    favicon?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    facebookUrl?: string;
    XUrl?: string;
    instagramUrl?: string;
    yahooUrl?: string;
  }
) => {
  let logoPath = data.logo ?? "";
  let faviconPath = data.favicon ?? "";

  if (data.logoFile) {
    logoPath = await saveSettingLogo(data.logoFile);
  }
  if (data.faviconFile) {
    faviconPath = await saveSettingFavicon(data.faviconFile);
  }

  const updatedData = sanitizeSettingData({
    ...data,
    logo: logoPath,
    favicon: faviconPath,
  });

  const setting = await Setting.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();

  return setting ? serializeSetting(setting) : null;
};

/**
 * Delete setting by ID
 */
export const deleteSetting = async (id: string) => {
  const setting = await Setting.findByIdAndDelete(id).lean();
  return setting ? serializeSetting(setting) : null;
};

/**
 * Get the latest setting
 */
export const getLatestSetting = async () => {
  const setting = await Setting.findOne().sort({ createdAt: -1 }).lean();
  return setting ? serializeSetting(setting) : null;
};
