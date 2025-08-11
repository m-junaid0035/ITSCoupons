"use client";

import { FaTelegramPlane, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-purple-800 text-white px-6 md:px-16 py-10">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        
        {/* Logo + Description + Socials (Full width on mobile by spanning 2 columns) */}
        <div className="space-y-4 col-span-2 md:col-span-1 text-center md:text-left">
          <h2 className="text-2xl font-bold">
            Its<span className="font-light">Coupons</span>
          </h2>
          <p className="max-w-sm mx-auto md:mx-0">
            Helping you save money with verified coupons and deals from your favorite stores.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="bg-purple-900 p-2 rounded"><FaTelegramPlane /></a>
            <a href="#" className="bg-purple-900 p-2 rounded"><FaFacebookF /></a>
            <a href="#" className="bg-purple-900 p-2 rounded"><FaTwitter /></a>
            <a href="#" className="bg-purple-900 p-2 rounded"><FaInstagram /></a>
          </div>
        </div>

        {/* Deals & Shop */}
        <div>
          <h4 className="font-semibold mb-2">Deals & Shop</h4>
          <ul className="space-y-1">
            <li>Promo Codes</li>
            <li>Latest Deals</li>
            <li>Exclusives</li>
            <li>Product Deals</li>
            <li>Stores</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li>Home</li>
            <li>Top Stories</li>
            <li>Categories</li>
            <li>How it Works</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Top Categories */}
        <div>
          <h4 className="font-semibold mb-2">Top Categories</h4>
          <ul className="space-y-1">
            <li>Fashion</li>
            <li>Electronics</li>
            <li>Food & Drinks</li>
            <li>Travel</li>
            <li>Beauty & Health</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-2">Contact Us</h4>
          <ul className="space-y-1">
            <li>support@itscoupons.com</li>
            <li>(+92) 3143328342</li>
            <li>123, street, Discount city,<br />50050</li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-10 text-center text-sm text-white/70">
        © {new Date().getFullYear()} ItsCoupons. All rights reserved.
      </div>
    </footer>
  );
}
