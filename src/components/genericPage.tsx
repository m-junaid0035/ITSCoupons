"use client";

interface StaticPage {
  title: string;
  content: string;
  slug: string;
  isPublished: boolean;
}

export default function StaticPageView({ page }: { page: StaticPage }) {
  return (
    <div className=" text-gray-800">
      {/* Hero Section */}
      <section className="bg-purple-800 text-white py-16 px-4 sm:px-6 lg:px-20 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
        <p className="max-w-3xl mx-auto text-base sm:text-lg mb-10">
          Empowering millions of shoppers to save money every day with verified coupons and exclusive deals across thousands of retailers.
        </p>
        <div className="flex flex-wrap justify-center gap-8 text-white/90 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-bold">10M+</div>
            <p className="text-sm sm:text-base">Active Visitors</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold">143K+</div>
            <p className="text-sm sm:text-base">Coupons Verified</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold">$293M</div>
            <p className="text-sm sm:text-base">Money Saved</p>
          </div>
        </div>
      </section>

      <div className="max-w-[1090px] mx-auto mt-10 mb-10 px-4 sm:px-6 md:px-8 py-8 bg-white rounded-lg shadow-md text-gray-800">
        <div
          className="prose text-gray-800"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}
