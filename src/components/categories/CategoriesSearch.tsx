// components/CategoriesSearch.js

export default function CategoriesSearch() {
  return (
    <section className="bg-purple-800 text-white py-20 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Browse by Categories
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Discover Amazing Deals and Exclusive Coupons Organized by Your Favorite Shopping Categories
      </h2>

      <p className="max-w-2xl mx-auto text-base md:text-lg mb-8">
        Browse through thousands of verified categories and find the best discounts, promo codes, and deals tailored for each type of product or service.
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-3 max-w-xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search for electronics, fashion, food, etc..."
          className="bg-white w-full md:w-[400px] px-4 h-12 rounded-md text-black placeholder-gray-500 focus:outline-none"
        />
        <button className="bg-white text-[#9400A5] font-semibold px-5 h-12 rounded-md border border-white hover:bg-purple-100 transition">
          Search 
        </button>
      </div>
    </section>
  );
}
