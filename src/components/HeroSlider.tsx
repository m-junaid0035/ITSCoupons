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
    bgImage: "/images/img1.jpg",
  },
  {
    title: "Unlock Exclusive Savings",
    subtitle: "With Verified Codes",
    description:
      "Thousands of deals updated daily. Save big on every purchase with trusted and tested coupons.",
    bgImage: "/images/img1.jpg",
  },
  {
    title: "Shop Smart With ItsCoupons",
    subtitle: "Your Daily Discount Destination",
    description:
      "From fashion to electronics — find the best promo codes for what you love.",
    bgImage: "/images/img1.jpg",
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
              className="relative bg-cover bg-center text-white py-20 px-6 md:px-16"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            >
              <div className="absolute inset-0 bg-black/40 z-0" />
              <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                <div className="space-y-6 p-6 rounded-lg">
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <h2 className="text-3xl md:text-4xl font-bold drop-shadow">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg text-white/90 drop-shadow-sm">
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 pt-4 text-sm md:text-base">
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-400" />
                      Verified Coupons
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-400" />
                      1000+ Stores
                    </div>
                    <div className="flex items-center gap-2">
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
