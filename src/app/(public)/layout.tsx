import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchLatestSettingAction } from "@/actions/settingActions";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import type { SettingData } from "@/types/setting";
import DynamicSchema from "@/components/DynamicSchema"; // ✅ Dynamic Schema Component

// ✅ Dynamically generate site metadata from database settings
export async function generateMetadata(): Promise<Metadata> {
  const settingResult = await fetchLatestSettingAction();
  const latestSetting: SettingData | null = settingResult?.data || null;

  const DOMAIN = process.env.DOMAIN || "https://www.itscoupons.com";

  const metaTitle =
    latestSetting?.metaTitle ||
    "ITS Coupons - Your Trusted Coupon & Deal Finder";
  const metaDescription =
    latestSetting?.metaDescription ||
    "ITS Coupons brings you hand-picked, verified discount codes and offers from leading brands. Enjoy safe, reliable, and updated coupons to save money on every purchase.";

  const logoUrl = latestSetting?.logo
    ? `${DOMAIN}${latestSetting.logo}`
    : `${DOMAIN}/images/og-image.jpg`;

  return {
    metadataBase: new URL(DOMAIN),
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: DOMAIN,
    },
    openGraph: {
      url: DOMAIN,
      title: metaTitle,
      description: metaDescription,
      type: "website",
      siteName: "ITS Coupons",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [logoUrl],
    },
    icons: {
      icon: "/logos/ITS-Coupons-FV-Icon-2.png",
      apple: "/logos/ITS-Coupons-FV-Icon-2.png",
      shortcut: "/logos/ITS-Coupons-FV-Icon-2.png",
    },
    manifest: "/manifest.json",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

// ✅ Main Root Layout
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Sitemap link (helps crawlers discover your URLs) */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body className={`${GeistSans.className} bg-white text-gray-900`}>
        <Header />

        {/* ✅ Inject Dynamic JSON-LD Schema Here */}
        <DynamicSchema />

        <main>{children}</main>
        <ScrollToTopButton />
        <Footer />
      </body>
    </html>
  );
}
