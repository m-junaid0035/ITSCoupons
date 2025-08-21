"use client";

import { startTransition, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

import { fetchStoreByIdAction, updateStoreAction } from "@/actions/storeActions";
import { fetchAllCategoriesAction } from "@/actions/categoryActions";
import DescriptionEditor from "@/components/DescriptionEditor";
import LoadingSkeleton from "./loading";

interface Category { _id: string; name: string; }
interface FormState { error?: Record<string, string[]> | { message?: string[] }; data?: any; }

const initialState: FormState = { error: {} };
const allowedNetworks = ["N/A", "CJ", "Rakuten", "Awin", "Impact", "ShareASale"];

export default function EditStoreForm() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;

  const [store, setStore] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>("N/A");
  const [descriptionHtml, setDescriptionHtml] = useState<string>("");
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateStoreAction(prevState, storeId, formData),
    initialState
  );

  useEffect(() => {
    async function loadData() {
      try {
        const [storeRes, categoriesRes] = await Promise.all([
          fetchStoreByIdAction(storeId),
          fetchAllCategoriesAction(),
        ]);
        if (storeRes?.data) {
          const s = storeRes.data;
          setStore(s);
          setSelectedCategories(s.categories || []);
          setImagePreview(s.image || null);
          setNetworkName(s.networkName || "N/A");
          setDescriptionHtml(s.description || "");
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
    if (formState.data && !formState.error) setSuccessDialogOpen(true);
    if (formState.error && "message" in formState.error) {
      toast({
        title: "Error",
        description: (formState.error as any).message?.[0] || "Something went wrong",
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

  const toggleCategory = (id: string) =>
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.delete("categories");
    selectedCategories.forEach((c) => formData.append("categories", c));
    formData.set("description", descriptionHtml);

    const requiredFields = ["name", "description", "metaTitle", "metaDescription", "slug"];
    for (const field of requiredFields) {
      if (!formData.get(field)?.toString().trim()) {
        toast({ title: "Validation Error", description: `${field} is required`, variant: "destructive" });
        return;
      }
    }

    if (!imageFile && !imagePreview) {
      toast({ title: "Validation Error", description: "Store image is required", variant: "destructive" });
      return;
    }

    if (imageFile) formData.set("imageFile", imageFile);

    const networkValue = formData.get("networkName")?.toString() || "N/A";
    if (networkValue !== "N/A") {
      const url = formData.get("storeNetworkUrl")?.toString() || "";
      if (!url.trim()) {
        toast({ title: "Validation Error", description: "Store Network URL is required", variant: "destructive" });
        return;
      }
    } else formData.delete("storeNetworkUrl");

    startTransition(() => dispatch(formData));
  };

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Edit Store</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/stores")}>Back to Stores</Button>
        </CardHeader>

        <CardContent>
          <form id="edit-store-form" className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit} encType="multipart/form-data">

            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input id="name" name="name" defaultValue={store.name} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
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
                <Input id="storeNetworkUrl" name="storeNetworkUrl" type="url" defaultValue={store.storeNetworkUrl} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
                {errorFor("storeNetworkUrl") && <p className="text-sm text-red-500">{errorFor("storeNetworkUrl")}</p>}
              </div>
            )}

            {/* Direct URL */}
            <div className="space-y-2">
              <Label htmlFor="directUrl">Direct URL</Label>
              <Input id="directUrl" name="directUrl" type="url" defaultValue={store.directUrl} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorFor("directUrl") && <p className="text-sm text-red-500">{errorFor("directUrl")}</p>}
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <label key={cat._id} className="flex items-center space-x-2">
                    <input type="checkbox" value={cat._id} checked={selectedCategories.includes(cat._id)} onChange={() => toggleCategory(cat._id)} className="h-4 w-4" />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
              {errorFor("categories") && <p className="text-sm text-red-500">{errorFor("categories")}</p>}
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="imageFile">Store Image</Label>
              <Input id="imageFile" name="imageFile" type="file" accept="image/*" onChange={handleImageChange} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
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
              <Input id="metaTitle" name="metaTitle" defaultValue={store.metaTitle} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea id="metaDescription" name="metaDescription" rows={3} defaultValue={store.metaDescription} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input id="metaKeywords" name="metaKeywords" defaultValue={store.metaKeywords} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="focusKeywords">Focus Keywords</Label>
              <Input id="focusKeywords" name="focusKeywords" defaultValue={store.focusKeywords} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* Popular & Active */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" id="isPopular" name="isPopular" value="true" defaultChecked={store.isPopular} className="w-4 h-4" />
                <span>Popular</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" id="isActive" name="isActive" value="true" defaultChecked={store.isActive} className="w-4 h-4" />
                <span>Active</span>
              </label>
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={store.slug} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && <p className="text-sm text-red-500">{(formState.error as any).message?.[0]}</p>}

          </form>
        </CardContent>

        <CardFooter className="flex justify-end border-none px-0">
          <Button type="submit" disabled={isPending} form="edit-store-form">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Updating..." : "Update Store"}
          </Button>
        </CardFooter>
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
          <p>Store updated successfully!</p>
          <DialogFooter>
            <Button onClick={() => { setSuccessDialogOpen(false); router.push("/admin/stores"); }}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
