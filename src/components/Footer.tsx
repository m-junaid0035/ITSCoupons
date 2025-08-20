"use client";

import React from "react";
import { FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiX } from "react-icons/si";
import type { SettingData } from "@/types/setting";
import Link from "next/link";

interface FooterProps {
  latestSetting: SettingData | null;
}

export default function Footer({ latestSetting }: FooterProps) {
  return (
    <footer className="bg-purple-800 text-white px-6 md:px-16 py-16">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        {/* Logo + Description + Socials */}
        <div className="space-y-4 col-span-2 md:col-span-1 text-center md:text-left">
          <h2 className="text-2xl font-bold">
            {latestSetting?.siteName || "ITSCoupons"}
          </h2>
          <p className="max-w-sm mx-auto md:mx-0">
            Helping you save money with verified coupons and deals from your favorite stores.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            {latestSetting?.whatsappUrl && (
              <Link
                href={latestSetting.whatsappUrl}
                className="bg-purple-900 p-2 rounded"
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp />
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
              </Link>
            )}
          </div>
        </div>

        {/* Deals & Shop */}
        <div>
          <h4 className="font-semibold mb-2">Deals & Shop</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/coupons" className="hover:underline">
                Promo Codes
              </Link>
            </li>
            <li>
              <Link href="/coupons" className="hover:underline">
                Latest Deals
              </Link>
            </li>
            <li>
              <Link href="/coupons" className="hover:underline">
                Exclusives
              </Link>
            </li>
            <li>
              <Link href="/coupons" className="hover:underline">
                Product Deals
              </Link>
            </li>
            <li>
              <Link href="/coupons" className="hover:underline">
                Stores
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1">
            {[
              { href: "/", label: "Home" },
              { href: "/coupons", label: "Coupons" },
              { href: "/stores", label: "Stores" },
              { href: "/categories", label: "Categories" },
              { href: "/blogs", label: "Blogs" },
              { href: "/aboutus", label: "About us" },
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

        {/* Top Categories */}
        <div>
          <h4 className="font-semibold mb-2">Top Categories</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/categories" className="hover:underline">
                Fashion
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:underline">
                Electronics
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:underline">
                Food & Drinks
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:underline">
                Travel
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:underline">
                Beauty & Health
              </Link>
            </li>
          </ul>
        </div>
        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-2">Contact Us</h4>
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
