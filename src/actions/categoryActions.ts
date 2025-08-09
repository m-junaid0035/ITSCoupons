"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "@/functions/categoryFunctions";

// ✅ Category Validation Schema
const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  slug: z.string().trim().min(2, "Slug must be at least 2 characters").max(50),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export type CategoryFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

// ✅ Helper: Parse FormData to CategoryFormData
function parseFormData(formData: FormData): CategoryFormData {
  return {
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
  };
}

// ✅ CREATE CATEGORY
export async function createCategoryAction(
  prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await connectToDatabase();

  const parsed = parseFormData(formData);
  const result = categorySchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const category = await createCategory(result.data);
    return { data: category };
  } catch (error: any) {
    if (error.code === 11000) {
      return { error: { slug: ["Slug must be unique"] } };
    }
    return { error: { message: [error.message || "Failed to create category"] } };
  }
}

// ✅ UPDATE CATEGORY
export async function updateCategoryAction(
  prevState: CategoryFormState,
  id: string,
  formData: FormData
): Promise<CategoryFormState> {
  await connectToDatabase();

  const parsed = parseFormData(formData);
  const result = categorySchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const updated = await updateCategory(id, result.data);
    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update category"] } };
  }
}

// ✅ DELETE CATEGORY
export async function deleteCategoryAction(id: string) {
  await connectToDatabase();
  try {
    const deleted = await deleteCategory(id);
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete category"] } };
  }
}

// ✅ FETCH ALL CATEGORIES
export async function fetchAllCategoriesAction() {
  await connectToDatabase();
  try {
    const categories = await getAllCategories();
    return { data: categories }; // already serialized in categoryFunctions
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch categories"] } };
  }
}

// ✅ FETCH SINGLE CATEGORY
export async function fetchCategoryByIdAction(id: string) {
  await connectToDatabase();
  try {
    const category = await getCategoryById(id);
    if (!category) {
      return { error: { message: ["Category not found"] } };
    }
    return { data: category };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch category"] } };
  }
}
