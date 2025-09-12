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
      images: latestSetting?.logo || "https://www.itscoupons.com/images/og-image.jpg",
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
