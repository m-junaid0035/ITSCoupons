import { Category } from "@/models/Category";
import { ICategory } from "@/models/Category";

/**
 * Helper to sanitize and format incoming category data.
 */
const sanitizeCategoryData = (data: {
  name?: string;
  slug?: string;
  description?: string | null; // ✅ allow null
  isPopular?: boolean;
  isTrending?: boolean;
}) => ({
  name: data.name?.trim(),
  slug: data.slug?.trim().toLowerCase(),
  description: data.description?.trim?.() || null, // ✅ normalize to null
  isPopular: data.isPopular ?? false,
  isTrending: data.isTrending ?? false,
});

/**
 * Convert a Mongoose document to a plain object safe for Client Components.
 */
const serializeCategory = (category: {
  _id: any;
  name: string;
  slug: string;
  description?: string | null; // ✅ allow null
  isPopular?: boolean;
  isTrending?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}) => ({
  _id: category._id.toString(),
  name: category.name,
  slug: category.slug,
  description: category.description ?? null, // ✅ consistent
  isPopular: category.isPopular ?? false,
  isTrending: category.isTrending ?? false,
  createdAt: category.createdAt?.toISOString?.() ?? null,
  updatedAt: category.updatedAt?.toISOString?.() ?? null,
});

/**
 * Create a new category.
 */
export const createCategory = async (data: {
  name: string;
  slug: string;
  description?: string | null; // ✅ match
  isPopular?: boolean;
  isTrending?: boolean;
}): Promise<ReturnType<typeof serializeCategory>> => {
  const categoryData = sanitizeCategoryData(data);
  const category = await new Category(categoryData).save();
  return serializeCategory(category);
};

/**
 * Get all categories, sorted by newest first.
 */
export const getAllCategories = async (): Promise<
  ReturnType<typeof serializeCategory>[]
> => {
  const categories = await Category.find().sort({ createdAt: -1 }).lean<ICategory[]>();
  return categories.map(serializeCategory);
};

/**
 * Get a category by its ID.
 */
export const getCategoryById = async (
  id: string
): Promise<ReturnType<typeof serializeCategory> | null> => {
  const category = await Category.findById(id).lean<ICategory>();
  return category ? serializeCategory(category) : null;
};

/**
 * Update a category by ID.
 */
export const updateCategory = async (
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string | null; // ✅ match
    isPopular?: boolean;
    isTrending?: boolean;
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
 */
export const deleteCategory = async (
  id: string
): Promise<ReturnType<typeof serializeCategory> | null> => {
  const category = await Category.findByIdAndDelete(id).lean<ICategory>();
  return category ? serializeCategory(category) : null;
};

/**
 * Get all categories with total stores and total coupons counts.
 */
export const getCategoriesWithStoreAndCouponCounts = async (): Promise<
  (ReturnType<typeof serializeCategory> & {
    totalStores: number;
    totalCoupons: number;
  })[]
> => {
  const categoriesWithCounts = await Category.aggregate([
    {
      $lookup: {
        from: "stores",
        localField: "_id",
        foreignField: "categories",
        as: "stores",
      },
    },
    {
      $addFields: {
        totalStores: { $size: "$stores" },
      },
    },
    {
      $lookup: {
        from: "coupons",
        let: { storeIds: "$stores._id" },
        pipeline: [{ $match: { $expr: { $in: ["$store", "$$storeIds"] } } }],
        as: "coupons",
      },
    },
    {
      $addFields: {
        totalCoupons: { $size: "$coupons" },
      },
    },
    {
      $project: {
        stores: 0,
        coupons: 0,
        __v: 0,
      },
    },
  ]);

  return categoriesWithCounts.map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    description: cat.description ?? null, // ✅ consistent
    isPopular: cat.isPopular ?? false,
    isTrending: cat.isTrending ?? false,
    createdAt: cat.createdAt?.toISOString?.() ?? null,
    updatedAt: cat.updatedAt?.toISOString?.() ?? null,
    totalStores: cat.totalStores,
    totalCoupons: cat.totalCoupons,
  }));
};

/**
 * Get only popular categories
 */
export const getPopularCategories = async (): Promise<
  ReturnType<typeof serializeCategory>[]
> => {
  const categories = await Category.find({ isPopular: true })
    .sort({ createdAt: -1 })
    .lean<ICategory[]>();
  return categories.map(serializeCategory);
};

/**
 * Get only trending categories
 */
export const getTrendingCategories = async (): Promise<
  ReturnType<typeof serializeCategory>[]
> => {
  const categories = await Category.find({ isTrending: true })
    .sort({ createdAt: -1 })
    .lean<ICategory[]>();
  return categories.map(serializeCategory);
};
/**
 * Get all category names only.
 */
export const getCategoryNames = async (): Promise<string[]> => {
  const categories = await Category.find().select("name").lean<{ name: string }[]>();
  return categories.map((cat) => cat.name);
};
