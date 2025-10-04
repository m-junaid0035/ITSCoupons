"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaCheck } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    title: "Find the Best Deals & Coupons",
    subtitle: "Save Money Every Day",
    description:
      "Discover verified coupons and exclusive deals from thousands of top brands. Start saving today with our curated collection of money-saving offers.",
    bgImage: "/images/img.webp",
  },
  {
    title: "Exclusive Brand Partnerships",
    subtitle: "Premium Savings Await",
    description:
      "Access exclusive discounts from premium brands and retailers. Get early access to sales and limited-time offers that you won't find anywhere else.",
    bgImage: "/images/img.webp",
  },
  {
    title: "Cashback Rewards Program",
    subtitle: "Earn While You Save",
    description:
      "Join our cashback program and earn money back on every purchase. Stack cashback with coupons for maximum savings on all your favorite stores.",
    bgImage: "/images/img.webp",
  },
];

export default function HeroSlider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section
      className="w-full relative max-w-[1400px] mx-auto px-3 md:px-6 lg:px-8 mt-3 md:mt-6 lg:mt-8
      group" // 👈 group added for hover effect
    >
      {/* Desktop arrows (appear on hover) */}
      <div className="absolute inset-y-0 left-3 z-10 hidden md:flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          ref={prevRef}
          className="bg-white/80 backdrop-blur-md shadow-md rounded-full p-2 hover:bg-white focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6 text-purple-700" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-3 z-10 hidden md:flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          ref={nextRef}
          className="bg-white/80 backdrop-blur-md shadow-md rounded-full p-2 hover:bg-white focus:outline-none"
        >
          <ChevronRight className="w-6 h-6 text-purple-700" />
        </button>
      </div>

      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true} // ✅ ensures looping
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        className="w-full rounded-2xl overflow-hidden"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative bg-cover bg-center text-white 
                h-[160px] sm:h-[210px] md:h-[270px] lg:h-[340px] xl:h-[400px]
                flex items-center rounded-2xl overflow-hidden"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40 z-0" />

              {/* Content */}
              <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-8 lg:px-12">
                <div className="space-y-3 sm:space-y-4 lg:space-y-6 text-center md:text-left">
                  {index === 0 ? (
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-extrabold leading-tight drop-shadow-lg">
                      {slide.title}
                    </h1>
                  ) : (
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-extrabold leading-tight drop-shadow-lg">
                      {slide.title}
                    </h2>
                  )}

                  <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold drop-shadow">
                    {slide.subtitle}
                  </h3>

                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 max-w-xl mx-auto md:mx-0 drop-shadow-sm">
                    {slide.description}
                  </p>

                  {/* Bullet points */}
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 pt-2 text-xs sm:text-sm md:text-base lg:text-lg">
                    <div className="flex items-center gap-1.5">
                      <FaCheck className="text-green-400" />
                      Verified Coupons
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaCheck className="text-green-400" />
                      1000+ Stores
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaCheck className="text-green-400" />
                      Daily Updates
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
