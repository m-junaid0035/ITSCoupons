import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchAllStoresAction } from "@/actions/storeActions";
import { fetchLatestSettingAction } from "@/actions/settingActions";
import { fetchLatestStaticPageTitlesAndSlugsAction } from "@/actions/staticPagesActions";
import type { StoreData } from "@/types/store";
import type { SettingData } from "@/types/setting";

// ✅ Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  const settingResult = await fetchLatestSettingAction();
  const latestSetting: SettingData | null = settingResult?.data || null;

  return {
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
    icons: {
      icon: "/logos/ITS-Coupons-FV-Icon-2.png",
      apple: "/logos/ITS-Coupons-FV-Icon-2.png",
      shortcut: "/logos/ITS-Coupons-FV-Icon-2.png",
    },
  };
}

// ✅ Single RootLayout
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

  const pagesResult = await fetchLatestStaticPageTitlesAndSlugsAction();
  const aboutPages: { title: string; slug: string }[] = Array.isArray(
    pagesResult?.data
  )
    ? pagesResult.data
    : [];

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={GeistSans.className}>
        <Header allStores={stores} />
        {children}
        <Footer latestSetting={latestSetting} aboutPages={aboutPages} />
      </body>
    </html>
  );
}
