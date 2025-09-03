import { StaticPage } from "@/models/StaticPage";
import { IStaticPage } from "@/models/StaticPage";

/**
 * Helper to sanitize and format incoming static page data.
 */
const sanitizeStaticPageData = (data: {
  title?: string;
  slug?: string;
  content?: string;
  isPublished?: boolean;
}) => ({
  title: data.title?.trim(),
  slug: data.slug?.trim().toLowerCase(),
  content: data.content?.trim(),
  isPublished: data.isPublished ?? true,
});

/**
 * Convert a Mongoose document to a plain object safe for Client Components.
 */
const serializeStaticPage = (page: {
  _id: any;
  title: string;
  slug: string;
  content: string;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}) => ({
  _id: page._id.toString(),
  title: page.title,
  slug: page.slug,
  content: page.content,
  isPublished: page.isPublished ?? true,
  createdAt: page.createdAt?.toISOString?.() ?? null,
  updatedAt: page.updatedAt?.toISOString?.() ?? null,
});

/**
 * Create a new static page.
 */
export const createStaticPage = async (data: {
  title: string;
  slug: string;
  content: string;
  isPublished?: boolean;
}): Promise<ReturnType<typeof serializeStaticPage>> => {
  const pageData = sanitizeStaticPageData(data);
  const page = await new StaticPage(pageData).save();
  return serializeStaticPage(page);
};

/**
 * Get all static pages, sorted by newest first.
 */
export const getAllStaticPages = async (): Promise<
  ReturnType<typeof serializeStaticPage>[]
> => {
  const pages = await StaticPage.find()
    .sort({ createdAt: -1 })
    .lean<IStaticPage[]>();
  return pages.map(serializeStaticPage);
};

/**
 * Get a static page by its ID.
 */
export const getStaticPageById = async (
  id: string
): Promise<ReturnType<typeof serializeStaticPage> | null> => {
  const page = await StaticPage.findById(id).lean<IStaticPage>();
  return page ? serializeStaticPage(page) : null;
};

/**
 * Get a static page by its slug (for frontend rendering).
 */
export const getStaticPageBySlug = async (
  slug: string
): Promise<ReturnType<typeof serializeStaticPage> | null> => {
  const page = await StaticPage.findOne({ slug }).lean<IStaticPage>();
  return page ? serializeStaticPage(page) : null;
};

/**
 * Update a static page by ID.
 */
export const updateStaticPage = async (
  id: string,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    isPublished?: boolean;
  }
): Promise<ReturnType<typeof serializeStaticPage> | null> => {
  const updatedData = sanitizeStaticPageData(data);
  const page = await StaticPage.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean<IStaticPage>();
  return page ? serializeStaticPage(page) : null;
};

/**
 * Delete a static page by ID.
 */
export const deleteStaticPage = async (
  id: string
): Promise<ReturnType<typeof serializeStaticPage> | null> => {
  const page = await StaticPage.findByIdAndDelete(id).lean<IStaticPage>();
  return page ? serializeStaticPage(page) : null;
};

/**
 * Get only published static pages.
 */
export const getPublishedStaticPages = async (): Promise<
  ReturnType<typeof serializeStaticPage>[]
> => {
  const pages = await StaticPage.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .lean<IStaticPage[]>();
  return pages.map(serializeStaticPage);
};

/**
 * Get all static page titles only.
 */
export const getStaticPageTitles = async (): Promise<string[]> => {
  const pages = await StaticPage.find()
    .select("title")
    .lean<{ title: string }[]>();
  return pages.map((p) => p.title);
};
