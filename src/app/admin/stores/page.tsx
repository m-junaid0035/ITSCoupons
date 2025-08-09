"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  fetchAllStoresAction,
  deleteStoreAction,
} from "@/actions/storeActions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IStore {
  _id: string;
  name: string;
  storeNetworkUrl: string;
  categories: string[];
  image: string;
  slug: string;
  isPopular?: boolean; // ✅ NEW
  isActive?: boolean;  // ✅ NEW
}

export default function StoresPage() {
  const router = useRouter();
  const [stores, setStores] = useState<IStore[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStores = async () => {
    setLoading(true);
    const result = await fetchAllStoresAction();

    if (result.data && Array.isArray(result.data)) {
      setStores(result.data as IStore[]);
    } else {
      console.error("Failed to fetch stores", result.error);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this store?")) return;
    setLoading(true);

    const result = await deleteStoreAction(id);

    if (result.error) {
      alert(result.error.message?.[0] || "Failed to delete store");
    } else {
      await loadStores();
    }

    setLoading(false);
  };

  useEffect(() => {
    loadStores();
  }, []); // Empty dependency array to run on component mount

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Stores</CardTitle>
        <Button onClick={() => router.push("/admin/stores/new")}>Create Store</Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Store Network URL</th>
                <th className="p-2 text-left">Categories</th>
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Slug</th>
                <th className="p-2 text-left">Popular</th> {/* ✅ NEW */}
                <th className="p-2 text-left">Active</th>  {/* ✅ NEW */}
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.length > 0 ? (
                stores.map((store) => (
                  <tr key={store._id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{store.name}</td>
                    <td className="p-2">{store.storeNetworkUrl}</td>
                    <td className="p-2">
                      {store.categories.length > 0
                        ? store.categories.join(", ")
                        : "-"}
                    </td>
                    <td className="p-2">
                      <img
                        src={store.image}
                        alt={store.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    </td>
                    <td className="p-2">{store.slug}</td>
                    <td className="p-2">{store.isPopular ? "✅" : "❌"}</td> {/* ✅ NEW */}
                    <td className="p-2">{store.isActive ? "✅" : "❌"}</td>   {/* ✅ NEW */}
                    <td className="p-2 space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => router.push(`/admin/stores/view/${store._id}`)}
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => router.push(`/admin/stores/edit/${store._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(store._id)}
                        disabled={loading} // Disable delete button during loading
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-muted-foreground">
                    No stores found.
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
