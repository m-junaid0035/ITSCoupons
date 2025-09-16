import { fetchStaticPageBySlugAction } from "@/actions/staticPagesActions";
import StaticPageView from "@/components/genericPage"; // move client compo to components
import { Metadata } from "next";
import { StaticPageData } from "@/types/staticPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const res = await fetchStaticPageBySlugAction(slug);
  const page: StaticPageData | null = res?.data ?? null;

  if (!page) {
    return {
      title: "Page Not Found - ITSCoupons",
      description: "The page you are looking for does not exist.",
    };
  }

  const metaTitle = page.title;
  const metaDescription =
    page.content?.slice(0, 160).replace(/<[^>]+>/g, "") ||
    `${page.title} - Read more at ITSCoupons`;
  const metaKeywords = page.title;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: {
      canonical: `https://itscoupons.com/${page.slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `https://itscoupons.com/${page.slug}`,
      type: "article",
      images: [
        {
          url: "https://itscoupons.com/images/og-image.png",
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: ["https://itscoupons.com/images/og-image.png"],
    },
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ slug?: "" }> }) {
    // Fetch coupons and categories in parallel
    const { slug = "" } = await searchParams;
    const res = await fetchStaticPageBySlugAction(slug);

    if (res.error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {res.error.message?.[0] || "Page not found"}
            </div>
        );
    }

    return <StaticPageView page={res.data} />;
}
