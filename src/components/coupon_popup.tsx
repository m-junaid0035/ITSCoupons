'use client';

import React, { useEffect, useRef, useState, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createSubscriberAction } from '@/actions/subscriberActions';
import { useActionState } from 'react';
import { Copy, X, Mail } from 'lucide-react';

export type CouponModalProps = {
  open: boolean;
  onClose: () => void;
  storeName?: string;
  title?: string;
  code?: string;
  redeemUrl?: string;
  storeImageUrl?: string;
};

export default function CouponModal({
  open,
  onClose,
  storeName = 'Udemy',
  title = 'Udemy Coupon: 85% Off',
  code = 'COUPON123',
  redeemUrl = 'https://udemy.com',
  storeImageUrl,
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

  // ESC key to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Focus trap
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
            className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Mobile compact layout */}
            <div className="flex flex-col gap-4 p-4 md:hidden">
              <div className="flex justify-center">
                {storeImageUrl ? (
                  <img src={storeImageUrl} alt={storeName} className="h-16 w-16 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-purple-700 text-white text-2xl font-bold">
                    {storeName[0]}
                  </div>
                )}
              </div>

              <h2 className="text-lg font-semibold text-gray-900 text-center">{title}</h2>

              {code !== 'NO_CODE' && (
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center justify-center h-10 rounded-md border border-gray-300 bg-gray-50 px-2 shadow-sm text-sm font-mono tracking-widest text-gray-900">
                    {code}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="h-10 flex items-center justify-center gap-1 rounded-md bg-purple-700 px-3 text-xs font-semibold text-white hover:bg-purple-800 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  >
                    <Copy size={14} /> {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}

              <a
                href={redeemUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 shadow-sm transition"
              >
                Redeem at {storeName}
              </a>

              <form onSubmit={handleSubscribe} className="flex flex-col gap-2 w-full">
                <div className="relative">
                  <Mail size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full h-10 pl-8 pr-2 rounded-md border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="h-10 rounded-md bg-purple-700 px-3 text-sm font-semibold text-white hover:bg-purple-800 shadow-md transition"
                >
                  {isPending ? 'Subscribing...' : 'Get Alerts'}
                </button>
              </form>

              {confirmation && (
                <p className={`mt-1 text-sm ${formState.error ? 'text-red-500' : 'text-green-600'}`}>
                  {confirmation}
                </p>
              )}

              {errorFor('email') && <p className="text-red-500 mt-1 text-sm">{errorFor('email')}</p>}
            </div>

            {/* Desktop layout remains unchanged */}
            <div className="hidden md:grid md:grid-cols-2 gap-8 p-8">
              {/* Left Column */}
              <div className="flex flex-col items-start space-y-4">
                {storeImageUrl ? (
                  <img src={storeImageUrl} alt={storeName} className="h-16 w-16 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-purple-700 text-white text-2xl font-bold">
                    {storeName[0]}
                  </div>
                )}

                <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-600">
                  Copy this code at{' '}
                  <a className="underline text-purple-700" href={redeemUrl} target="_blank" rel="noreferrer">
                    {storeName.toLowerCase()}.com
                  </a>
                </p>

                {code !== 'NO_CODE' && (
                  <div className="mt-4 w-full flex gap-3">
                    <div className="flex-1 flex items-center justify-center h-14 rounded-md border border-gray-300 bg-gray-50 px-4 shadow-sm">
                      <span className="select-all font-mono text-lg tracking-widest text-gray-900">
                        {code}
                      </span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="h-14 flex items-center justify-center gap-2 rounded-md bg-purple-700 px-6 text-sm font-semibold text-white hover:bg-purple-800 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    >
                      <Copy size={16} /> {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}

                <a
                  href={redeemUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 w-full text-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 shadow-sm transition"
                >
                  Redeem at {storeName}
                </a>
              </div>

              {/* Right Column */}
              <div className="flex flex-col justify-between p-6 bg-gray-50 rounded-xl space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Offer Details</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Receive 85% off your order with {storeName}'s promo code. Redeem on checkout. Offer valid for a limited time only.
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    {storeImageUrl ? (
                      <img src={storeImageUrl} alt={storeName} className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-purple-700 font-semibold text-white">
                        {storeName[0]}
                      </div>
                    )}
                    <div className="text-sm font-medium text-gray-800">
                      Get coupon alerts for {storeName} and never miss another deal!
                    </div>
                  </div>

                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                    <div className="relative flex-1">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full h-12 pl-10 pr-3 rounded-md border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="h-12 rounded-md bg-purple-700 px-4 text-sm font-semibold text-white hover:bg-purple-800 shadow-md transition"
                    >
                      {isPending ? 'Subscribing...' : 'Get Alerts'}
                    </button>
                  </form>

                  {confirmation && (
                    <p className={`mt-2 text-sm ${formState.error ? 'text-red-500' : 'text-green-600'}`}>
                      {confirmation}
                    </p>
                  )}

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
