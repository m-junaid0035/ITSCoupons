"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaSearch, FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import type { StoreData } from "@/types/store";
import Image from "next/image";

interface HeaderProps {
  allStores: StoreData[];
}

export default function Header({ allStores }: HeaderProps) {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <div className="bg-purple-800 text-white text-sm sm:text-base text-center py-2 sm:py-3 relative px-4 sm:px-6 lg:px-16">
          🎉 Get the latest coupon updates daily – Save more, spend less!
          <button
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-white text-lg sm:text-xl hover:text-gray-300 focus:outline-none"
          >
            <IoMdClose />
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white shadow-sm px-4 sm:px-6 lg:px-16 py-4 md:py-6 flex items-center justify-between relative">
        {/* Logo (absolutely positioned so header height doesn't change) */}
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


        {/* Right section (nav + search + sidebar toggle) */}
        <div className="flex-1 flex items-center justify-end pl-44 sm:pl-52 md:pl-60">
          {/* Navbar (visible only when width >= 1201px) */}
          <div className="hidden min-[1201px]:flex items-center w-full max-w-6xl justify-between relative">
            <nav className="flex space-x-6 text-base lg:text-lg font-medium text-gray-700 mx-auto">
              {navLinks.map(({ href, label }) => {
                const isActive =
                  pathname === href ||
                  (href !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-1 py-1 ${isActive
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
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />

              {filteredStores.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg">
                  {filteredStores.map((store) => (
                    <li
                      key={store._id}
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => handleSelectStore(store._id)}
                    >
                      {store.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Sidebar Toggle (visible only when width <= 1200px) */}
          <button
            className="min-[1201px]:hidden text-gray-700 hover:text-purple-700"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? (
              <IoMdClose className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar (for <=1200px) */}
      <div
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } min-[1201px]:hidden`}
      >
        <div className="flex flex-col h-full p-6">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="self-end mb-6 text-gray-700 hover:text-purple-700"
          >
            <IoMdClose className="w-8 h-8" />
          </button>

          {/* Sidebar Nav */}
          <nav className="flex flex-col space-y-6 text-lg font-semibold text-gray-800">
            {navLinks.map(({ href, label }) => {
              const isActive =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${isActive
                      ? "text-purple-800 underline underline-offset-4"
                      : "hover:text-purple-700"
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Search */}
          <div className="relative mt-10 w-full max-w-md">
            <input
              type="search"
              placeholder="Search stores..."
              className="w-full border border-gray-300 rounded px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />

            {filteredStores.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg">
                {filteredStores.map((store) => (
                  <li
                    key={store._id}
                    className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
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