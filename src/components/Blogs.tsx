"use client";

import { useState, useMemo, useEffect, startTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useActionState } from "react";
import { createSubscriberAction } from "@/actions/subscriberActions";
import { BlogListResponse } from "@/types/blog";

interface FieldErrors {
  [key: string]: string[];
}

interface BlogPageProps {
  blogs: BlogListResponse;
  categories: string[];
}

export default function BlogPage({ blogs, categories }: BlogPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [recentVisible, setRecentVisible] = useState(3);

  const [email, setEmail] = useState("");
  const [formState, dispatch, isPending] = useActionState(createSubscriberAction, {});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  useEffect(() => {
    if (formState.data && !formState.error) {
      setDialogMessage("You have been successfully subscribed!");
      setDialogOpen(true);
      setEmail("");
    }

    if (formState.error && "message" in formState.error) {
      setDialogMessage((formState.error as any).message?.[0] || "Something went wrong!");
      setDialogOpen(true);
    }
  }, [formState]);

  const filteredBlogs = useMemo(() => {
    const filtered = activeCategory === "All" ? blogs : blogs.filter((b) => b.category === activeCategory);
    return filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [activeCategory, blogs]);

  const featured = filteredBlogs.slice(0, 3);
  const recent = filteredBlogs.slice(0, recentVisible);

  return (
    <div className="text-gray-800">
      {/* Hero Section */}
      <section className="bg-purple-800 text-white text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">Coupon Hunt Blogs</h1>
        <p className="text-sm sm:text-base max-w-2xl mx-auto">
          Stay updated with expert saving strategies, shopping guides, and industry insights that help you shop smarter every day.
        </p>
      </section>

      {/* Blog Tabs */}
      <section className="py-10 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Money-Saving Insights & Tips</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm sm:text-base font-medium">
          {["All", ...categories].map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(tab)}
              aria-pressed={activeCategory === tab}
              className={`px-4 py-2 border rounded-full transition ${activeCategory === tab
                ? "bg-purple-700 text-white"
                : "text-purple-700 border-purple-300 hover:bg-purple-100"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Featured Blogs */}
        <div className="space-y-8">
          {featured.map((blog) => (
            <div key={blog._id} className="border rounded-xl shadow-sm overflow-hidden">
              {blog.image && (
                <div className="relative w-full h-32 sm:h-40">
                  <Image
                    src={`https://itscoupons.com/${blog.image}`}
                    alt={blog.title}
                    title={blog.title}       // ✅ added title
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                    loading="lazy"          // ✅ added loading
                  />
                </div>
              )}
              <div className="bg-purple-700 text-white px-6 py-4 text-lg font-bold">
                {blog.category || "Uncategorized"}
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold">{blog.title}</h3>
                {blog.createdAt && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    {new Date(blog.createdAt).toISOString().split("T")[0]}
                  </p>
                )}
                {blog.description && (
                  <div
                    className="prose prose-purple text-sm sm:text-base text-gray-600 max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.description }}
                  />
                )}

                <Link
                  href={`/blogs/${blog.slug}`}
                  className="text-purple-700 font-medium hover:underline"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Blogs */}
      <section className="py-10 px-4 max-w-5xl mx-auto">
        <h3 className="text-lg sm:text-xl font-semibold mb-6">Recent Blogs</h3>
        <div className="flex flex-col gap-6">
          {recent.map((blog) => (
            <Link key={blog._id} href={`/blogs/${blog.slug}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center border-l-4 border-purple-600 pl-4 pb-4 hover:bg-gray-50 transition rounded-md cursor-pointer gap-3">
                {blog.image && (
                  <div className="relative w-full sm:w-32 h-24 flex-shrink-0">
                    <Image
                      src={`https://itscoupons.com/${blog.image}`}
                      alt={blog.title}
                      title={blog.title}        // ✅ added title
                      fill
                      sizes="(max-width: 640px) 100vw, 200px"
                      className="object-cover rounded-md"
                      loading="lazy"            // ✅ added loading
                    />
                  </div>
                )}

                <div className="text-sm sm:text-base flex-1">
                  <p className="font-medium text-purple-700 mb-1">
                    {blog.category || "Uncategorized"}
                  </p>
                  <p className="font-semibold">{blog.title}</p>
                  {blog.createdAt && (
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(blog.createdAt).toISOString().split("T")[0]}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {recentVisible < filteredBlogs.length && (
          <div className="mt-8 text-center">
            <Button
              onClick={() => setRecentVisible((prev) => prev + 3)}
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded"
            >
              Load More Blogs
            </Button>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-white text-center py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Join the Savings Revolution</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Get exclusive access to the best deals, early notifications of sales, and personalized coupon recommendations.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.set("email", email);
            startTransition(() => {
              dispatch(formData);
            });
          }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 w-full sm:w-auto border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button
            type="submit"
            className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition shadow-sm w-full sm:w-auto"
            disabled={isPending}
          >
            {isPending ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>

        {errorFor("email") && <p className="text-red-500 mt-2">{errorFor("email")}</p>}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md mx-4 sm:mx-auto animate-fade-in">
            <DialogHeader className="relative">
              <DialogTitle className="text-lg sm:text-xl">Subscription Status</DialogTitle>
            </DialogHeader>
            <p className="py-2 text-sm sm:text-base">{dialogMessage}</p>
            <DialogFooter>
              <Button
                className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition shadow-sm"
                onClick={() => setDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
