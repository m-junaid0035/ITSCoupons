"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaSearch, FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import { fetchAllStoresAction } from "@/actions/storeActions";
import type { StoreData } from "@/types/store";

export default function Header() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allStores, setAllStores] = useState<StoreData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState<StoreData[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/coupons", label: "Coupons" },
    { href: "/stores", label: "Stores" },
    { href: "/categories", label: "Categories" },
    { href: "/blogs", label: "Blogs" },
    { href: "/aboutus", label: "About us" },
  ];

  // Fetch all stores on mount
  useEffect(() => {
    async function loadStores() {
      try {
        const result = await fetchAllStoresAction();
        const storesArray = Array.isArray(result?.data) ? result.data : [];
        setAllStores(storesArray);
      } catch (error) {
        console.error("Error fetching all stores:", error);
      }
    }
    loadStores();
  }, []);

  // Filter stores based on search term
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

  // Handle store selection
  function handleSelectStore(storeId: string) {
    setSearchTerm("");
    setFilteredStores([]);
    setMobileMenuOpen(false);
    router.push(`/stores/${storeId}`);
  }

  return (
    <header className="w-full">
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div
          role="region"
          aria-label="Announcement"
          className="bg-purple-800 text-white text-sm sm:text-base text-center py-2 sm:py-3 relative px-4 sm:px-6 lg:px-16"
        >
          🎉 Get the latest coupon updates daily – Save more, spend less!
          <button
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 text-white text-lg sm:text-xl hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded"
            aria-label="Close announcement"
          >
            <IoMdClose />
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white shadow-sm px-4 sm:px-6 lg:px-16 py-4 md:py-5 lg:py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-bold text-purple-800 select-none">
          ITS
          <span className="font-light text-black">Coupons</span>
        </div>

        {/* Tablet/Desktop Nav + Search */}
        <div className="hidden md:flex items-center w-full max-w-6xl justify-between relative">
          <nav className="flex space-x-6 lg:space-x-10 text-base md:text-lg font-medium text-gray-700 whitespace-nowrap mx-auto">
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

          <div className="relative w-48 md:w-56 lg:w-64">
            <label htmlFor="search-input-desktop" className="sr-only">
              Search stores
            </label>
            <input
              id="search-input-desktop"
              type="search"
              placeholder="Search stores..."
              className="w-full border border-gray-300 rounded px-3 md:px-4 lg:px-5 py-2 md:py-2.5 lg:py-3 pr-10 md:pr-11 lg:pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoComplete="off"
              aria-label="Search stores"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base md:text-lg pointer-events-none" />

            {/* Filtered dropdown */}
            {filteredStores.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg">
                {filteredStores.map((store) => (
                  <li
                    key={store._id}
                    className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-gray-800"
                    onClick={() => handleSelectStore(store._id)}
                  >
                    {store.name}
                  </li>
                ))}
              </ul>
            )}
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
        <div className="flex flex-col h-full px-4 sm:px-6 py-6 sm:py-8">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="self-end text-gray-700 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded mb-6 sm:mb-8"
            aria-label="Close menu"
          >
            <IoMdClose className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>

          <nav className="flex flex-col space-y-4 sm:space-y-6 text-lg sm:text-xl font-semibold text-gray-800">
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

          {/* Mobile search */}
          <div className="relative mt-8 sm:mt-10 w-full max-w-md">
            <label htmlFor="search-input-mobile" className="sr-only">
              Search stores
            </label>
            <input
              id="search-input-mobile"
              type="search"
              placeholder="Search stores..."
              className="w-full border border-gray-300 rounded px-3 sm:px-5 py-2 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoComplete="off"
              aria-label="Search stores"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base sm:text-lg pointer-events-none" />

            {filteredStores.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg">
                {filteredStores.map((store) => (
                  <li
                    key={store._id}
                    className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-gray-800"
                    onClick={() => handleSelectStore(store._id)}
                  >
                    {store.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
