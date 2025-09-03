"use client";

interface StaticPage {
  title: string;
  content: string;
  slug: string;
  isPublished: boolean;
}

export default function StaticPageView({ page }: { page: StaticPage }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-800">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        {page.title}
      </h1>

      {/* Content (CKEditor HTML) */}
      <div
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}
