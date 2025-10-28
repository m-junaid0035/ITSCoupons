"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { fetchLatestSettingAction } from "@/actions/settingActions";
import type { SettingData } from "@/types/setting";

export default function DynamicSchema() {
  const [schemaData, setSchemaData] = useState<any[]>([]);

  useEffect(() => {
    async function generateSchema() {
      try {
        const result = await fetchLatestSettingAction();
        const setting: SettingData | null = result?.data || null;

        const DOMAIN =
          process.env.NEXT_PUBLIC_DOMAIN || "https://www.itscoupons.com";

        const logoUrl = setting?.logo
          ? `${DOMAIN}${setting.logo}`
          : `${DOMAIN}/logos/ITS-Coupons-FV-Icon-2.png`;

        // ✅ Organization Schema
        const organizationSchema = {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: setting?.siteName || "ITS Coupons",
          url: DOMAIN,
          logo: logoUrl,
          sameAs: [
            setting?.facebookUrl,
            setting?.instagramUrl,
            setting?.linkedinUrl,
            setting?.XUrl,
            setting?.yahooUrl,
          ].filter(Boolean), // removes undefined links
          description:
            setting?.metaDescription ||
            "ITS Coupons provides verified coupon codes, promo offers, and discount deals for top stores worldwide.",
        };

        // ✅ Website Schema
        const websiteSchema = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          url: DOMAIN,
          name: setting?.siteName || "ITS Coupons",
          potentialAction: {
            "@type": "SearchAction",
            target: `${DOMAIN}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        };

        setSchemaData([organizationSchema, websiteSchema]);
      } catch (error) {
        console.error("Error generating schema:", error);
      }
    }

    generateSchema();
  }, []);

  // Don’t render until schema is ready
  if (schemaData.length === 0) return null;

  return (
    <Script
      id="dynamic-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
