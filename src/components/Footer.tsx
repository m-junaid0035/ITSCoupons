"use client";

import React, { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaYahoo } from "react-icons/fa"; // ✅ FaYahoo for Yahoo
import { SiX } from "react-icons/si";
import Link from "next/link";
import Image from "next/image"; 
import { fetchLatestSettingAction } from "@/actions/settingActions";
import { fetchLatestStaticPageTitlesAndSlugsAction } from "@/actions/staticPagesActions";
import type { SettingData } from "@/types/setting";

export default function Footer() {
  const [latestSetting, setLatestSetting] = useState<SettingData | null>(null);
  const [aboutPages, setAboutPages] = useState<{ title: string; slug: string }[]>([]);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        const settingResult = await fetchLatestSettingAction();
        setLatestSetting(settingResult?.data || null);

        const pagesResult = await fetchLatestStaticPageTitlesAndSlugsAction();
        setAboutPages(Array.isArray(pagesResult?.data) ? pagesResult.data : []);
      } catch (err) {
        console.error("Failed to fetch footer data:", err);
      }
    }
    fetchFooterData();
  }, []);

  return (
    <footer className="bg-purple-800 text-white px-6 md:px-16 py-16">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        {/* Logo + Description + Socials */}
        <div className="space-y-4 col-span-2 md:col-span-1 text-center md:text-left">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/logos/ITS-Coupons-Logo-White.png"
              alt="ITS Coupons Logo"
              width={180}
              height={60}
              className="h-12 w-auto object-contain pr-2"
              priority
            />
          </div>
          <p className="max-w-sm mx-auto md:mx-0">
            Helping you save money with verified coupons and deals from your
            favorite stores.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            {latestSetting?.yahooUrl && (
              <Link
                href={latestSetting.yahooUrl}
                className="bg-purple-900 p-2 rounded"
                target="_blank"
                rel="noreferrer"
              >
                <FaYahoo />
                <span className="sr-only">Yahoo Link</span>
              </Link>
            )}
            {latestSetting?.facebookUrl && (
              <Link
                href={latestSetting.facebookUrl}
                className="bg-purple-900 p-2 rounded"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebookF />
                <span className="sr-only">Facebook Link</span>
              </Link>
            )}
            {latestSetting?.XUrl && (
              <Link
                href={latestSetting.XUrl}
                className="bg-purple-900 p-2 rounded"
                target="_blank"
                rel="noreferrer"
              >
                <SiX />
                <span className="sr-only">X Link</span>
              </Link>
            )}
            {latestSetting?.instagramUrl && (
              <Link
                href={latestSetting.instagramUrl}
                className="bg-purple-900 p-2 rounded"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram />
                <span className="sr-only">Instagram Link</span>
              </Link>
            )}
          </div>
        </div>

        {/* Deals & Shop */}
        <div>
          <p className="font-semibold mb-2">Deals &amp; Shop</p>
          <ul className="space-y-1">
            <li><Link href="/coupons" className="hover:underline">Promo Codes</Link></li>
            <li><Link href="/coupons" className="hover:underline">Latest Deals</Link></li>
            <li><Link href="/coupons" className="hover:underline">Exclusives</Link></li>
            <li><Link href="/coupons" className="hover:underline">Product Deals</Link></li>
            <li><Link href="/coupons" className="hover:underline">Stores</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <p className="font-semibold mb-2">Quick Links</p>
          <ul className="space-y-1">
            {[
              { href: "/", label: "Home" },
              { href: "/stores", label: "Stores" },
              { href: "/coupons", label: "Coupons" },
              { href: "/categories", label: "Categories" },
              { href: "/blogs", label: "Blogs" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-purple-400 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About Section */}
        <div>
          <p className="font-semibold mb-2">About</p>
          <ul className="space-y-1">
            <li><Link href="/contactus" className="hover:underline">Contact Us</Link></li>
            {aboutPages.length > 0 ? (
              aboutPages.map((page) => (
                <li key={page.slug}>
                  <Link href={`/about?slug=${page.slug}`} className="hover:underline">
                    {page.title}
                  </Link>
                </li>
              ))
            ) : (
              <li>Loading pages...</li>
            )}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="font-semibold mb-2">Contact Us</p>
          <ul className="space-y-1">
            <li className="max-w-full break-words">{latestSetting?.contactEmail || "support@itscoupons.com"}</li>
            <li className="max-w-full break-words">{latestSetting?.contactPhone || "(+92) 3143328342"}</li>
            <li className="max-w-full break-words">{latestSetting?.address || "123, street, Discount city, 50050"}</li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-10 text-center text-sm text-white/70">
        © {new Date().getFullYear()} {latestSetting?.siteName || "ITSCoupons"}. All rights reserved.
      </div>
    </footer>
  );
}
