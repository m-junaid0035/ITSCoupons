"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSearch, FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";

export default function Header() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/coupons", label: "Coupons" },
    { href: "/stores", label: "Stores" },
    { href: "/categories", label: "Categories" },
    { href: "/blogs", label: "Blogs" },
    { href: "/aboutus", label: "About us" },
  ];

  return (
    <header className="w-full">
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div
          role="region"
          aria-label="Announcement"
          className="bg-purple-800 text-white text-base text-center py-3 relative px-6 md:px-16"
        >
          🎉 Get the latest coupon updates daily – Save more, spend less!
          <button
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-xl hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded"
            aria-label="Close announcement"
          >
            <IoMdClose />
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white shadow-sm px-6 md:px-16 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="text-3xl font-bold text-purple-800 select-none">
          ITS
          <span className="font-light text-black">Coupons</span>
        </div>

        {/* Desktop Nav + Search */}
        <div className="hidden md:flex items-center w-full max-w-6xl justify-between">
          {/* Nav Links container centered */}
          <nav className="flex space-x-10 text-lg font-medium text-gray-700 whitespace-nowrap mx-auto">
            {navLinks.map(({ href, label }) => {
              const isActive =
                pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-1 py-1 tracking-wide transition-colors duration-200 ease-in-out ${
                    isActive
                      ? "text-purple-800 font-semibold underline underline-offset-4"
                      : "text-gray-700 hover:text-purple-700"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Search Box stays aligned right */}
          <div className="relative w-64">
            <label htmlFor="search-input-desktop" className="sr-only">
              Search coupons
            </label>
            <input
              id="search-input-desktop"
              type="search"
              placeholder="Search coupons..."
              className="w-full border border-gray-300 rounded px-5 py-3 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoComplete="off"
              aria-label="Search coupons"
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg pointer-events-none" />
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-gray-700 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? (
            <IoMdClose className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex flex-col h-full px-6 py-8">
          {/* Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="self-end text-gray-700 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded mb-8"
            aria-label="Close menu"
          >
            <IoMdClose className="w-8 h-8" />
          </button>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-6 text-xl font-semibold text-gray-800">
            {navLinks.map(({ href, label }) => {
              const isActive =
                pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-purple-800 underline underline-offset-4"
                      : "hover:text-purple-700"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Search Box (Original style preserved) */}
          <div className="relative mt-10 w-full max-w-md">
            <label htmlFor="search-input-mobile" className="sr-only">
              Search coupons
            </label>
            <input
              id="search-input-mobile"
              type="search"
              placeholder="Search coupons..."
              className="w-full border border-gray-300 rounded px-5 py-3 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoComplete="off"
              aria-label="Search coupons"
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg pointer-events-none" />
          </div>
        </div>
      </div>
    </header>
  );
}
