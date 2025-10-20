"use client";

import React, { useEffect, useRef, useState, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createSubscriberAction } from "@/actions/subscriberActions";
import { useActionState } from "react";
import {
  Copy,
  X,
  Mail,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Tag,
} from "lucide-react";
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
  restrictions?: string;
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
  restrictions = "Some restrictions apply",
}: CouponModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [formState, dispatch, isPending] = useActionState(
    createSubscriberAction,
    {}
  );

  const errorFor = (field: string) =>
    formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleCopy() {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
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
      setConfirmation(
        (formState.error as any).message?.[0] || "Something went wrong!"
      );
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
          {/* Overlay */}
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
            className="relative w-full max-w-md sm:max-w-lg rounded-2xl bg-white shadow-2xl overflow-y-auto p-6 max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              <X size={18} />
            </button>

            {/* Store Logo */}
            <div className="flex justify-center mt-9">
              <Link
                href={redeemUrl}
                target="_blank"
                className="flex items-center justify-center bg-white overflow-hidden"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "100px",
                  border: "1px solid #ddd",
                }}
              >
                <Image
                  src={`https://itscoupons.com${storeImageUrl}` || "/placeholder-store.png"}
                  alt={storeName}
                  width={100}
                  height={100}
                  className="object-contain p-3"
                />
              </Link>
            </div>

            {/* Discount Title */}
            <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
              {discount} Off
            </h2>
            {description && (
              <p className="mt-1 text-center text-sm text-gray-600">
                {description}
              </p>
            )}

            {/* Coupon Code */}
            <div className="mt-6 flex flex-col items-center">
              {code && code !== "NO_CODE" ? (
                <>
                  {/* Tooltip when copied */}
                  {copied && (
                    <div className="mb-2 p-4 rounded-md bg-white text-black text-sm shadow border border-gray-200">
                      Copied to your clipboard!
                    </div>
                  )}

                  {/* Code container */}
                  <div className="flex items-center rounded-full bg-white text-black px-4 py-3 gap-3 shadow-lg border border-purple-300">
                    {/* Code with icon */}
                    <span className="flex items-center gap-2 font-mono text-lg tracking-wide text-black">
                      <Tag className="w-5 h-5" />
                      {code}
                    </span>

                    {/* Copy button */}
                    <button
                      onClick={handleCopy}
                      className="ml-3 rounded-md bg-purple-700 px-3 py-1 text-sm font-medium text-white hover:bg-gray-600 transition"
                    >
                      Copy
                    </button>
                  </div>

                  {/* Instruction */}
                  <p className="mt-3 text-xs text-purple-500">
                    Copy and paste this code at{" "}
                    <a
                      href={redeemUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-black underline hover:text-purple-600 transition"
                    >
                      {storeName}
                    </a>
                  </p>
                  <p className="mt-3 text-xs text-black">
                    Did this code work?
                  </p>
                </>
              ) : (
                <>
                  <div className="mt-2 text-purple-600 font-semibold text-sm">
                    Deal Activated – No Code Required 🎉
                  </div>
                  <p className="mt-3 text-xs text-purple-500">
                    Get this deal at{" "}
                    <a
                      href={redeemUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-black underline hover:text-purple-600 transition"
                    >
                      {storeName}
                    </a>
                  </p>

                  <p className="mt-3 text-xs text-black">
                    Did this code work?
                  </p>
                </>
              )}
            </div>


            {/* Did this code work? */}
            <div className="mt-6 flex justify-center gap-4">
              {!feedbackMsg ? (
                <>
                  <button
                    onClick={() => setFeedbackMsg("Thanks for the feedback!")}
                    className="flex items-center gap-1 rounded-md bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200 text-gray-700"
                  >
                    <ThumbsDown size={16} className="text-red-500" /> No
                  </button>
                  <button
                    onClick={() => setFeedbackMsg("Thanks for the feedback!")}
                    className="flex items-center gap-1 rounded-md bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200 text-gray-700"
                  >
                    <ThumbsUp size={16} className="text-green-600" /> Yes
                  </button>
                </>
              ) : (
                <p className="text-sm text-gray-800">{feedbackMsg}</p>
              )}
            </div>
            {/* Redeem */}
            <a
              href={redeemUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 block w-full rounded-lg bg-purple-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-purple-800 transition"
            >
              Shop at {storeName}
            </a>

            {/* Email Subscribe */}
            <div className="mt-6 bg-gray-50 rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-3">
                Get Coupon Alerts
              </h3>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full h-11 sm:h-12 pl-10 pr-3 rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className={`mt-2 text-sm ${formState.error ? "text-red-500" : "text-green-600"
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
