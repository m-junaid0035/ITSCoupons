import { Category } from "@/models/Category";
import { ICategory } from "@/models/Category";

/**
 * Helper to sanitize and format incoming category data.
 */
const sanitizeCategoryData = (data: { name: string; slug: string }) => ({
  name: data.name.trim(),
  slug: data.slug.trim().toLowerCase(),
});

/**
 * Convert a Mongoose document to a plain object safe for Client Components.
 */
const serializeCategory = (category: {
  _id: any;
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}) => ({
  _id: category._id.toString(),
  name: category.name,
  slug: category.slug,
  createdAt: category.createdAt?.toISOString?.(),
  updatedAt: category.updatedAt?.toISOString?.(),
});

/**
 * Create a new category.
 * @param data Category input
 * @returns Created category object
 */
export const createCategory = async (data: {
  name: string;
  slug: string;
}): Promise<ReturnType<typeof serializeCategory>> => {
  const categoryData = sanitizeCategoryData(data);
  const category = await new Category(categoryData).save();
  return serializeCategory(category);
};

/**
 * Get all categories, sorted by newest first.
 * @returns Array of categories (plain objects)
 */
export const getAllCategories = async (): Promise<
  ReturnType<typeof serializeCategory>[]
> => {
  const categories = await Category.find().sort({ createdAt: -1 }).lean<ICategory[]>();
  return categories.map(serializeCategory);
};

/**
 * Get a category by its ID.
 * @param id Category ID
 * @returns Category (plain object) or null
 */
export const getCategoryById = async (
  id: string
): Promise<ReturnType<typeof serializeCategory> | null> => {
  const category = await Category.findById(id).lean<ICategory>();
  return category ? serializeCategory(category) : null;
};

/**
 * Update a category by ID.
 * @param id Category ID
 * @param data New category data
 * @returns Updated category (plain object) or null
 */
export const updateCategory = async (
  id: string,
  data: {
    name: string;
    slug: string;
  }
): Promise<ReturnType<typeof serializeCategory> | null> => {
  const updatedData = sanitizeCategoryData(data);
  const category = await Category.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean<ICategory>();
  return category ? serializeCategory(category) : null;
};

/**
 * Delete a category by ID.
 * @param id Category ID
 * @returns Deleted category (plain object) or null
 */
export const deleteCategory = async (
  id: string
): Promise<ReturnType<typeof serializeCategory> | null> => {
  const category = await Category.findByIdAndDelete(id).lean<ICategory>();
  return category ? serializeCategory(category) : null;
};
