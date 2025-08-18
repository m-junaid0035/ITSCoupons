import { Blog } from "@/models/Blog";
import { Types } from "mongoose";

/**
 * Helper to sanitize and format incoming blog data.
 */
const sanitizeBlogData = (data: {
  title: string;
  date: string;
  description?: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeywords?: string;
  slug?: string;
  writer?: string; // new
  category?: string; // new
}) => ({
  title: data.title.trim(),
  date: new Date(data.date),
  description: data.description?.trim(),
  image: data.image?.trim(),
  metaTitle: data.metaTitle?.trim(),
  metaDescription: data.metaDescription?.trim(),
  metaKeywords: data.metaKeywords?.trim(),
  focusKeywords: data.focusKeywords?.trim(),
  slug: data.slug?.trim(),
  writer: data.writer?.trim(), // new
  category: data.category?.trim(), // new
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
  writer: blog.writer, // new
  category: blog.category, // new
  createdAt: blog.createdAt?.toISOString?.(),
  updatedAt: blog.updatedAt?.toISOString?.(),
});

/**
 * Create a new blog.
 */
export const createBlog = async (data: {
  title: string;
  date: string;
  description?: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeywords?: string;
  slug?: string;
  writer?: string; // new
  category?: string; // new
}) => {
  const blogData = sanitizeBlogData(data);
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
 * Update a blog by ID.
 */
export const updateBlog = async (
  id: string,
  data: {
    title: string;
    date: string;
    description?: string;
    image?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    focusKeywords?: string;
    slug?: string;
    writer?: string; // new
    category?: string; // new
  }
) => {
  const updatedData = sanitizeBlogData(data);
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
  return blog ? serializeBlog(blog) : null;
};
