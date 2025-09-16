// types/staticPage.ts
export interface StaticPageData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}
