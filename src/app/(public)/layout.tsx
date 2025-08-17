import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchAllStoresAction } from "@/actions/storeActions";
import type { StoreData } from "@/types/store";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "ITSCoupons",
  description:
    "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: "shadcn/ui sidebar",
    description:
      "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "shadcn/ui sidebar",
    description:
      "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ✅ Fetch stores on the server
  const result = await fetchAllStoresAction();
  const stores: StoreData[] = Array.isArray(result?.data) ? result.data : [];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        {/* ✅ Pass stores into Header */}
        <Header allStores={stores} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
