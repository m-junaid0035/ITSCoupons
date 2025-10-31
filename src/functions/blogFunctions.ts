import { Blog } from "@/models/Blog";
import { Types } from "mongoose";
import { saveBlogImage } from "@/lib/uploadBlogImage"; // ✅ like saveStoreImage
import { deleteUploadedFile } from "@/lib/deleteFile";


/**
 * Sanitize and format incoming blog data before saving/updating.
 */
const sanitizeBlogData = (data: {
  title: string;
  date: string;
  description?: string;
  image: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeywords?: string;
  slug?: string;
  writer?: string;
  category?: string;
}) => ({
  title: data.title.trim(),
  date: new Date(data.date),
  description: data.description?.trim(),
  image: data.image.trim(),
  metaTitle: data.metaTitle?.trim(),
  metaDescription: data.metaDescription?.trim(),
  metaKeywords: data.metaKeywords?.trim(),
  focusKeywords: data.focusKeywords?.trim(),
  slug: data.slug?.trim(),
  writer: data.writer?.trim(),
  category: data.category?.trim(),
});

/**
 * Convert a Mongoose document to a plain object safe for Client Components.
 */
const serializeBlog = (blog: any) => ({
  _id: blog._id.toString(),
  title: blog.title,
  date: blog.date?.toISOString?.(),
  description: blog.description,
  image: blog.image,
  metaTitle: blog.metaTitle,
  metaDescription: blog.metaDescription,
  metaKeywords: blog.metaKeywords,
  focusKeywords: blog.focusKeywords,
  slug: blog.slug,
  writer: blog.writer,
  category: blog.category,
  createdAt: blog.createdAt?.toISOString?.(),
  updatedAt: blog.updatedAt?.toISOString?.(),
});

/* ------------------------------------------------------------------ */
/*                               CRUD                                 */
/* ------------------------------------------------------------------ */

/**
 * Create a new blog.
 */
export const createBlog = async (data: {
  title: string;
  date: string;
  description?: string;
  imageFile: File; // ✅ new
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeywords?: string;
  slug?: string;
  writer?: string;
  category?: string;
}) => {
  // ✅ Save image
  const imagePath = await saveBlogImage(data.imageFile);

  const blogData = sanitizeBlogData({
    ...data,
    image: imagePath,
  });

  const blog = await new Blog(blogData).save();
  return serializeBlog(blog);
};

/**
 * Get all blogs, sorted by newest first.
 */
export const getAllBlogs = async () => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  return blogs.map(serializeBlog);
};

/**
 * Get a blog by ID.
 */
export const getBlogById = async (id: string) => {
  const blog = await Blog.findById(id).lean();
  return blog ? serializeBlog(blog) : null;
};

/**
 * Get a blog by slug.
 */
export const getBlogBySlug = async (slug: string) => {
  if (!slug) return null;

  const blog = await Blog.findOne({ slug }).lean();
  return blog ? serializeBlog(blog) : null;
};

/**
 * Get the 4 latest blogs (newest first).
 */
export const getLatestBlogs = async () => {
  const blogs = await Blog.find()
    .sort({ createdAt: -1 }) // sort by newest first
    .limit(4)
    .lean();

  return blogs.map(serializeBlog);
};

/**
 * Update a blog by ID (optionally with new image).
 */
export const updateBlog = async (
  id: string,
  data: {
    title: string;
    date: string;
    description?: string;
    imageFile?: File; // ✅ optional
    image?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    focusKeywords?: string;
    slug?: string;
    writer?: string;
    category?: string;
  }
) => {
  let imagePath = data.image ?? "";
  const existingBlog = await Blog.findById(id).lean();
  if (data.imageFile && data.imageFile.size > 0 && existingBlog?.image) {
    await deleteUploadedFile(existingBlog.image);
  }

  const updatedData = sanitizeBlogData({
    ...data,
    image: imagePath,
  });

  const blog = await Blog.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();

  return blog ? serializeBlog(blog) : null;
};

/**
 * Delete a blog by ID.
 */
export const deleteBlog = async (id: string) => {
  const blog = await Blog.findByIdAndDelete(id).lean();
  if (blog?.image) {
    await deleteUploadedFile(blog.image);
  }
  return blog ? serializeBlog(blog) : null;

};
/**
 * Get the top 4 latest blogs (sorted by creation date descending).
 */
export const getTopBlogs = async () => {
  const blogs = await Blog.find()
    .sort({ createdAt: -1 }) // newest first
    .limit(4)
    .lean();

  return blogs.map(serializeBlog);
};
