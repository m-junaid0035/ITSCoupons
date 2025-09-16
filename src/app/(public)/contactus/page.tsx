// In app/contact/page.tsx
import { fetchLatestSettingAction } from "@/actions/settingActions";
import ContactSection from "@/components/ContactSection";
import { SettingData } from "@/types/setting";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Contact Us - ITSCoupons",
  description:
    "Need help or have questions? Contact ITSCoupons for support, business inquiries, or partnership opportunities. We're here to help you save more.",
  alternates: {
    canonical: `${process.env.DOMAIN}/contactus`,
  },
  openGraph: {
    title: "Contact Us - ITSCoupons",
    description:
      "Reach out to ITSCoupons for support, collaborations, or general inquiries. We’re happy to assist you.",
    url: `${process.env.DOMAIN}/contactus`,
    type: "website",
    images: [
      {
        url: `${process.env.DOMAIN}/images/og-image.png`, // ✅ replace if you want separate image
        width: 1200,
        height: 630,
        alt: "Contact ITSCoupons",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - ITSCoupons",
    description:
      "Need help or have questions? Contact ITSCoupons for support, business inquiries, or partnership opportunities.",
    images: [`${process.env.DOMAIN}/images/og-image.png`],
  },
};

export default async function ContactPage() {
  const settingResult = await fetchLatestSettingAction();
  const latestSetting: SettingData | null = settingResult?.data || null;

  return <ContactSection latestSetting={latestSetting} />;
}
