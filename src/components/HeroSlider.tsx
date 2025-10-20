"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { EventWithStore } from "@/types/event";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface HeroSliderProps {
  events: EventWithStore[];
}

export default function HeroSlider({ events }: HeroSliderProps) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const swiperRef = useRef<any>(null);

  if (!events || events.length === 0) return null;

  const getFullImageUrl = (path?: string) => {
    if (!path) return "/images/default-banner.webp";
    if (path.startsWith("http")) return path;
    return `https://www.itscoupons.com${path.startsWith("/") ? path : `/${path}`}`;
  };

  // ✅ Ensure Swiper navigation updates once refs are ready
  useEffect(() => {
    if (
      swiperRef.current &&
      prevRef.current &&
      nextRef.current &&
      swiperRef.current.params
    ) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <section className="relative w-full max-w-[1400px] mx-auto mt-4 md:mt-8 px-3 md:px-6 lg:px-8 group">
      <h1 className="text-2xl font-bold sr-only">
        Best Coupons, Promo Codes & Deals - ITS Coupons
      </h1>

      {/* ← Prev Button */}
      <div className="absolute inset-y-0 left-3 z-10 hidden md:flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          ref={prevRef}
          aria-label="Previous Slide"
          className="bg-white shadow-md rounded-full p-2 hover:bg-gray-100 focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6 text-purple-700" />
        </button>
      </div>

      {/* → Next Button */}
      <div className="absolute inset-y-0 right-3 z-10 hidden md:flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          ref={nextRef}
          aria-label="Next Slide"
          className="bg-white shadow-md rounded-full p-2 hover:bg-gray-100 focus:outline-none"
        >
          <ChevronRight className="w-6 h-6 text-purple-700" />
        </button>
      </div>

      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="w-full rounded-2xl overflow-hidden"
      >
        {events.map((event) => (
          <SwiperSlide key={event._id}>
            <div className="relative bg-white overflow-hidden rounded-2xl shadow-md flex flex-col md:grid md:grid-cols-2 h-auto md:h-[340px] lg:h-[400px]">
              {/* Image Section */}
              <div className="relative h-[200px] sm:h-[240px] md:h-auto flex items-center justify-center bg-gray-100">
                <Image
                  src={getFullImageUrl(event.image)}
                  alt={event.title}
                  width={800}
                  height={400}
                  priority
                  className="w-full h-full object-cover rounded-t-2xl md:rounded-none"
                />

                {/* Store Logo */}
                {event.store && event.store.image && (
                  <div
                    className="
                      absolute 
                      bottom-3 left-1/2 -translate-x-1/2 
                      md:left-4 md:translate-x-0 
                      bg-white rounded-full p-2 shadow-lg 
                      flex items-center justify-center
                    "
                    style={{ width: "70px", height: "70px", borderRadius: "50%" }}
                  >
                    <Image
                      src={getFullImageUrl(event.store.image)}
                      alt={event.store.name}
                      width={60}
                      height={60}
                      className="rounded-full object-contain p-2"
                    />
                  </div>
                )}
              </div>

              {/* Text Section */}
              <div className="relative flex flex-col justify-center px-4 py-4 md:px-10 bg-black text-white">
                <div className="max-w-lg">
                  <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold mb-2 line-clamp-2">
                    {event.title}
                  </h2>

                  {event.description && (
                    <p
                      suppressHydrationWarning
                      className="text-sm sm:text-base lg:text-lg text-gray-200 mb-3 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: event.description || "" }}
                    />
                  )}

                  {event.store && (
                    <Link
                      href={`/stores/${event.store.slug}`}
                      className="inline-block bg-white text-black font-semibold px-4 py-2 rounded-md text-sm sm:text-base hover:bg-gray-100 transition"
                    >
                      {`Shop ${event.store.name}`}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
