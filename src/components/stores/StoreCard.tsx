"use client";
import React, { useState } from 'react';

export default function StoreCard() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fashion', 'Food & Drinks', 'Travel', 'Entertainment', 'Grocery', 'Gaming', 'Shopping'];

  const stores = [
    {
      name: 'Starbucks',
      logo: 'Starbucks',
      color: '#006341',
      category: 'Food & Drinks',
      description: 'World’s largest coffeehouse chain offering coffee, tea, and food items with locations worldwide.',
      coupons: [
        { title: '20% Off Your First Order', code: 'WELCOME20', expiry: '2024-12-31' },
        { title: 'Free Drink on Birthday', code: 'BIRTHDAY', expiry: '2024-12-31' },
        { title: 'Buy 2 Get 1 Free', code: 'B2G1FREE', expiry: '2024-12-25' }
      ]
    },
    {
      name: 'Netflix',
      logo: 'Netflix',
      color: '#e50914',
      category: 'Entertainment',
      description: 'Leading streaming entertainment service with thousands of TV series, documentaries and feature films.',
      coupons: [
        { title: 'First Month Free', code: 'FIRSTFREE', expiry: '2024-12-31' },
        { title: '30% Off Annual Plan', code: 'ANNUAL30', expiry: '2024-12-28' }
      ]
    },
    {
      name: 'Walmart',
      logo: 'Walmart',
      color: '#0071ce',
      category: 'Grocery',
      description: 'Retailer offering groceries, electronics, and essentials at low prices.',
      coupons: [
        { title: '$10 Off $50+ Orders', code: 'SAVE10', expiry: '2024-12-30' },
        { title: 'Free Delivery on $35+', code: 'FREEDEL', expiry: '2024-12-31' },
        { title: '15% Off Electronics', code: 'TECH15', expiry: '2024-12-27' }
      ]
    },
    {
      name: 'Ray-Ban',
      logo: 'Ray-Ban',
      color: '#000000',
      category: 'Fashion',
      description: 'Premium sunglasses and optical frames with timeless designs.',
      coupons: [
        { title: '25% Off Sunglasses', code: 'SUN25', expiry: '2024-12-29' },
        { title: 'Buy One Get 50% Off', code: 'BOGO50', expiry: '2024-12-31' }
      ]
    },
    {
      name: 'Emirates',
      logo: 'Emirates',
      color: '#d71920',
      category: 'Travel',
      description: 'Award-winning airline offering luxury travel experiences to 150+ destinations.',
      coupons: [
        { title: '15% Off Flight Bookings', code: 'FLY15', expiry: '2024-12-31' },
        { title: 'Free Upgrade to Business', code: 'UPGRADE', expiry: '2024-12-28' }
      ]
    },
    {
      name: 'Origin',
      logo: 'Origin',
      color: '#f26522',
      category: 'Gaming',
      description: 'Digital distribution platform for PC gaming with exclusive titles and deals.',
      coupons: [
        { title: '50% Off Selected Games', code: 'GAME50', expiry: '2024-12-28' },
        { title: 'Free Game with Purchase', code: 'FREEGAME', expiry: '2024-12-31' }
      ]
    }
  ];

  const filteredStores =
    selectedCategory === 'All' ? stores : stores.filter((store) => store.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Browse All Stores</h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 rounded-full text-sm font-medium border ${
              selectedCategory === cat
                ? 'bg-purple-700 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Store Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store, index) => (
          <div key={index} className="border rounded-xl shadow-md p-4 bg-white">
            <div
              className="h-10 w-24 rounded text-white text-sm font-semibold flex items-center justify-center mb-2"
              style={{ backgroundColor: store.color }}
            >
              {store.logo}
            </div>
            <h3 className="text-lg font-bold text-center text-purple-800">{store.name}</h3>
            <p className="text-sm text-gray-600 text-center my-2">{store.description}</p>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Latest Coupons</h4>
              {store.coupons.map((coupon, cIndex) => (
                <div key={cIndex} className="flex justify-between items-start bg-gray-100 text-sm px-2 py-2 rounded mb-2">
                  <div className="flex flex-col text-gray-700">
                    <span className="font-medium">{coupon.title}</span>
                    <span className="text-xs text-purple-600">{coupon.code}</span>
                    <span className="text-xs text-gray-500">Expires: {coupon.expiry}</span>
                  </div>
                  <button className="text-purple-600 text-xs font-semibold">Copy Code</button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between">
              <button className="text-white bg-purple-600 px-3 py-1 rounded text-sm hover:bg-purple-700 transition">
                View All Coupons
              </button>
              <button className="text-gray-800 border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100 transition">
                Visit Store
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
