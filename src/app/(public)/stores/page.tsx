// app/stores/page.tsx
import StoreList from "@/components/StoreList";
import { fetchAllStoresAction } from "@/actions/storeActions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Stores - ITSCoupons",
  description: "Browse all stores with verified coupons and promo codes on ITSCoupons.",
  alternates: {
    canonical: "https://itscoupons.com/stores",
  },
  openGraph: {
    title: "All Stores - ITSCoupons",
    description: "Browse all stores with verified coupons and promo codes on ITSCoupons.",
    url: "https://itscoupons.com/stores",
    type: "website",
    images: [
      {
        url: "https://itscoupons.com/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "ITSCoupons All Stores",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Stores - ITSCoupons",
    description: "Browse all stores with verified coupons and promo codes on ITSCoupons.",
    images: ["https://itscoupons.com/images/og-image.png"],
  },
};

export default async function StorePage({ searchParams } : { searchParams: Promise<{ letter?: ""}>}) {
  const storesResult = await fetchAllStoresAction();
  const stores = storesResult?.data ?? [];
  const { letter = "" } = await searchParams;

  return <StoreList stores={stores} selectedLetter={letter} />;
}
