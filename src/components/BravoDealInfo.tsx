"use client";

import React from "react";

const BravoDealInfo: React.FC = () => {
  const brands: string[] = [
    "Piccalio",
    "JTV",
    "Ecater",
    "Pepper",
    "Bambu Lab",
    "Build With Ferguson",
    "Valvoline Instant Oil Change"
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 md:px-6 py-8 bg-white rounded-lg shadow-md text-gray-800">
      <section className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-800">
          More Than Just Coupons at ItsCoupons: Real Savings, Verified Deals
        </h2>
        <p className="text-base leading-relaxed">
          ItsCoupons.com is an online platform for deal seekers and shoppers who are looking to save as much as they can on their online purchases. ItsCoupons provides customers in the United States with thousands of free coupons, promo codes, discounts, deals, and tips that are checked and verified manually by our team.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold border-l-4 border-blue-400 pl-2 mb-2">
          How Can You Redeem Our Coupons & Offers
        </h3>
        <p className="text-base leading-relaxed">
          ItsCoupons gives you the greatest online discounts and top deals available on electronic devices, clothing, shoes, bags, beauty products, books, and so much more.
          You can find fabulous deals on gifts all year round, or if you are unsure of what to get, you can buy gift cards.

          <br /><br />

          Like many coupon sites, our deals and coupons are available to users at no extra cost! We source and verify the best discount codes, ensuring everyone can access legitimate offers.
          If you're wondering how ItsCoupons guarantees authentic savings, check out our blog{" "}
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
            Is ItsCoupons Legit
          </a>.

          <br /><br />

          It's as easy as one click to access your savings. Once you select your promo code, you’ll be redirected to the brand’s official store. Paste your code at checkout and enjoy the discount instantly.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold border-l-4 border-blue-400 pl-2 mb-2">
          How Do We Work
        </h3>
        <p className="text-base leading-relaxed">
          The coupons on our site are hand-picked and tested by our savings team. Every day, our dedicated team updates the site to ensure everything works smoothly.

          <br /><br />

          We also offer exclusive coupon codes and special offers thanks to partnerships with your favorite brands. ItsCoupons works through an affiliate model, earning a small commission when a coupon is successfully redeemed — at no cost to you!

          <br /><br />

          Learn more about our process in{" "}
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
            How We Make Money
          </a>.
        </p>
      </section>

      <section>
        <h4 className="font-semibold text-base mb-3 underline">Top Brands to Check Out:</h4>
        <ul className="list-disc list-inside space-y-1 text-base">
          {brands.map((brand) => (
            <li key={brand}>
              <a href="#" className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                {brand}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default BravoDealInfo;
