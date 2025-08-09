export default function Newsletter() {
  return (
    <section className="bg-white text-center py-12 px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        Join the Savings Revolution
      </h2>
      <p className="text-gray-600 max-w-xl mx-auto mb-6">
        Get exclusive access to the best deals, early notifications of sales, and personalized coupon recommendations.
      </p>

      <form className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email address"
          className="px-4 py-2 w-full sm:w-auto border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
