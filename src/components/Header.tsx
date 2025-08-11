"use client";

import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";

export default function Header() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  return (
    <header className="w-full">
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-purple-800 text-white text-base text-center py-3 relative px-6 md:px-16">
          🎉 Get the latest coupon updates daily – Save more, spend less!
          <button
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-xl hover:text-gray-300"
            aria-label="Close announcement"
          >
            <IoMdClose />
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white shadow-sm px-6 md:px-16 py-6 flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <div className="text-3xl font-bold text-purple-800">
          ITS<span className="font-light text-black">Coupons</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-6 mt-4 md:mt-0 text-base font-medium text-gray-700">
          <a href="/" className="hover:text-purple-700">Home</a>
          <a href="/coupons" className="hover:text-purple-700">Coupons</a>
          <a href="/stores" className="hover:text-purple-700">Stores</a>
          <a href="/categories" className="hover:text-purple-700">Categories</a>
          <a href="/blogs" className="hover:text-purple-700">Blogs</a>
          <a href="/aboutus" className="hover:text-purple-700">About us</a>
        </nav>

        {/* Search Box */}
        <div className="mt-4 md:mt-0 relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search coupons..."
            className="w-full border border-gray-300 rounded px-5 py-3 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
        </div>
      </div>
    </header>
  );
}
