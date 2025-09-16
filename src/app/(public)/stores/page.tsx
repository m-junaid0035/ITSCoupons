// app/stores/page.tsx
import StoreList from "@/components/StoreList";
import { fetchAllStoresAction } from "@/actions/storeActions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Stores - ITSCoupons",
  description: "Browse all stores with verified coupons and promo codes on ITSCoupons.",
  alternates: {
    canonical: `${process.env.DOMAIN}/stores`,
  },
  openGraph: {
    title: "All Stores - ITSCoupons",
    description: "Browse all stores with verified coupons and promo codes on ITSCoupons.",
    url: `${process.env.DOMAIN}/stores`,
    type: "website",
    images: [
      {
        url: `${process.env.DOMAIN}/images/og-image.png`,
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
    images: [`${process.env.DOMAIN}/images/og-image.png`],
  },
};

export default async function StorePage({ searchParams } : { searchParams: Promise<{ letter?: ""}>}) {
  const storesResult = await fetchAllStoresAction();
  const stores = storesResult?.data ?? [];
  const { letter = "" } = await searchParams;

  return <StoreList stores={stores} selectedLetter={letter} />;
}
