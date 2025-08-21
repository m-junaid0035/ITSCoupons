"use client";

import { startTransition, useEffect, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

import { createStoreAction, StoreFormState } from "@/actions/storeActions";
import { fetchAllCategoriesAction } from "@/actions/categoryActions";

import DescriptionEditor from "@/components/DescriptionEditor";
import { Textarea } from "@/components/ui/textarea";

interface Category { _id: string; name: string; }
const allowedNetworks = ["CJ", "Rakuten", "Awin", "Impact", "ShareASale", "N/A"];

const initialState: StoreFormState = { error: {} };

export default function StoreForm() {
  const router = useRouter();
  const [formState, dispatch, isPending] = useActionState(createStoreAction, initialState);

  const [categories, setCategories] = useState<Category[]>([]);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [networkName, setNetworkName] = useState<string>("N/A");
  const [descriptionHtml, setDescriptionHtml] = useState<string>("");
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);

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
    } else setImagePreview(null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);

  // Required fields
  const requiredFields = ["name", "metaTitle", "metaDescription", "slug"];
  for (const field of requiredFields) {
    if (!formData.get(field)?.toString().trim()) {
      toast({
        title: "Validation Error",
        description: `${field} is required`,
        variant: "destructive",
      });
      return;
    }
  }

  if (!descriptionHtml.trim()) {
    toast({ title: "Validation Error", description: "Description is required", variant: "destructive" });
    return;
  }
  formData.set("description", descriptionHtml);

  if (!imageFile) {
    toast({ title: "Validation Error", description: "Store image is required", variant: "destructive" });
    return;
  }
  formData.set("imageFile", imageFile);

  // Handle network URL
  const networkNameValue = formData.get("networkName")?.toString() || "N/A";
  if (networkNameValue !== "N/A") {
    const url = formData.get("storeNetworkUrl")?.toString() || "";
    if (!url.trim()) {
      toast({
        title: "Validation Error",
        description: "Store Network URL is required if network is selected",
        variant: "destructive",
      });
      return;
    }
  } else {
    // ✅ Remove storeNetworkUrl if networkName is N/A
    formData.delete("storeNetworkUrl");
  }

  // Submit
  startTransition(() => {
    dispatch(formData);
  });
};


  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Create Store</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/stores")}>Back</Button>
        </CardHeader>

        <CardContent>
          <form id="store-form" className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit} encType="multipart/form-data">

            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input id="name" name="name" placeholder="Enter store name" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("name") && <p className="text-sm text-red-500">{errorFor("name")}</p>}
            </div>

            {/* Network */}
            <div className="space-y-2">
              <Label htmlFor="networkName">Network Name</Label>
              <select id="networkName" name="networkName" value={networkName} onChange={e => setNetworkName(e.target.value)} className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700">
                {allowedNetworks.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {/* Conditional Network URL */}
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
                {categories.map(cat => (
                  <label key={cat._id} className="flex items-center space-x-2">
                    <input type="checkbox" name="categories" value={cat._id} className="h-4 w-4" />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
              {errorFor("categories") && <p className="text-sm text-red-500">{errorFor("categories")}</p>}
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="imageFile">Store Image</Label>
              <Input id="imageFile" name="imageFile" type="file" accept="image/*" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" onChange={handleImageChange} />
              {imagePreview && (
                <div className="relative mt-2 max-h-40 w-fit">
                  <img src={imagePreview} alt="Preview" className="rounded shadow-md max-h-40" />
                  <button type="button" onClick={removeImage} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"><X className="h-4 w-4" /></button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Button variant="outline" onClick={() => setDescriptionModalOpen(true)}>Edit Description</Button>
            </div>

            {/* Meta Fields */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input id="metaTitle" name="metaTitle" placeholder="Meta title" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea id="metaDescription" name="metaDescription" rows={3} placeholder="Meta description" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input id="metaKeywords" name="metaKeywords" placeholder="keyword1, keyword2" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="focusKeywords">Focus Keywords</Label>
              <Input id="focusKeywords" name="focusKeywords" placeholder="keyword1, keyword2" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* Popular & Active */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" id="isPopular" name="isPopular" value="true" className="w-4 h-4" />
                <span>Popular</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" id="isActive" name="isActive" value="true" defaultChecked className="w-4 h-4" />
                <span>Active</span>
              </label>
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" placeholder="store-slug" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && <p className="text-sm text-red-500">{(formState.error as any).message?.[0]}</p>}

            <CardFooter className="flex justify-end border-none px-0">
              <Button type="submit" disabled={isPending} form="store-form">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Saving..." : "Save Store"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Description Modal */}
      <Dialog open={descriptionModalOpen} onOpenChange={setDescriptionModalOpen}>
        <DialogContent className="max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle>Edit Description</DialogTitle>
          </DialogHeader>
          <DescriptionEditor initialContent={descriptionHtml} onChange={setDescriptionHtml} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDescriptionModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setDescriptionModalOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Store created successfully!</p>
          <DialogFooter>
            <Button onClick={() => { setSuccessDialogOpen(false); router.push("/admin/stores"); }}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
