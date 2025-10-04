"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaSearch, FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import type { StoreData } from "@/types/store";
import Image from "next/image";
import { fetchAllStoresAction } from "@/actions/storeActions";

export default function Header() {
  const [allStores, setAllStores] = useState<StoreData[]>([]);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState<StoreData[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/stores", label: "Stores" },
    { href: "/coupons", label: "Coupons" },
    { href: "/categories", label: "Categories" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about?slug=about-us", label: "About us" },
  ];

  useEffect(() => {
    async function fetchStores() {
      try {
        const result = await fetchAllStoresAction();
        setAllStores(Array.isArray(result?.data) ? result.data : []);
      } catch (err) {
        console.error("Failed to fetch stores:", err);
      }
    }
    fetchStores();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStores([]);
      return;
    }
    const filtered = allStores.filter((store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [searchTerm, allStores]);

  function handleSelectStore(storeSlug: string) {
    setSearchTerm("");
    setFilteredStores([]);
    setMobileSearchOpen(false);
    router.push(`/stores/${storeSlug}`);
  }

  return (
    <header className="w-full">
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-purple-800 text-white text-sm sm:text-base text-center py-2 sm:py-3 relative px-4 sm:px-6 lg:px-16">
          🎉 Get the latest coupon updates daily – Save more, spend less!
          <button
            onClick={() => setShowAnnouncement(false)}
            aria-label="Close announcement"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-white text-lg sm:text-xl hover:text-gray-300 focus:outline-none"
          >
            <IoMdClose />
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white shadow-sm px-4 sm:px-6 lg:px-16 py-4 md:py-6 flex items-center justify-between relative">
        {/* Logo */}
        <Link
          href="/"
          className="absolute left-4 sm:left-6 lg:left-16 top-[55%] -translate-y-1/2"
        >
          <Image
            src="/logos/ITS-Coupons-Logo.png"
            alt="ITS Coupons Logo"
            width={280}
            height={280}
            className="h-20 sm:h-24 md:h-28 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation + Search */}
        <div className="hidden min-[1201px]:flex flex-1 items-center justify-end pl-44 sm:pl-52 md:pl-60">
          <div className="flex items-center w-full max-w-6xl justify-between relative">
            {/* Nav Links */}
            <nav className="flex space-x-6 text-base lg:text-lg font-medium text-gray-700 mx-auto">
              {navLinks.map(({ href, label }) => {
                const isActive =
                  pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-1 py-1 ${
                      isActive
                        ? "text-purple-800 font-semibold underline underline-offset-4"
                        : "text-gray-700 hover:text-purple-700"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Search */}
            <div className="relative w-64">
              <input
                type="search"
                placeholder="Search stores..."
                className="w-full border border-gray-300 rounded px-4 py-2 pr-10 text-sm outline-none focus:border-gray-300 focus:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search stores"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />

              {filteredStores.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg">
                  {filteredStores.map((store) => (
                    <li
                      key={store._id}
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => handleSelectStore(store.slug)}
                    >
                      {store.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Buttons */}
        <div className="min-[1201px]:hidden flex items-center gap-4 ml-auto">
          {/* Search Button */}
          <button
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            aria-label="Open search"
            className="text-gray-700 hover:text-purple-700"
          >
            <FaSearch className="w-6 h-6" />
          </button>

          {/* Sidebar Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="text-gray-700 hover:text-purple-700"
          >
            {mobileMenuOpen ? (
              <IoMdClose className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="min-[1201px]:hidden px-4 sm:px-6 lg:px-16 py-2 bg-white border-b border-gray-200 relative z-40">
          <input
            type="search"
            placeholder="Search stores..."
            className="w-full border border-gray-300 rounded px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search stores"
          />
          <FaSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500" />

          {filteredStores.length > 0 && (
            <ul className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg">
              {filteredStores.map((store) => (
                <li
                  key={store._id}
                  className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                  onClick={() => handleSelectStore(store.slug)}
                >
                  {store.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } min-[1201px]:hidden`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src="/logos/ITS-Coupons-Logo.png"
                alt="ITS Coupons Logo"
                width={280}
                height={280}
                className="h-20 sm:h-24 md:h-28 w-auto object-contain"
                priority
              />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="text-gray-700 hover:text-purple-700"
            >
              <IoMdClose className="w-8 h-8" />
            </button>
          </div>

          <nav className="flex flex-col space-y-6 text-lg font-semibold text-gray-800">
            {navLinks.map(({ href, label }) => {
              const isActive =
                pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${isActive ? "text-purple-800 underline underline-offset-4" : "hover:text-purple-700"}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
