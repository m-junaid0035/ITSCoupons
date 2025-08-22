// app/stores/page.tsx
import StoreList from "@/components/StoreList";
import { fetchAllStoresAction } from "@/actions/storeActions";

export default async function StorePage({ searchParams } : { searchParams: Promise<{ letter?: ""}>}) {
  const storesResult = await fetchAllStoresAction();
  const stores = storesResult?.data ?? [];
  const { letter = "" } = await searchParams;

  return <StoreList stores={stores} selectedLetter={letter} />;
}
