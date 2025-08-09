"use client";

export default function BlogPage() {
  const featured = [
    {
      category: "Shopping Tips",
      title: "Top 8 Money-Saving Tips for Smarter Shopping in 2025",
      date: "July 10, 2025",
      summary:
        "Discover expert tips to help you save more on every purchase—from using cashback apps to timing your buys just right.",
    },
    {
      category: "Black Friday",
      title: "Black Friday vs Cyber Monday: Which Offers Better Deals?",
      date: "June 20, 2025",
      summary:
        "Explore the key differences and find out when to shop for the best savings during the holiday season.",
    },
    {
      category: "Coupon Stacking",
      title: "How to Save Staggering Amounts with Coupon Stacking",
      date: "May 12, 2025",
      summary:
        "Learn how to combine offers like a pro and stack deals for maximum discounts online and in-store.",
    },
  ];

  const recent = [
    "How to Use Coupons While Still Maximizing Cashback",
    "Top 5 Browser Extensions for Auto-Applying Coupons",
    "Smart Shopping Habits to Build a Monthly Budget",
    "The Psychology of Discounts: Why We Love Coupons",
    "Tips for Staying Updated on Limited-Time Offers",
  ];

  return (
    <div className="text-gray-800">
      {/* Hero Section */}
      <section className="bg-purple-800 text-white text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">Coupon Hunt Blogs</h1>
        <p className="text-sm max-w-2xl mx-auto">
          Stay updated with expert saving strategies, shopping guides, and industry insights that help you shop smarter every day.
        </p>
      </section>

      {/* Blog Tabs (non-functional for now) */}
      <section className="py-10 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Money-Saving Insights & Tips</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm font-medium">
          {["All", "Shopping Tips", "Black Friday", "Coupon Stacking", "Grocery Savings"].map(
            (tab, i) => (
              <button
                key={i}
                className={`px-4 py-2 border rounded-full ${
                  i === 0
                    ? "bg-purple-700 text-white"
                    : "text-purple-700 border-purple-300 hover:bg-purple-100"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Featured Blogs */}
        <div className="space-y-8">
          {featured.map((item, i) => (
            <div key={i} className="border rounded-xl shadow-sm overflow-hidden">
              <div className="bg-purple-700 text-white px-6 py-4 text-lg font-bold">
                {item.category}
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.date}</p>
                <p className="text-sm text-gray-600">{item.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-10 px-4 max-w-5xl mx-auto">
        <h3 className="text-lg font-semibold mb-6">Recent Articles</h3>
        <div className="space-y-6">
          {recent.map((title, i) => (
            <div
              key={i}
              className="flex items-start border-l-4 border-purple-600 pl-4 pb-3"
            >
              <div className="text-sm">
                <p className="font-medium text-purple-700 mb-1">Category</p>
                <p className="font-semibold">{title}</p>
                <p className="text-xs text-gray-500 mt-1">Published July {10 - i}, 2025</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded">
            Load More Articles
          </button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-100 py-12 px-4 text-center">
        <h3 className="text-lg font-semibold mb-2">Stay Updated with Our Latest Deals</h3>
        <p className="text-sm text-gray-600 mb-4">
          Join our newsletter for exclusive savings, new coupons, and more.
        </p>
        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <button className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-md">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
