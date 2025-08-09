'use client';

import { FaTags, FaHandshake, FaClock } from 'react-icons/fa';
import { ReactNode } from 'react';

type Coupon = {
  id: number;
  discount: string;
  title: string;
  description: string;
  uses: number;
  verified: boolean;
  tag: 'purple' | 'orange' | 'pink' | 'yellow' | string;
};

type StatProps = {
  icon: ReactNode;
  value: number;
  label: string;
};

const coupons: Coupon[] = [
  {
    id: 1,
    discount: '20% off',
    title: "20% Off Coupon | Denny's Rewards Program",
    description:
      "Denny’s is offering 20% off your next visit when you join their Rewards Program! You will get this coupon within 24–48 hours after signing up...",
    uses: 422,
    verified: true,
    tag: 'purple',
  },
  {
    id: 2,
    discount: '5% off',
    title: 'Extra $5 Off $25',
    description:
      'Denny’s is offering $5 off online orders of $25 or more! Enter this code during checkout to redeem your offer. Delivery is free when you spend $5 or more.',
    uses: 312,
    verified: false,
    tag: 'orange',
  },
  {
    id: 3,
    discount: '25% off',
    title: 'Official Page For Denny’s Current Promotions',
    description:
      'This is the official page for the currently running promotions from Denny’s. Find out how to sign up for rewards, get birthday treats and more!',
    uses: 398,
    verified: true,
    tag: 'purple',
  },
];

export default function StorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 text-gray-800">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 space-y-8">
          {/* Store Info */}
          <div className="text-center">
            <img
              src="/logos/starbucks.png"
              alt="store"
              className="mx-auto w-24 mb-4"
            />
            <p className="text-sm text-gray-600">
              TurboTax is a software package for preparation of American income
              tax returns, produced by Intuit, Inc.. Turbotax is the dominant
              market leader in its product segment. Its competitors include H&R
              Block Tax Software and TaxAct.
            </p>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <Stat icon={<FaTags />} value={15} label="Coupons" />
            <Stat icon={<FaHandshake />} value={3} label="Deals" />
            <Stat icon={<FaClock />} value={10} label="Expired Coupons" />
          </div>
        </aside>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Tabs */}
          <div className="flex gap-8 border-b text-sm font-medium mb-6">
            <button className="pb-2 border-b-2 border-purple-700 text-purple-700">
              All Coupons (11)
            </button>
            <button className="pb-2 hover:text-purple-600">Promo Codes (1)</button>
            <button className="pb-2 hover:text-purple-600">Online Sales (8)</button>
            <button className="pb-2 hover:text-purple-600">In-Store Offers (2)</button>
          </div>

          {/* Coupons */}
          <div className="space-y-6">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="flex border border-gray-200 rounded-lg overflow-hidden bg-white"
              >
                {/* Discount Tag */}
                <div
                  className={`w-1/6 min-w-[80px] flex items-center justify-center text-white text-lg font-bold p-4 ${getTagColor(
                    coupon.tag
                  )}`}
                >
                  {coupon.discount}
                </div>

                {/* Info */}
                <div className="flex-1 p-4 space-y-1">
                  <h3 className="font-semibold">{coupon.title}</h3>
                  <p className="text-sm text-gray-600">{coupon.description}</p>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-end justify-between p-4 w-[180px]">
                  <button className="bg-purple-700 hover:bg-purple-800 text-white text-sm px-4 py-2 rounded">
                    Get Coupon Code
                  </button>
                  <div className="text-xs mt-2 text-right">
                    {coupon.verified && (
                      <div className="text-purple-600 font-medium">🟣 Coupon verified</div>
                    )}
                    <div className="text-gray-500">{coupon.uses} used today</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility to get background color class based on tag
function getTagColor(tag: string): string {
  switch (tag) {
    case 'purple':
      return 'bg-purple-700';
    case 'orange':
      return 'bg-orange-500';
    case 'pink':
      return 'bg-pink-500';
    case 'yellow':
      return 'bg-yellow-400 text-black';
    default:
      return 'bg-gray-400';
  }
}

// Small stat box component
function Stat({ icon, value, label }: StatProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-purple-700 text-lg">{icon}</div>
      <div>
        <div className="text-xl font-bold text-purple-700">{value}</div>
        <div className="text-sm">{label}</div>
      </div>
    </div>
  );
}
