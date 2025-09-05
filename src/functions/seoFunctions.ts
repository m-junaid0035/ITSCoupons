// actions/seoFunctions.ts
import { SEO } from "@/models/SEO";
import { Types } from "mongoose";

/**
 * Sanitize SEO data before saving/updating.
 */
const sanitizeSEOData = (data: {
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string[];
  focusKeywords?: string[];
  slug: string;
  templateType: "settings" | "blogs" | "events" | "stores";
}) => ({
  metaTitle: data.metaTitle.trim(),
  metaDescription: data.metaDescription.trim(),
  metaKeywords: data.metaKeywords ?? [],
  focusKeywords: data.focusKeywords ?? [],
  slug: data.slug.trim().toLowerCase().replace(/\s+/g, "-"),
  templateType: data.templateType,
});

/**
 * Serialize SEO document for client usage.
 */
const serializeSEO = (seo: any) => ({
  _id: seo._id.toString(),
  metaTitle: seo.metaTitle,
  metaDescription: seo.metaDescription,
  metaKeywords: seo.metaKeywords ?? [],
  focusKeywords: seo.focusKeywords ?? [],
  slug: seo.slug,
  templateType: seo.templateType,
  createdAt: seo.createdAt?.toISOString?.(),
  updatedAt: seo.updatedAt?.toISOString?.(),
});

/**
 * Create a new SEO entry.
 */
export const createSEO = async (data: {
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string[];
  focusKeywords?: string[];
  slug: string;
  templateType: "settings" | "blogs" | "events" | "stores";
}) => {
  const seoData = sanitizeSEOData(data);
  const seo = await new SEO(seoData).save();
  return serializeSEO(seo);
};

/**
 * Get all SEO entries.
 */
export const getAllSEO = async () => {
  const entries = await SEO.find().sort({ createdAt: -1 }).lean();
  return entries.map(serializeSEO);
};

/**
 * Get SEO by ID.
 */
export const getSEOById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;

  const seo = await SEO.findById(id).lean();
  return seo ? serializeSEO(seo) : null;
};

/**
 * Update SEO entry by ID.
 */
export const updateSEO = async (
  id: string,
  data: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords?: string[];
    focusKeywords?: string[];
    slug: string;
    templateType: "settings" | "blogs" | "events" | "stores";
  }
) => {
  if (!Types.ObjectId.isValid(id)) return null;

  const updatedData = sanitizeSEOData(data);
  const seo = await SEO.findByIdAndUpdate(id, { $set: updatedData }, { new: true, runValidators: true }).lean();
  return seo ? serializeSEO(seo) : null;
};

/**
 * Delete SEO entry by ID.
 */
export const deleteSEO = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;

  const seo = await SEO.findByIdAndDelete(id).lean();
  return seo ? serializeSEO(seo) : null;
};

/**
 * Get SEO by slug.
 */
export const getSEOBySlug = async (slug: string) => {
  const seo = await SEO.findOne({ slug: slug.trim().toLowerCase() }).lean();
  return seo ? serializeSEO(seo) : null;
};

/**
 * Get the latest SEO entry for a given template type.
 */
export const getLatestSEO = async (templateType: "settings" | "blogs" | "events" | "stores") => {
  const seo = await SEO.findOne({ templateType })
    .sort({ createdAt: -1 })
    .lean();
  return seo ? serializeSEO(seo) : null;
};
