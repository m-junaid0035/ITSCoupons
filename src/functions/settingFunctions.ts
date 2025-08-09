import { Setting } from "@/models/Setting";

/**
 * Sanitize and format incoming settings data.
 */
const sanitizeSettingData = (data: {
  siteName: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
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
  twitterUrl: data.twitterUrl?.trim(),
  instagramUrl: data.instagramUrl?.trim(),
  linkedinUrl: data.linkedinUrl?.trim(),
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
  twitterUrl: setting.twitterUrl,
  instagramUrl: setting.instagramUrl,
  linkedinUrl: setting.linkedinUrl,
  createdAt: setting.createdAt?.toISOString?.(),
  updatedAt: setting.updatedAt?.toISOString?.(),
});

/**
 * Create a new setting
 */
export const createSetting = async (data: {
  siteName: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
}) => {
  const settingData = sanitizeSettingData(data);
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
 * Update setting by ID
 */
export const updateSetting = async (
  id: string,
  data: {
    siteName: string;
    logo?: string;
    favicon?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    facebookUrl?: string;
    twitterUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
  }
) => {
  const updatedData = sanitizeSettingData(data);
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
