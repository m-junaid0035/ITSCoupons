"use client";

import { startTransition, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

import { updateStoreAction } from "@/actions/storeActions";
import { fetchLatestSEOAction } from "@/actions/seoActions";

import DescriptionEditor from "@/components/DescriptionEditor";
import RichTextEditor from "@/components/RichTextEditor";

interface FormState {
    error?: Record<string, string[]> | { message?: string[] };
    data?: any;
}

interface Category { _id: string; name: string; }
interface Network { _id: string; networkName: string; storeNetworkUrl: string; }

const initialState: FormState = { error: {} };

export default function EditStoreForm({
    storeId,
    storeData,
    categoriesData,
    networksData,
    selectedNetworkData,
}: {
    storeId: string;
    storeData: any;
    categoriesData: Category[];
    networksData: Network[];
    selectedNetworkData: Network | null;
}) {
    const router = useRouter();

    const [formState, dispatch, isPending] = useActionState(
        async (prevState: FormState, formData: FormData) =>
            await updateStoreAction(prevState, storeId, formData),
        initialState
    );

    /** ---------------- State ---------------- */
    const [store] = useState<any>(storeData);
    const [categories] = useState<Category[]>(categoriesData);
    const [networks] = useState<Network[]>(networksData);

    const [storeName, setStoreName] = useState(storeData?.name || "");
    const [selectedCategories, setSelectedCategories] = useState<string[]>(storeData?.categories || []);
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(selectedNetworkData);
    const [networkUrl, setNetworkUrl] = useState(selectedNetworkData?.storeNetworkUrl || "");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(storeData?.image || null);
    const [descriptionHtml, setDescriptionHtml] = useState(storeData?.description || "");
    const [contentHtml, setContentHtml] = useState(storeData?.content || "");
    const [seo, setSeo] = useState({
        metaTitle: storeData?.metaTitle || "",
        metaDescription: storeData?.metaDescription || "",
        metaKeywords: storeData?.metaKeywords || "",
        focusKeywords: storeData?.focusKeywords || "",
        slug: storeData?.slug || "",
    });

    const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
    const [seoModalOpen, setSeoModalOpen] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);

    const [networkSearch, setNetworkSearch] = useState(selectedNetworkData?.networkName || "");
    const [categorySearch, setCategorySearch] = useState("");
    const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

    const networkDropdownRef = useRef<HTMLDivElement>(null);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);

    /** ---------------- Click Outside Dropdowns ---------------- */
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (networkDropdownRef.current && !networkDropdownRef.current.contains(event.target as Node))
                setNetworkDropdownOpen(false);
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node))
                setCategoryDropdownOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /** ---------------- Error Helper ---------------- */
    const errorsForField = (field: string): string[] => {
        if (!formState.error || typeof formState.error !== "object") return [];
        const fieldErrors = (formState.error as Record<string, string[]>)[field];
        return Array.isArray(fieldErrors) ? fieldErrors : [];
    };

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
    const removeImage = () => { setImageFile(null); setImagePreview(null); };

    /** ---------------- SEO Auto-fill ---------------- */
    const updateSEO = async (storeName: string) => {
        const { data: latestSEO } = await fetchLatestSEOAction("stores");
        if (!latestSEO) return;

        const replaceStoreName = (text: string) =>
            text.replace(/{{storeName}}|s_n/gi, storeName);

        const slugSource = latestSEO.slug || storeName;
        const processedSlug = replaceStoreName(slugSource).toLowerCase().replace(/\s+/g, "_");

        setSeo({
            metaTitle: replaceStoreName(latestSEO.metaTitle || ""),
            metaDescription: replaceStoreName(latestSEO.metaDescription || ""),
            metaKeywords: (latestSEO.metaKeywords || []).map(replaceStoreName).join(", "),
            focusKeywords: (latestSEO.focusKeywords || []).map(replaceStoreName).join(", "),
            slug: processedSlug,
        });
    };

    useEffect(() => {
        if (storeName.trim()) updateSEO(storeName.trim());
    }, [storeName]);

    /** ---------------- Form Submit ---------------- */
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
        const directUrl = formData.get("directUrl")?.toString().trim();
        if (!directUrl && !selectedNetwork) {
            toast({
                title: "Validation Error",
                description: "You must provide either a Direct URL or select a Network.",
                variant: "destructive",
            });
            return;
        }

        async function urlToFile(url: string, filename: string, mimeType: string) {
            const res = await fetch(url);
            const blob = await res.blob();
            return new File([blob], filename, { type: mimeType });
        }

        if (!imageFile && imagePreview) {
            const existingFile = await urlToFile(imagePreview, "existing.jpg", "image/jpeg");
            formData.set("imageFile", existingFile);
        } else if (imageFile) {
            formData.set("imageFile", imageFile);
        } else {
            toast({ title: "Validation Error", description: "Store image is required", variant: "destructive" });
            return;
        }

        formData.set("description", descriptionHtml);
        formData.set("content", contentHtml);
        formData.set("metaTitle", seo.metaTitle);
        formData.set("metaDescription", seo.metaDescription);
        formData.set("metaKeywords", seo.metaKeywords);
        formData.set("focusKeywords", seo.focusKeywords);
        formData.set("slug", seo.slug);
        formData.set("network", selectedNetwork?._id || "");
        formData.set("networkUrl", networkUrl);
        selectedCategories.forEach(catId => formData.append("categories", catId));

        startTransition(() => dispatch(formData));
    };

    /** ---------------- Filtered Lists ---------------- */
    const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()));
    const filteredNetworks = networks.filter(n => n.networkName.toLowerCase().includes(networkSearch.toLowerCase()));

    /** ---------------- Success / Error Handling ---------------- */
    useEffect(() => {
        if (formState.data && !formState.error) setSuccessDialogOpen(true);
        if (formState.error && "message" in formState.error) {
            toast({ title: "Error", description: (formState.error as any).message?.[0] || "Something went wrong", variant: "destructive" });
        }
    }, [formState]);

    return (
        <>
            <Card className="w-full min-h-screen shadow-lg bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
                    <CardTitle className="text-lg sm:text-xl font-semibold">Edit Store</CardTitle>
                    <Button variant="secondary" onClick={() => router.push("/admin/stores")}>Back to Stores</Button>
                </CardHeader>

                <CardContent>
                    <form id="store-form" className="space-y-6 w-full" onSubmit={handleSubmit} encType="multipart/form-data">

                        {/* Store Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Store Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                placeholder="Enter store name"
                                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                            />
                            {errorsForField("name").map((err, idx) => <p key={idx} className="text-sm text-red-500">{err}</p>)}
                        </div>

                        {/* Hidden field for existing image */}
                        {!imageFile && store?.image && (
                            <input type="hidden" name="existingImage" value={store.image} />
                        )}


                        {/* Image */}
                        <div className="space-y-2">
                            <Label htmlFor="imageFile">
                                Store Image <span className="text-red-500">*</span>
                            </Label>
                            <Input id="imageFile" name="imageFile" type="file" accept="image/*" onChange={handleImageChange} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
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
                            <Label htmlFor="directUrl">Direct URL <span className="block mt-1 text-red-500 italic text-xs">*Select either a Direct URL or a Network</span></Label>
                            <Input id="directUrl" name="directUrl" defaultValue={store?.directUrl || ""} type="url" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
                        </div>

                        {/* Network Dropdown */}
                        <div className="relative space-y-2" ref={networkDropdownRef}>
                            <Label>
                                Network <span className="block mt-1 text-red-500 italic text-xs">*Select either a Direct URL or a Network</span>
                            </Label>
                            <Input
                                placeholder="Search network..."
                                value={networkSearch}
                                onFocus={() => setNetworkDropdownOpen(true)}
                                onChange={e => setNetworkSearch(e.target.value)}
                                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                            />
                            {networkDropdownOpen && (
                                <div className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white dark:bg-gray-700 border rounded mt-1">
                                    {filteredNetworks.map(net => (
                                        <div key={net._id} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                            onClick={() => { setSelectedNetwork(net); setNetworkSearch(net.networkName); setNetworkUrl(net.storeNetworkUrl); setNetworkDropdownOpen(false); }}>
                                            {net.networkName}
                                        </div>
                                    ))}
                                    {filteredNetworks.length === 0 && <div className="px-3 py-2 text-gray-500">No networks found</div>}
                                </div>
                            )}
                        </div>

                        {/* Network URL */}
                        {selectedNetwork && (
                            <div className="space-y-2">
                                <Label htmlFor="networkUrl">Network URL</Label>
                                <Input id="networkUrl" name="networkUrl" value={networkUrl} onChange={e => setNetworkUrl(e.target.value)} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
                            </div>
                        )}

                        {/* Categories */}
                        <div className="relative space-y-2" ref={categoryDropdownRef}>
                            <Label>
                                Categories <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="Search categories..."
                                value={categorySearch}
                                onFocus={() => setCategoryDropdownOpen(true)}
                                onChange={e => setCategorySearch(e.target.value)}
                                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                            />
                            {categoryDropdownOpen && (
                                <div className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white dark:bg-gray-700 border rounded mt-1 p-2 grid grid-cols-2 gap-2">
                                    {filteredCategories.map(cat => (
                                        <label key={cat._id} className="flex items-center space-x-2 cursor-pointer">
                                            <input type="checkbox" checked={selectedCategories.includes(cat._id)}
                                                onChange={e => { if (e.target.checked) setSelectedCategories(prev => [...prev, cat._id]); else setSelectedCategories(prev => prev.filter(id => id !== cat._id)); }}
                                                className="h-4 w-4" />
                                            <span>{cat.name}</span>
                                        </label>
                                    ))}
                                    {filteredCategories.length === 0 && <div className="col-span-2 text-gray-500">No categories found</div>}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label>
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <RichTextEditor value={descriptionHtml} onChange={setDescriptionHtml} />
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <Label>
                                Content <span className="text-red-500">*</span>
                            </Label>
                            <RichTextEditor value={contentHtml} onChange={setContentHtml} height="500px" />
                        </div>


                        {/* SEO Modal Trigger */}
                        <div>
                            <Button type="button" onClick={() => setSeoModalOpen(true)}>Edit SEO Fields</Button>
                        </div>

                        {/* Popular & Active */}
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" name="isPopular" value="true" defaultChecked={store?.isPopular || false} className="w-4 h-4" />
                                <span>Popular</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" name="isActive" value="true" defaultChecked={store?.isActive || false} className="w-4 h-4" />
                                <span>Active</span>
                            </label>
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <Label htmlFor="slug">
                                Slug <span className="text-red-500">*</span>
                            </Label>
                            <Input id="slug" name="slug" value={seo.slug} onChange={e => setSeo(prev => ({ ...prev, slug: e.target.value }))} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
                        </div>

                        {/* General Errors */}
                        {Array.isArray((formState.error as any)?.message) && (formState.error as any).message.map((msg: string, idx: number) => <p key={idx} className="text-sm text-red-500">{msg}</p>)}

                        <CardFooter className="flex justify-end border-none px-0">
                            <Button type="submit" disabled={isPending} form="store-form">
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isPending ? "Updating..." : "Update Store"}
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
                        <div><Label>Meta Title</Label><Input value={seo.metaTitle} onChange={e => setSeo(prev => ({ ...prev, metaTitle: e.target.value }))} className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700" /></div>
                        <div><Label>Meta Description</Label><Textarea rows={3} value={seo.metaDescription} onChange={e => setSeo(prev => ({ ...prev, metaDescription: e.target.value }))} className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700" /></div>
                        <div><Label>Meta Keywords</Label><Input value={seo.metaKeywords} onChange={e => setSeo(prev => ({ ...prev, metaKeywords: e.target.value }))} className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700" /></div>
                        <div><Label>Focus Keywords</Label><Input value={seo.focusKeywords} onChange={e => setSeo(prev => ({ ...prev, focusKeywords: e.target.value }))} className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700" /></div>
                        <div><Label>Slug</Label><Input value={seo.slug} onChange={e => setSeo(prev => ({ ...prev, slug: e.target.value }))} className="w-full border-none shadow-sm bg-gray-50 dark:bg-gray-700" /></div>
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
                    <DialogHeader><DialogTitle>Success</DialogTitle></DialogHeader>
                    <p>Store updated successfully!</p>
                    <DialogFooter>
                        <Button onClick={() => { setSuccessDialogOpen(false); router.push("/admin/stores"); }}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
