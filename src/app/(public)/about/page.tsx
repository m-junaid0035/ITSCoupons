import { fetchStaticPageBySlugAction } from "@/actions/staticPagesActions";
import StaticPageView from "@/components/genericPage"; // move client compo to components

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
