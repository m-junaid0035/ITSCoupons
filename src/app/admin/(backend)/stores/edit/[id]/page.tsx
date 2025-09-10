// app/admin/stores/[id]/page.tsx  (Server Component)

import EditStoreForm from "./EditStoreForm";
import { fetchStoreByIdAction } from "@/actions/storeActions";
import { fetchAllCategoriesAction } from "@/actions/categoryActions";
import { fetchAllNetworksAction, fetchNetworkByIdAction } from "@/actions/networkActions";

export default async function EditStorePage({ params }: { params: Promise<{ id: "" }>; }) {
  const { id = "" } = await params;

  // Fetch store, categories, networks
  const [storeRes, catRes, netRes] = await Promise.all([
    fetchStoreByIdAction(id),
    fetchAllCategoriesAction(),
    fetchAllNetworksAction(),
  ]);

  let storeData = storeRes?.data || null;
  let networkData = null;

  if (storeData?.network) {
    const netRes = await fetchNetworkByIdAction(storeData.network);
    networkData = netRes?.data || null;
  }

  return (
    <EditStoreForm
      storeId={id}
      storeData={storeData}
      categoriesData={catRes?.data || []}
      networksData={netRes?.data || []}
      selectedNetworkData={networkData}
    />
  );
}
