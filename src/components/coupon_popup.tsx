"use client";

import React, { useEffect, useRef, useState, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createSubscriberAction } from "@/actions/subscriberActions";
import { useActionState } from "react";
import { Copy, X, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export type CouponModalProps = {
  open: boolean;
  onClose: () => void;
  storeName?: string;
  title?: string;
  discount?: string;
  code?: string;
  description?: string;
  redeemUrl?: string;
  storeImageUrl?: string;
  storeSlug?: string;
};

export default function CouponModal({
  open,
  onClose,
  storeName = "Udemy",
  title = "Udemy Coupon: 85% Off",
  discount = "85%",
  code = "COUPON123",
  description = "Dummy description goes here.",
  redeemUrl = "https://udemy.com",
  storeImageUrl,
  storeSlug = "udemy",
}: CouponModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [formState, dispatch, isPending] = useActionState(createSubscriberAction, {});

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;
  };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleCopy() {
    try {
      if (code) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {}
  }

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("email", email);

    startTransition(() => {
      dispatch(formData);
      setEmail("");
    });
  }

  useEffect(() => {
    if (formState.data && !formState.error) {
      setConfirmation(`You're now subscribed to ${storeName} updates!`);
    } else if (formState.error && "message" in formState.error) {
      setConfirmation((formState.error as any).message?.[0] || "Something went wrong!");
    }
  }, [formState, storeName]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            ref={dialogRef}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="relative w-full max-w-md sm:max-w-lg rounded-2xl bg-white shadow-2xl overflow-y-auto p-4 sm:p-6 max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Close"
            >
              <X size={18} className="sm:size-5" />
            </button>

            {/* Store Logo */}
            <div className="flex justify-center">
              <Link
                href={`/stores/${storeSlug}`}
                className="flex items-center justify-center bg-white overflow-hidden transition hover:scale-105"
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "100px",
                  border: "1px solid #C4C4C4",
                }}
              >
                <Image
                  src={`https://itscoupons.com${storeImageUrl}` || "/placeholder-store.png"}
                  alt={storeName}
                  width={140}
                  height={140}
                  className="object-contain rounded-full p-4 sm:p-6 transition-transform duration-300 hover:scale-110 hover:brightness-105"
                />
              </Link>
            </div>

            {/* Title */}
            <h2 className="mt-3 text-center text-xl sm:text-2xl font-bold text-gray-900">
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p className="mt-2 text-center text-gray-600 text-sm sm:text-base">{description}</p>
            )}

            {/* Coupon Code Section */}
            <div className="mt-5 flex flex-col items-center">
              {code && code !== "NO_CODE" ? (
                <>
                  <div className="flex items-center justify-center border-2 border-dashed border-purple-600 rounded-lg px-4 py-3 bg-gray-50 text-base sm:text-lg font-mono tracking-wider text-gray-900">
                    {code}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="mt-3 inline-flex items-center gap-2 rounded-md bg-purple-700 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-800 shadow-md transition"
                  >
                    <Copy size={14} /> {copied ? "Copied!" : "Copy Code"}
                  </button>
                </>
              ) : (
                <div className="mt-2 text-center text-green-700 font-semibold text-sm sm:text-base">
                  Deal Activated – No Code Required 🎉
                </div>
              )}
            </div>

            {/* Redeem Button */}
            <a
              href={redeemUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 w-full block text-center rounded-lg bg-purple-700 px-5 py-3 text-sm sm:text-base text-white font-semibold hover:bg-purple-800 shadow-md transition"
            >
              Redeem at {storeName}
            </a>

            {/* Email Subscribe */}
            <div className="mt-6 bg-gray-50 rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-3">
                Get Coupon Alerts
              </h3>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full h-11 sm:h-12 pl-10 pr-3 rounded-md border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="h-11 sm:h-12 rounded-md bg-purple-700 px-5 sm:px-6 text-sm font-semibold text-white hover:bg-purple-800 shadow-md transition"
                >
                  {isPending ? "Subscribing..." : "Get Alerts"}
                </button>
              </form>
              {confirmation && (
                <p
                  className={`mt-2 text-sm ${
                    formState.error ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {confirmation}
                </p>
              )}
              {errorFor("email") && (
                <p className="text-red-500 mt-1 text-sm">{errorFor("email")}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
