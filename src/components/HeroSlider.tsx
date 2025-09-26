"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { FaCheck } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";

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
  return (
    <section className="w-full">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative bg-cover bg-center text-white 
  min-h-[160px] sm:min-h-[220px] md:min-h-[280px] lg:min-h-[340px] 
  px-4 sm:px-8 md:px-16 flex items-center"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            >
              {/* dark overlay */}
              <div className="absolute inset-0 bg-black/40 z-0" />

              {/* content */}
              <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
                <div className="space-y-3 sm:space-y-4 md:space-y-5 p-4 sm:p-6 rounded-lg text-center md:text-left">
                  {index === 0 ? (
                    <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-lg">
                      {slide.title}
                    </h1>
                  ) : (
                    <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-lg">
                      {slide.title}
                    </h2>
                  )}

                  <h2 className="text-lg sm:text-xl md:text-3xl font-bold drop-shadow">
                    {slide.subtitle}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-lg text-white/90 drop-shadow-sm">
                    {slide.description}
                  </p>

                  {/* bullet points */}
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 sm:gap-3 md:gap-4 pt-1 sm:pt-2 md:pt-3 text-xs sm:text-sm md:text-base">
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
