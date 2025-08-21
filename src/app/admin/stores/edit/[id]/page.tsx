"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import LoadingSkeleton from "./loading";
import { toast } from "@/hooks/use-toast";
import { fetchStoreByIdAction, updateStoreAction } from "@/actions/storeActions";
import { fetchAllCategoriesAction } from "@/actions/categoryActions";

interface FormState {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
}

const initialState: FormState = { error: {} };
interface Category { _id: string; name: string; }
const allowedNetworks = ["N/A", "CJ", "Rakuten", "Awin", "Impact", "ShareASale"];

export default function EditStoreForm() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;

  const [store, setStore] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateStoreAction(prevState, storeId, formData),
    initialState
  );

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Network Name state
  const [networkName, setNetworkName] = useState<string>("N/A");

  useEffect(() => {
    async function loadData() {
      try {
        const [storeRes, categoriesRes] = await Promise.all([
          fetchStoreByIdAction(storeId),
          fetchAllCategoriesAction(),
        ]);
        if (storeRes?.data) {
          setStore(storeRes.data);
          setSelectedCategories(storeRes.data.categories || []);
          setImagePreview(storeRes.data.image || null);
          setNetworkName(storeRes.data.networkName || "N/A");
        }
        if (categoriesRes?.data) setCategories(categoriesRes.data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [storeId]);

  useEffect(() => {
    if (formState.data && !formState.error) {
      setSuccessDialogOpen(true);
    }
    if (formState.error && "message" in formState.error) {
      toast({
        title: "Error",
        description:
          (formState.error as any).message?.[0] || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [formState]);

  const errorFor = (field: string) =>
    formState.error && typeof formState.error === "object" && field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  if (loading) return <LoadingSkeleton />;
  if (!store) return <p className="text-red-500 text-center mt-4">Store not found</p>;

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.delete("categories");
    selectedCategories.forEach((c) => formData.append("categories", c));

    const requiredFields = ["name", "description", "metaTitle", "metaDescription", "slug"];
    for (const field of requiredFields) {
      if (!formData.get(field)?.toString().trim()) {
        toast({ title: "Validation Error", description: `${field} is required`, variant: "destructive" });
        return;
      }
    }

    // Validate image
    if (!imageFile && !imagePreview) {
      toast({ title: "Validation Error", description: "Store image is required", variant: "destructive" });
      return;
    }

    if (imageFile) formData.set("imageFile", imageFile);

    dispatch(formData);
  };

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Edit Store</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/stores")}>Back to Stores</Button>
        </CardHeader>

        <CardContent>
          <form className="space-y-6 max-w-2xl mx-auto" id="edit-store-form" onSubmit={handleSubmit} encType="multipart/form-data">

            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input id="name" name="name" required defaultValue={store.name} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("name") && <p className="text-sm text-red-500">{errorFor("name")}</p>}
            </div>

            {/* Network Name */}
            <div className="space-y-2">
              <Label htmlFor="networkName">Network Name</Label>
              <select
                id="networkName"
                name="networkName"
                value={networkName}
                onChange={(e) => setNetworkName(e.target.value)}
                className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              >
                {allowedNetworks.map((network) => (
                  <option key={network} value={network}>{network}</option>
                ))}
              </select>
            </div>

            {/* Store Network URL: only show if networkName !== "N/A" */}
            {networkName !== "N/A" && (
              <div className="space-y-2">
                <Label htmlFor="storeNetworkUrl">Store Network URL</Label>
                <Input id="storeNetworkUrl" name="storeNetworkUrl" type="url" required defaultValue={store.storeNetworkUrl} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
                {errorFor("storeNetworkUrl") && <p className="text-sm text-red-500">{errorFor("storeNetworkUrl")}</p>}
              </div>
            )}

            {/* Categories */}
            <div className="space-y-2">
              <Label>Categories</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-none shadow-sm bg-gray-50 dark:bg-gray-700",
                      selectedCategories.length === 0 && "text-muted-foreground"
                    )}
                  >
                    {selectedCategories.length > 0 ? `${selectedCategories.length} selected` : "Select categories"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center space-x-2 py-1">
                      <input type="checkbox" value={cat._id} checked={selectedCategories.includes(cat._id)} onChange={() => toggleCategory(cat._id)} className="h-4 w-4" />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </PopoverContent>
              </Popover>
              {errorFor("categories") && <p className="text-sm text-red-500">{errorFor("categories")}</p>}
            </div>

            {/* Total Coupon Used Times */}
            <div className="space-y-2">
              <Label htmlFor="totalCouponUsedTimes">Total Coupon Used Times</Label>
              <Input id="totalCouponUsedTimes" name="totalCouponUsedTimes" type="number" defaultValue={store.totalCouponUsedTimes ?? 0} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("totalCouponUsedTimes") && <p className="text-sm text-red-500">{errorFor("totalCouponUsedTimes")}</p>}
            </div>

            {/* Image Upload */}
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
              <Textarea id="description" name="description" rows={4} required defaultValue={store.description} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("description") && <p className="text-sm text-red-500">{errorFor("description")}</p>}
            </div>

            {/* Meta Title */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input id="metaTitle" name="metaTitle" required defaultValue={store.metaTitle} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("metaTitle") && <p className="text-sm text-red-500">{errorFor("metaTitle")}</p>}
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea id="metaDescription" name="metaDescription" rows={3} required defaultValue={store.metaDescription} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("metaDescription") && <p className="text-sm text-red-500">{errorFor("metaDescription")}</p>}
            </div>

            {/* Meta Keywords */}
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords (comma separated)</Label>
              <Input id="metaKeywords" name="metaKeywords" defaultValue={store.metaKeywords} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("metaKeywords") && <p className="text-sm text-red-500">{errorFor("metaKeywords")}</p>}
            </div>

            {/* Focus Keywords */}
            <div className="space-y-2">
              <Label htmlFor="focusKeywords">Focus Keywords (comma separated)</Label>
              <Input id="focusKeywords" name="focusKeywords" defaultValue={store.focusKeywords} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("focusKeywords") && <p className="text-sm text-red-500">{errorFor("focusKeywords")}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" required defaultValue={store.slug} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("slug") && <p className="text-sm text-red-500">{errorFor("slug")}</p>}
            </div>

            {/* Is Popular */}
            <div className="flex items-center space-x-2">
              <input id="isPopular" name="isPopular" type="checkbox" defaultChecked={store.isPopular} className="h-4 w-4" />
              <Label htmlFor="isPopular" className="mb-0 cursor-pointer">Mark as Popular</Label>
            </div>

            {/* Is Active */}
            <div className="flex items-center space-x-2">
              <input id="isActive" name="isActive" type="checkbox" defaultChecked={store.isActive} className="h-4 w-4" />
              <Label htmlFor="isActive" className="mb-0 cursor-pointer">Mark as Active</Label>
            </div>

            {/* General Error */}
            {"message" in (formState.error || {}) && (
              <p className="text-sm text-red-500">{(formState.error as { message?: string[] }).message?.[0]}</p>
            )}

          </form>
        </CardContent>

        <CardFooter className="flex justify-end border-none px-0">
          <Button type="submit" disabled={isPending} form="edit-store-form">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Updating..." : "Update Store"}
          </Button>
        </CardFooter>
      </Card>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Store updated successfully!</p>
          <DialogFooter>
            <Button onClick={() => { setSuccessDialogOpen(false); router.push("/admin/stores"); }}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
