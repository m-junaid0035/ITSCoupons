// app/admin/networks/page.tsx
import NetworksPageClient from "./NetworksPageClient";
import {
  fetchAllNetworksAction,
  fetchStoreCountByNetworkIdAction,
} from "@/actions/networkActions";

export default async function NetworksPage() {
  // Fetch all networks + store counts on the server
  const networksResult = await fetchAllNetworksAction();
  let networks: {
    _id: string;
    networkName: string;
    totalStores?: number;
  }[] = [];

  if (networksResult?.data && Array.isArray(networksResult.data)) {
    networks = await Promise.all(
      networksResult.data.map(async (network: any) => {
        const countRes = await fetchStoreCountByNetworkIdAction(network._id);
        return { ...network, totalStores: countRes?.data ?? 0 };
      })
    );
  }

  return <NetworksPageClient initialNetworks={networks} />;
}
