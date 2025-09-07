// app/layout.tsx
import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ITSCoupons",
  description: "Auth root layout",
  icons: {
    icon: "/logos/ITS-Coupons-FV-Icon-2.png",
    apple: "/logos/ITS-Coupons-FV-Icon-2.png",
    shortcut: "/logos/ITS-Coupons-FV-Icon-2.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
