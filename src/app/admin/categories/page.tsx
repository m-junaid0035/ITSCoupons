"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAllCategoriesAction,
  deleteCategoryAction,
} from "@/actions/categoryActions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ICategory {
  _id: string;
  name: string;
  slug: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    const result = await fetchAllCategoriesAction();

    if (result?.data && Array.isArray(result.data)) {
      setCategories(result.data);
    } else {
      console.error("Failed to fetch categories", result.error);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setLoading(true);
    const result = await deleteCategoryAction(id);

    if (result?.error) {
      alert(result.error.message || "Failed to delete category");
    } else {
      await loadCategories();
    }

    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Categories</CardTitle>
        <Button onClick={() => router.push("/admin/categories/new")}>
          Create Category
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b font-medium">
                <th className="p-3">Name</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr
                    key={category._id}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-3">{category.name}</td>
                    <td className="p-3">{category.slug}</td>
                    <td className="p-3 space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          router.push(`/admin/categories/view/${category._id}`)
                        }
                      >
                        View
                      </Button>
                      <Button
                        onClick={() =>
                          router.push(`/admin/categories/edit/${category._id}`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(category._id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="p-4 text-center text-muted-foreground"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
