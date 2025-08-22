"use client";

import { startTransition, useEffect, useState } from "react";
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
import { fetchLatestSEOAction } from "@/actions/seoActions";

import DescriptionEditor from "@/components/DescriptionEditor";

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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [networkName, setNetworkName] = useState<string>("N/A");

  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [seoModalOpen, setSeoModalOpen] = useState(false);

  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [seo, setSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    focusKeywords: "",
    slug: "",
  });

  /** ---------------- Load Categories ---------------- */
  useEffect(() => {
    async function loadCategories() {
      const result = await fetchAllCategoriesAction();
      if (result.data && Array.isArray(result.data)) setCategories(result.data);
    }
    loadCategories();
  }, []);

  /** ---------------- Error Helper ---------------- */
  const errorsForField = (field: string): string[] => {
    if (!formState.error || typeof formState.error !== "object") return [];
    const fieldErrors = (formState.error as Record<string, string[]>)[field];
    return Array.isArray(fieldErrors) ? fieldErrors : [];
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

  /** ---------------- Image Handling ---------------- */
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

  /** ---------------- Auto SEO Update ---------------- */
  const updateSEO = async (storeName: string) => {
    const { data: latestSEO } = await fetchLatestSEOAction();
    if (!latestSEO) return;

    const replaceStoreName = (text: string) =>
      text.replace(/{{storeName}}|s_n/gi, storeName);

    setSeo({
      metaTitle: replaceStoreName(latestSEO.metaTitle || ""),
      metaDescription: replaceStoreName(latestSEO.metaDescription || ""),
      metaKeywords: (latestSEO.metaKeywords || []).map(replaceStoreName).join(", "),
      focusKeywords: (latestSEO.focusKeywords || []).map(replaceStoreName).join(", "),
      slug: replaceStoreName(latestSEO.slug || storeName.toLowerCase().replace(/\s+/g, "-")),
    });
  };

  /** ---------------- Listen Store Name Changes ---------------- */
  useEffect(() => {
    const nameInput = document.getElementById("name") as HTMLInputElement | null;
    if (!nameInput) return;

    const listener = () => {
      const storeName = nameInput.value.trim();
      if (storeName) updateSEO(storeName);
    };
    nameInput.addEventListener("input", listener);
    return () => nameInput.removeEventListener("input", listener);
  }, []);

  /** ---------------- Submit Handler ---------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const requiredFields = ["name", "slug"];
    for (const field of requiredFields) {
      if (!formData.get(field)?.toString().trim()) {
        toast({ title: "Validation Error", description: `${field} is required`, variant: "destructive" });
        return;
      }
    }

    if (!imageFile) {
      toast({ title: "Validation Error", description: "Store image is required", variant: "destructive" });
      return;
    }

    // Attach image and SEO/description fields
    formData.set("imageFile", imageFile);
    formData.set("description", descriptionHtml);
    formData.set("metaTitle", seo.metaTitle);
    formData.set("metaDescription", seo.metaDescription);
    formData.set("metaKeywords", seo.metaKeywords);
    formData.set("focusKeywords", seo.focusKeywords);
    formData.set("slug", seo.slug);
    startTransition(() => {
      dispatch(formData);
    });
  };

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Create Store</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/stores")}>Back to Stores</Button>
        </CardHeader>

        <CardContent>
          <form id="store-form" className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit} encType="multipart/form-data">

            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input id="name" name="name" required placeholder="Enter store name" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorsForField("name").map((err, idx) => (
                <p key={idx} className="text-sm text-red-500">{err}</p>
              ))}
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
            </div>

            {/* Direct URL */}
            <div className="space-y-2">
              <Label htmlFor="directUrl">Direct URL</Label>
              <Input id="directUrl" name="directUrl" type="url" placeholder="https://example.com/direct" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorsForField("directUrl").map((err, idx) => (
                <p key={idx} className="text-sm text-red-500">{err}</p>
              ))}
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

            {networkName !== "N/A" && (
              <div className="space-y-2">
                <Label htmlFor="storeNetworkUrl">Store Network URL</Label>
                <Input id="storeNetworkUrl" name="storeNetworkUrl" type="url" placeholder="https://example.com" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
                {errorsForField("storeNetworkUrl").map((err, idx) => (
                  <p key={idx} className="text-sm text-red-500">{err}</p>
                ))}
              </div>
            )}

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
              {errorsForField("categories").map((err, idx) => (
                <p key={idx} className="text-sm text-red-500">{err}</p>
              ))}
            </div>

            {/* Description Modal Trigger */}
            <div>
              <Button type="button" onClick={() => setDescriptionModalOpen(true)}>Edit Description</Button>
            </div>

            {/* SEO Modal Trigger */}
            <div>
              <Button type="button" onClick={() => setSeoModalOpen(true)}>Edit SEO Fields</Button>
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
              <Input id="slug" name="slug" required placeholder="store-slug" value={seo.slug} onChange={(e) => setSeo(prev => ({ ...prev, slug: e.target.value }))} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {errorsForField("slug").map((err, idx) => (
                <p key={idx} className="text-sm text-red-500">{err}</p>
              ))}
            </div>

            {/* General Errors */}
            {Array.isArray((formState.error as any)?.message) &&
              (formState.error as any).message.map((msg: string, idx: number) => (
                <p key={idx} className="text-sm text-red-500">{msg}</p>
              ))}

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

      {/* SEO Modal */}
      <Dialog open={seoModalOpen} onOpenChange={setSeoModalOpen}>
        <DialogContent className="max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle>Edit SEO Fields</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input id="metaTitle" value={seo.metaTitle} onChange={e => setSeo(prev => ({ ...prev, metaTitle: e.target.value }))} className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea id="metaDescription" rows={3} value={seo.metaDescription} onChange={e => setSeo(prev => ({ ...prev, metaDescription: e.target.value }))} className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input id="metaKeywords" value={seo.metaKeywords} onChange={e => setSeo(prev => ({ ...prev, metaKeywords: e.target.value }))} className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="focusKeywords">Focus Keywords</Label>
              <Input id="focusKeywords" value={seo.focusKeywords} onChange={e => setSeo(prev => ({ ...prev, focusKeywords: e.target.value }))} className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slugModal" value={seo.slug} onChange={e => setSeo(prev => ({ ...prev, slug: e.target.value }))} className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSeoModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setSeoModalOpen(false)}>Save</Button>
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
