import { fetchAllStoresAction, fetchStoresByNetworkAction, fetchCouponCountByStoreIdAction } from "@/actions/storeActions";
import { fetchAllNetworksAction } from "@/actions/networkActions";
import StoresPageClient from "./StoresPageClient";
import { IStore } from "@/components/views/StoreModel";

interface INetwork {
  _id: string;
  name: string;
}

export default async function StoresPage({
  searchParams,
}: {
  searchParams: Promise<{ networkId?: string }>;
}) {
  const { networkId = "" } = await searchParams;

  // Fetch stores (all or by network)
  let storesResult;
  if (networkId) {
    storesResult = await fetchStoresByNetworkAction(networkId);
  } else {
    storesResult = await fetchAllStoresAction();
  }

  // Fetch networks
  const networksResult = await fetchAllNetworksAction();

  let stores: IStore[] = [];
  let networks: INetwork[] = [];

  if (storesResult?.data && Array.isArray(storesResult.data)) {
    stores = await Promise.all(
      storesResult.data.map(async (store: IStore) => {
        const countRes = await fetchCouponCountByStoreIdAction(store._id);
        return {
          ...store,
          totalCoupons: countRes?.data ?? 0,
        };
      })
    );
  }

  if (networksResult?.data && Array.isArray(networksResult.data)) {
    networks = networksResult.data.map((n) => ({
      _id: n._id,
      name: n.networkName,
    }));
  }

  return <StoresPageClient initialStores={stores} initialNetworks={networks} />;
}
