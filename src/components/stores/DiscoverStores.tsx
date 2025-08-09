// components/DiscoverStores.js

export default function DiscoverStores() {
  return (
    <section className="bg-purple-800 text-white py-20 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Discover Amazing Stores
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Save with Every Purchase
      </h2>

      <p className="max-w-2xl mx-auto text-base md:text-lg mb-8">
        Browse through thousands of verified stores and discover exclusive deals, coupons, and discounts from your favorite brands. Start saving money today!
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-3 max-w-xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search for stores, brands, or categories..."
          className=" bg-white w-full md:w-[400px] px-4 py-3 rounded-md text-black placeholder-gray-500 focus:outline-none"
        />
        <button className="bg-white text-[#9400A5] font-semibold px-5 py-3 rounded-md border border-white hover:bg-purple-100 transition">
          Search Stores
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-sm font-medium mt-4">
        <span>✔️ Verified Stores</span>
        <span>✔️ 1000+ Stores</span>
        <span>✔️ Daily Updates</span>
      </div>
    </section>
  );
}
