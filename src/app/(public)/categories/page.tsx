import Categories from "@/components/categories/Categories";
import CategoriesSearch from "@/components/categories/CategoriesSearch";


export default function CategoriesPage() {
  return (
    <main className="p-0 m-0">
      <CategoriesSearch />
      <Categories/>
    </main>
  );
}
