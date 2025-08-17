import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchAllStoresAction } from "@/actions/storeActions";
import { fetchLatestSettingAction } from "@/actions/settingActions";
import type { StoreData } from "@/types/store";
import type { SettingData } from "@/types/setting";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const storesResult = await fetchAllStoresAction();
  const stores: StoreData[] = Array.isArray(storesResult?.data)
    ? storesResult.data
    : [];

  const settingResult = await fetchLatestSettingAction();
  const latestSetting: SettingData | null = settingResult?.data || null;

  const metadata: Metadata = {
    title: latestSetting?.metaTitle || "ITSCoupons",
    description:
      latestSetting?.metaDescription ||
      "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      url: "/",
      title: latestSetting?.metaTitle || "ITSCoupons",
      description:
        latestSetting?.metaDescription ||
        "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: latestSetting?.metaTitle || "ITSCoupons",
      description:
        latestSetting?.metaDescription ||
        "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        {/* Pass stores into Header */}
        <Header allStores={stores} />
        {children}
        {/* Pass latest setting into Footer */}
        <Footer latestSetting={latestSetting} />
      </body>
    </html>
  );
}
