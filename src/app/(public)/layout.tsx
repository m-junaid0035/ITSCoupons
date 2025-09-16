import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchLatestSettingAction } from "@/actions/settingActions";
import type { SettingData } from "@/types/setting";

// ✅ Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  const settingResult = await fetchLatestSettingAction();
  const latestSetting: SettingData | null = settingResult?.data || null;

  const metaTitle = latestSetting?.metaTitle || "ITS Coupons - Your Trusted Coupon & Deal Finder";
  const metaDescription =
    latestSetting?.metaDescription ||
    "ITS Coupons brings you hand-picked, verified discount codes and offers from leading brands. Enjoy safe, reliable, and updated coupons to save money on every purchase.";
  const logoUrl = latestSetting?.logo
    ? `https://itscoupons.com${latestSetting.logo}`
    : "https://itscoupons.com/images/og-image.jpg";

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: "https://itscoupons.com/",
    },
    openGraph: {
      url: "https://itscoupons.com/",
      title: metaTitle,
      description: metaDescription,
      type: "website",
      images: logoUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: logoUrl,
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={GeistSans.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
