"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { StoreData } from "@/types/store";

interface FeaturedStoresProps {
  stores: StoreData[];
  loading?: boolean;
}

export default function FeaturedStores({ stores, loading = false }: FeaturedStoresProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-white text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-10">
            Featured Stores
          </h2>
          <p className="text-gray-500">Loading stores...</p>
        </div>
      </section>
    );
  }

  if (!stores.length) {
    return (
      <section className="py-16 bg-white text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-10">
            Featured Stores
          </h2>
          <p className="text-gray-500">No featured stores available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white text-center relative">
      <div className="max-w-6xl mx-auto px-4 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-10">
          Featured Stores
        </h2>

        {/* Mobile Top Bar (arrows + view all) */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="bg-white shadow-md rounded-full p-2 hover:bg-purple-50 focus:outline-none"
            >
              <ChevronLeft className="w-5 h-5 text-purple-700" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="bg-white shadow-md rounded-full p-2 hover:bg-purple-50 focus:outline-none"
            >
              <ChevronRight className="w-5 h-5 text-purple-700" />
            </button>
          </div>
          <Link href="/stores" className="text-sm sm:text-base text-purple-700 hover:underline">
            VIEW ALL
          </Link>
        </div>

        {/* Desktop VIEW ALL */}
        <div className="flex justify-end mb-4 hidden md:flex">
          <Link href="/stores" className="text-sm sm:text-base text-purple-700 hover:underline">
            VIEW ALL
          </Link>
        </div>

        <div className="relative">
          {/* Desktop Arrows */}
          <div className="absolute inset-y-0 -left-6 hidden md:flex items-center z-10">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="bg-white shadow-md rounded-full p-3 hover:bg-purple-50 focus:outline-none"
            >
              <ChevronLeft className="w-6 h-6 text-purple-700" />
            </button>
          </div>

          <div className="absolute inset-y-0 -right-6 hidden md:flex items-center z-10">
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="bg-white shadow-md rounded-full p-3 hover:bg-purple-50 focus:outline-none"
            >
              <ChevronRight className="w-6 h-6 text-purple-700" />
            </button>
          </div>

          {/* Slider container */}
          <div
            ref={scrollRef}
            className="overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
          >
            <div className="flex gap-8 snap-start">
              {Array.from({
                length: Math.ceil(stores.length / 10),
              }).map((_, slideIndex) => {
                const slideStores = stores.slice(
                  slideIndex * 10,
                  slideIndex * 10 + 10
                );
                return (
                  <div
                    key={slideIndex}
                    className="
                      grid 
                      grid-rows-2 
                      grid-cols-2
                      sm:grid-cols-3
                      md:grid-cols-5 
                      gap-6 sm:gap-8 
                      justify-items-center 
                      flex-shrink-0 
                      snap-start
                    "
                    style={{ minWidth: "100%" }}
                  >
                    {slideStores.map((store, index) => (
                      <Link
                        key={store._id}
                        href={`/stores/${store.slug}`}
                        className="flex items-center justify-center bg-white overflow-hidden transition"
                        style={{
                          width: "140px",
                          height: "140px",
                          borderRadius: "100px",
                          border: "1px solid #C4C4C4",
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center rounded-full overflow-hidden">
                          <Image
                            src={`https://itscoupons.com${store.image}` || "/placeholder-store.png"}
                            alt={store.name}
                            width={140}
                            height={140}
                            priority={index < 5}
                            loading={index < 5 ? "eager" : "lazy"}
                            className="object-contain p-5 transition-transform duration-300 hover:scale-110"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/stores"
            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-8 py-3 rounded-lg text-sm md:text-base inline-block"
          >
            View All Stores
          </Link>
        </div>
      </div>
    </section>
  );
}
