'use client';

import React, { useEffect, useRef, useState, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { createSubscriberAction, SubscriberFormState } from '@/actions/subscriberActions';
import { useActionState } from 'react';

export type CouponModalProps = {
  open: boolean;
  onClose: () => void;
  storeName?: string;
  title?: string;
  code?: string;
  redeemUrl?: string;
};

export default function CouponModal({
  open,
  onClose,
  storeName = 'Udemy',
  title = 'Udemy Coupon: 85% Off',
  code = 'COUPON123',
  redeemUrl = 'https://udemy.com',
}: CouponModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [formState, dispatch, isPending] = useActionState(createSubscriberAction, {});

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === 'object' &&
      field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;
  };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    const focusables = el?.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables?.[0];
    const last = focusables?.[focusables.length - 1];
    first?.focus();

    function trap(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !focusables || focusables.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [open]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.set('email', email);

    startTransition(() => {
      dispatch(formData);
      setEmail('');
    });
  }

  useEffect(() => {
    if (formState.data && !formState.error) {
      setConfirmation(`You're now subscribed to ${storeName} updates!`);
    } else if (formState.error && 'message' in formState.error) {
      setConfirmation((formState.error as any).message?.[0] || 'Something went wrong!');
    }
  }, [formState, storeName]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={dialogRef}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Left: Icon & Code */}
              <div className="flex flex-col items-center justify-center space-y-4 md:items-start">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#4b2a7b] text-white text-2xl font-bold">
                  U
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 text-center md:text-left">{title}</h2>
                <p className="text-sm text-gray-600 text-center md:text-left">
                  Copy and press this code at{' '}
                  <a
                    className="underline text-purple-700"
                    href={redeemUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {storeName.toLowerCase()}.com
                  </a>
                </p>

                <div className="mt-4 w-full flex gap-3">
                  <div className="flex-1 flex items-center justify-center h-14 rounded-md border border-gray-300 bg-gray-50 px-4 shadow-sm">
                    <span className="select-all font-mono text-lg tracking-widest text-gray-900">{code}</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="h-14 rounded-md bg-purple-700 px-6 text-sm font-semibold text-white hover:bg-purple-800 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <a
                  href={redeemUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 w-full text-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 shadow-sm transition"
                >
                  Redeem at {storeName}
                </a>

                <div className="mt-4 flex items-center gap-3 text-sm text-gray-700">
                  <span>Did the code work?</span>
                  <button className="inline-flex items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs hover:bg-gray-50 transition">
                    <ThumbsUp size={14} />
                  </button>
                  <button className="inline-flex items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs hover:bg-gray-50 transition">
                    <ThumbsDown size={14} />
                  </button>
                </div>
              </div>

              {/* Right: Offer Details & Subscription */}
              <div className="flex flex-col justify-between p-6 bg-gray-50 rounded-xl space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Offer Details</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Receive 85% off your order with Udemy's promo code. Redeem on checkout. Offer valid for a limited time only.
                  </p>
                </div>

                <div className="mt-4 text-center md:text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-[#4b2a7b] font-semibold text-white">U</div>
                    <div className="text-sm font-medium text-gray-800">
                      Get coupon alerts for {storeName} and never miss another deal!
                    </div>
                  </div>

                  {/* Email subscription form */}
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1 h-10 rounded-md border border-gray-300 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="h-10 rounded-md bg-purple-700 px-4 text-sm font-semibold text-white hover:bg-purple-800 shadow-md transition"
                    >
                      {isPending ? 'Subscribing...' : 'Get Alerts'}
                    </button>
                  </form>

                  {/* Inline confirmation message */}
                  {confirmation && (
                    <p className={`mt-2 text-sm ${formState.error ? 'text-red-500' : 'text-green-600'}`}>
                      {confirmation}
                    </p>
                  )}

                  {/* Field-level error */}
                  {errorFor('email') && <p className="text-red-500 mt-1 text-sm">{errorFor('email')}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
