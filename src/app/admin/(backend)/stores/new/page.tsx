"use client";

import { startTransition, useEffect, useState, useRef } from "react";
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
import { fetchAllNetworksAction } from "@/actions/networkActions";
import { fetchLatestSEOAction } from "@/actions/seoActions";

import RichTextEditor from "@/components/RichTextEditor";

interface FormState {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
}

interface Category {
  _id: string;
  name: string;
}
interface Network {
  _id: string;
  networkName: string;
}

const initialState: FormState = { error: {} };

export default function StoreForm() {
  const router = useRouter();
  const [formState, dispatch, isPending] = useActionState(
    createStoreAction,
    initialState
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [networkSearch, setNetworkSearch] = useState("");
  const [seoModalOpen, setSeoModalOpen] = useState(false);

  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [seo, setSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    focusKeywords: "",
    slug: "",
  });

  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const networkDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [storeNetworkUrl, setStoreNetworkUrl] = useState("");

  useEffect(() => {
    if (!networkSearch.trim()) {
      setSelectedNetwork(null);
      setStoreNetworkUrl(""); // reset URL
    }
  }, [networkSearch]);


  /** ---------------- Load Categories & Networks ---------------- */
  useEffect(() => {
    async function loadData() {
      const catResult = await fetchAllCategoriesAction();
      if (catResult.data && Array.isArray(catResult.data))
        setCategories(catResult.data);

      const netResult = await fetchAllNetworksAction();
      if (netResult.data && Array.isArray(netResult.data))
        setNetworks(netResult.data);
    }
    loadData();
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
        description:
          (formState.error as any).message?.[0] || "Something went wrong",
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
    const { data: latestSEO } = await fetchLatestSEOAction("stores");
    if (!latestSEO) return;

    // Format current date -> "14 September 2025"
    const currentDate = new Date().toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });


    const replacePlaceholders = (text: string) =>
      text
        .replace(/{{storeName}}|s_n/gi, storeName)
        .replace(/{{currentDate}}|c_d/gi, currentDate);

    const slugSource = latestSEO.slug || storeName;
    const processedSlug = replacePlaceholders(slugSource)
      .toLowerCase()
      .replace(/\s+/g, "-");

    setSeo({
      metaTitle: replacePlaceholders(latestSEO.metaTitle || ""),
      metaDescription: replacePlaceholders(latestSEO.metaDescription || ""),
      metaKeywords: (latestSEO.metaKeywords || [])
        .map(replacePlaceholders)
        .join(", "),
      focusKeywords: (latestSEO.focusKeywords || [])
        .map(replacePlaceholders)
        .join(", "),
      slug: processedSlug,
    });
  };

  /** ---------------- Listen Store Name Changes ---------------- */
  useEffect(() => {
    const nameInput = document.getElementById(
      "name"
    ) as HTMLInputElement | null;
    if (!nameInput) return;

    const listener = () => {
      const storeName = nameInput.value.trim();
      if (storeName) updateSEO(storeName);
    };
    nameInput.addEventListener("input", listener);
    return () => nameInput.removeEventListener("input", listener);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        networkDropdownRef.current &&
        !networkDropdownRef.current.contains(event.target as Node)
      ) {
        setNetworkDropdownOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** ---------------- Submit Handler ---------------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // ✅ Store Name required
    if (!formData.get("name")?.toString().trim()) {
      toast({
        title: "Validation Error",
        description: "Store name is required",
        variant: "destructive",
      });
      return;
    }

    // ✅ Image required
    if (!imageFile) {
      toast({
        title: "Validation Error",
        description: "Store image is required",
        variant: "destructive",
      });
      return;
    }

    // ✅ At least one category required
    if (selectedCategories.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one category is required",
        variant: "destructive",
      });
      return;
    }

    // ✅ Description required
    if (!descriptionHtml || descriptionHtml.trim().length < 10) {
      toast({
        title: "Validation Error",
        description: "Description is required (minimum 10 characters)",
        variant: "destructive",
      });
      return;
    }

    // ✅ Direct URL OR Network required
    const directUrl = formData.get("directUrl")?.toString().trim();
    if (!directUrl && !selectedNetwork) {
      toast({
        title: "Validation Error",
        description: "You must provide either a Direct URL or select a Network",
        variant: "destructive",
      });
      return;
    }

    // ✅ If network selected → affiliated link required
    if (selectedNetwork && !formData.get("storeNetworkUrl")?.toString().trim()) {
      toast({
        title: "Validation Error",
        description: "Affiliated link is required when a Network is selected",
        variant: "destructive",
      });
      return;
    }
    // Content optional — but trim if empty
    const cleanedContent = contentHtml?.trim() || "";


    formData.set("imageFile", imageFile);
    formData.set("description", descriptionHtml);
    formData.set("content", cleanedContent);
    formData.set("metaTitle", seo.metaTitle);
    formData.set("metaDescription", seo.metaDescription);
    formData.set("metaKeywords", seo.metaKeywords);
    formData.set("focusKeywords", seo.focusKeywords);
    formData.set("slug", seo.slug);
    formData.set("network", selectedNetwork?._id || "");
    formData.set("storeNetworkUrl", formData.get("storeNetworkUrl")?.toString().trim() || "");
    selectedCategories.forEach((catId) => formData.append("categories", catId));

    startTransition(() => {
      dispatch(formData);
    });
  };

  /** ---------------- Search Helpers ---------------- */
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );
  const filteredNetworks = networks.filter((n) =>
    n.networkName.toLowerCase().includes(networkSearch.toLowerCase())
  );

  return (
    <>
      <Card className="w-full min-h-screen shadow-lg bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">
            Create Store
          </CardTitle>
          <div>
            <Button type="submit" disabled={isPending} form="store-form" className="m-2">
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? "Saving..." : "Save Store"}
              </Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/admin/stores")}
          >
            Back to Stores
          </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form
            id="store-form"
            className="space-y-6 w-full"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Store Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter store name"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorsForField("name").map((err, idx) => (
                <p key={idx} className="text-sm text-red-500">
                  {err}
                </p>
              ))}
            </div>

            {/* Image File */}
            <div className="space-y-2">
              <Label htmlFor="imageFile">
                Store Image <span className="text-red-500">*</span>
              </Label>
              <Input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {imagePreview && (
                <div className="relative mt-2 max-h-40 w-fit">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded shadow-md max-h-40"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Direct URL */}
            <div className="space-y-2">
              <Label htmlFor="directUrl">
                Direct URL{" "}
                <span className="block mt-1 text-red-500 italic text-xs">
                  Paste Direct Url
                </span>
              </Label>
              <Input
                id="directUrl"
                name="directUrl"
                type="url"
                placeholder="https://example.com/direct"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorsForField("directUrl").map((err, idx) => (
                <p key={idx} className="text-sm text-red-500">
                  {err}
                </p>
              ))}
            </div>

            {/* Network Searchable Dropdown */}
            <div className="relative space-y-2" ref={networkDropdownRef}>
              <Label>
                Network{" "}
                <span className="block mt-1 text-red-500 italic text-xs">
                  Select a Network
                </span>
              </Label>
              <Input
                placeholder="Search network..."
                value={networkSearch}
                onFocus={() => setNetworkDropdownOpen(true)}
                onChange={(e) => setNetworkSearch(e.target.value)}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {networkDropdownOpen && (
                <div className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white dark:bg-gray-700 border rounded mt-1">
                  {filteredNetworks.map((net) => (
                    <div
                      key={net._id}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={() => {
                        setSelectedNetwork(net);
                        setNetworkSearch(net.networkName);
                        setNetworkDropdownOpen(false);
                      }}
                    >
                      {net.networkName}
                    </div>
                  ))}
                  {filteredNetworks.length === 0 && (
                    <div className="px-3 py-2 text-gray-500">No networks found</div>
                  )}
                </div>
              )}
            </div>

            {/* Store Network URL - only show if network selected */}
            {selectedNetwork && (
              <div className="space-y-2">
                <Label htmlFor="storeNetworkUrl">Store Affiliated Link</Label>
                <Input
                  id="storeNetworkUrl"
                  name="storeNetworkUrl"
                  placeholder="https://example.com/network-store"
                  value={storeNetworkUrl}
                  onChange={(e) => setStoreNetworkUrl(e.target.value)}
                  className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                />
              </div>
            )}



            <div className="relative space-y-2" ref={categoryDropdownRef}>
              <Label>
                Categories <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Select categories..."
                value={selectedCategories
                  .map((id) => filteredCategories.find((c) => c._id === id)?.name)
                  .filter(Boolean)
                  .join(", ")}
                onFocus={() => setCategoryDropdownOpen(true)}
                readOnly
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700 cursor-pointer"
              />
              {categoryDropdownOpen && (
                <div className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white dark:bg-gray-700 border rounded mt-1 p-2 grid grid-cols-1 gap-2">
                  <Input
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="mb-2 border p-1"
                  />
                  {filteredCategories.map((cat) => (
                    <label
                      key={cat._id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories((prev) => [...prev, cat._id]);
                          } else {
                            setSelectedCategories((prev) =>
                              prev.filter((id) => id !== cat._id)
                            );
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                  {filteredCategories.length === 0 && (
                    <div className="text-gray-500">No categories found</div>
                  )}
                </div>
              )}
            </div>



            {/* Description */}
            <div className="space-y-2">
              <Label>
                Description <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor
                value={descriptionHtml}
                onChange={setDescriptionHtml}
                height="200px"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label>
                Content <span className="text-gray-400">(Optional)</span>
              </Label>
              <RichTextEditor
                value={contentHtml}
                onChange={setContentHtml}
                height="500px"
              />
            </div>


            {/* SEO Modal Trigger */}
            <div>
              <Button type="button" onClick={() => setSeoModalOpen(true)}>
                Edit SEO Fields
              </Button>
            </div>

            {/* isPopular */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPopular"
                name="isPopular"
                value="true"
                className="w-4 h-4"
              />
              <Label htmlFor="isPopular">Mark as Popular</Label>
            </div>

            {/* isActive */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                value="true"
                defaultChecked
                className="w-4 h-4"
              />
              <Label htmlFor="isActive">Mark as Active</Label>
            </div>



            {/* General Errors */}
            {Array.isArray((formState.error as any)?.message) &&
              (formState.error as any).message.map(
                (msg: string, idx: number) => (
                  <p key={idx} className="text-sm text-red-500">
                    {msg}
                  </p>
                )
              )}

            <CardFooter className="flex justify-end border-none px-0">
              <Button type="submit" disabled={isPending} form="store-form">
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? "Saving..." : "Save Store"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* SEO Modal */}
      <Dialog open={seoModalOpen} onOpenChange={setSeoModalOpen}>
        <DialogContent className="max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle>Edit SEO Fields</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={seo.metaTitle}
                onChange={(e) =>
                  setSeo((prev) => ({ ...prev, metaTitle: e.target.value }))
                }
                className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                rows={3}
                value={seo.metaDescription}
                onChange={(e) =>
                  setSeo((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input
                id="metaKeywords"
                value={seo.metaKeywords}
                onChange={(e) =>
                  setSeo((prev) => ({
                    ...prev,
                    metaKeywords: e.target.value,
                  }))
                }
                className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="focusKeywords">Focus Keywords</Label>
              <Input
                id="focusKeywords"
                value={seo.focusKeywords}
                onChange={(e) =>
                  setSeo((prev) => ({
                    ...prev,
                    focusKeywords: e.target.value,
                  }))
                }
                className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="slugModal">Slug</Label>
              <Input
                id="slugModal"
                name="slug"  // ✅ add name="slug" so it still submits with the form
                value={seo.slug}
                onChange={(e) =>
                  setSeo((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSeoModalOpen(false)}>
              Cancel
            </Button>
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
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/stores");
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
