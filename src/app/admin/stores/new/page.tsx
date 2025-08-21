"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { createStoreAction } from "@/actions/storeActions";
import { fetchAllCategoriesAction } from "@/actions/categoryActions";

interface FormState {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
}

const initialState: FormState = { error: {} };
interface Category { _id: string; name: string; }
const allowedNetworks = ["CJ", "Rakuten", "Awin", "Impact", "ShareASale", "N/A"];

export default function StoreForm() {
  const router = useRouter();
  const [formState, dispatch, isPending] = useActionState(createStoreAction, initialState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  // Image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Network Name state to conditionally show storeNetworkUrl
  const [networkName, setNetworkName] = useState<string>("N/A");

  useEffect(() => {
    async function loadCategories() {
      const result = await fetchAllCategoriesAction();
      if (result.data && Array.isArray(result.data)) setCategories(result.data);
    }
    loadCategories();
  }, []);

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;
  };

  useEffect(() => {
    if (formState.data && !formState.error) setSuccessDialogOpen(true);

    if (formState.error && "message" in formState.error) {
      toast({
        title: "Error",
        description: (formState.error as any).message?.[0] || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [formState]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Basic client-side validation
    const requiredFields = ["name", "description", "metaTitle", "metaDescription", "slug"];
    for (const field of requiredFields) {
      if (!formData.get(field)?.toString().trim()) {
        toast({
          title: "Validation Error",
          description: `${field} is required`,
          variant: "destructive",
        });
        return; // stop submission
      }
    }

    // Only attach image if it exists
    if (!imageFile) {
      toast({
        title: "Validation Error",
        description: `Store image is required`,
        variant: "destructive",
      });
      return;
    }

    formData.set("imageFile", imageFile);

    await dispatch(formData);
  };

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Create Store</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/stores")}>
            Back to Stores
          </Button>
        </CardHeader>

        <CardContent>
          <form id="store-form" className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input id="name" name="name" required placeholder="Enter store name" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("name") && <p className="text-sm text-red-500">{errorFor("name")}</p>}
            </div>

            {/* Network Name */}
            <div className="space-y-2">
              <Label htmlFor="networkName">Network Name</Label>
              <select
                id="networkName"
                name="networkName"
                className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                value={networkName}
                onChange={(e) => setNetworkName(e.target.value)}
              >
                {allowedNetworks.map((network) => <option key={network} value={network}>{network}</option>)}
              </select>
            </div>

            {/* Store Network URL (conditionally shown) */}
            {networkName !== "N/A" && (
              <div className="space-y-2">
                <Label htmlFor="storeNetworkUrl">Store Network URL</Label>
                <Input id="storeNetworkUrl" name="storeNetworkUrl" type="url" placeholder="https://example.com" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
                {errorFor("storeNetworkUrl") && <p className="text-sm text-red-500">{errorFor("storeNetworkUrl")}</p>}
              </div>
            )}

            {/* Direct URL */}
            <div className="space-y-2">
              <Label htmlFor="directUrl">Direct URL</Label>
              <Input id="directUrl" name="directUrl" type="url" placeholder="https://example.com/direct" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("directUrl") && <p className="text-sm text-red-500">{errorFor("directUrl")}</p>}
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <label key={cat._id} className="flex items-center space-x-2">
                    <input type="checkbox" name="categories" value={cat._id} className="h-4 w-4" />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
              {errorFor("categories") && <p className="text-sm text-red-500">{errorFor("categories")}</p>}
            </div>

            {/* Total Coupon Used Times */}
            <div className="space-y-2">
              <Label htmlFor="totalCouponUsedTimes">Total Coupon Used Times</Label>
              <Input id="totalCouponUsedTimes" name="totalCouponUsedTimes" type="number" defaultValue={0} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* Image File */}
            <div className="space-y-2">
              <Label htmlFor="imageFile">Store Image</Label>
              <Input id="imageFile" name="imageFile" type="file" accept="image/*" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" onChange={handleImageChange} />
              {imagePreview && (
                <div className="relative mt-2 max-h-40 w-fit">
                  <img src={imagePreview} alt="Preview" className="rounded shadow-md max-h-40" />
                  <button type="button" onClick={removeImage} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {errorFor("image") && <p className="text-sm text-red-500">{errorFor("image")}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} required placeholder="Enter store description" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* Meta Title */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input id="metaTitle" name="metaTitle" required placeholder="Enter meta title" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea id="metaDescription" name="metaDescription" rows={3} required placeholder="Enter meta description" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* Meta Keywords */}
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords (comma separated)</Label>
              <Input id="metaKeywords" name="metaKeywords" placeholder="keyword1, keyword2" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* Focus Keywords */}
            <div className="space-y-2">
              <Label htmlFor="focusKeywords">Focus Keywords (comma separated)</Label>
              <Input id="focusKeywords" name="focusKeywords" placeholder="keyword1, keyword2" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* isPopular */}
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="isPopular" name="isPopular" value="true" className="w-4 h-4" />
              <Label htmlFor="isPopular">Mark as Popular</Label>
            </div>

            {/* isActive */}
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="isActive" name="isActive" value="true" defaultChecked className="w-4 h-4" />
              <Label htmlFor="isActive">Mark as Active</Label>
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" required placeholder="store-slug" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">{(formState.error as any).message?.[0]}</p>
            )}

            <CardFooter className="flex justify-end border-none px-0">
              <Button type="submit" disabled={isPending} form="store-form">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Saving..." : "Save Store"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Store created successfully!</p>
          <DialogFooter>
            <Button onClick={() => { setSuccessDialogOpen(false); router.push("/admin/stores"); }}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
