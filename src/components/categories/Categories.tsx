'use client';

import { useState, FC } from 'react';
import {
  FaTshirt,
  FaHamburger,
  FaPlane,
  FaFilm,
  FaAppleAlt,
  FaGamepad,
  FaStore,
  FaHeartbeat,
} from 'react-icons/fa';
import { IconBaseProps } from 'react-icons/lib';

type Category = {
  icon: FC<IconBaseProps>;
  title: string;
  description: string;
  stores: string;
  deals: string;
  tags: string[];
};

type FilterOption = {
  label: string;
  value: string;
};

const categories: Category[] = [
  {
    icon: FaTshirt,
    title: 'Fashion',
    description: 'Clothing, shoes, accessories, and style essentials from top fashion brands worldwide.',
    stores: '2,450+',
    deals: '11,620+',
    tags: ['all', 'popular'],
  },
  {
    icon: FaHamburger,
    title: 'Food & Drinks',
    description: 'Restaurants, cafes, food delivery, beverages, and culinary experiences.',
    stores: '1,890+',
    deals: '8,920+',
    tags: ['all', 'popular'],
  },
  {
    icon: FaPlane,
    title: 'Travel',
    description: 'Hotels, flights, car rentals, vacation packages, and travel experiences.',
    stores: '980+',
    deals: '5,240+',
    tags: ['all', 'trending'],
  },
  {
    icon: FaFilm,
    title: 'Entertainment',
    description: 'Movies, streaming services, concerts, events, and entertainment experiences.',
    stores: '750+',
    deals: '3,890+',
    tags: ['all'],
  },
  {
    icon: FaAppleAlt,
    title: 'Grocery',
    description: 'Supermarkets, organic foods, household essentials, and grocery delivery services.',
    stores: '1,200+',
    deals: '6,750+',
    tags: ['all'],
  },
  {
    icon: FaGamepad,
    title: 'Gaming',
    description: 'Video games, gaming accessories, consoles, and digital gaming platforms.',
    stores: '650+',
    deals: '4,320+',
    tags: ['all', 'trending'],
  },
  {
    icon: FaStore,
    title: 'Shopping',
    description: 'General retail, department stores, online marketplaces, and specialty shops.',
    stores: '3,100+',
    deals: '18,450+',
    tags: ['all', 'popular'],
  },
  {
    icon: FaHeartbeat,
    title: 'Health & Beauty',
    description: 'Skincare, cosmetics, wellness products, and health supplements.',
    stores: '1,450+',
    deals: '9,680+',
    tags: ['all'],
  },
];

const filterOptions: FilterOption[] = [
  { label: 'All Categories', value: 'all' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Trending', value: 'trending' },
];

const Categories: FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredCategories = categories.filter((cat) =>
    cat.tags.includes(activeFilter)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with filters */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">All Categories</h1>
        <div className="flex gap-2">
          {filterOptions.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeFilter === filter.value
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filteredCategories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <div
              key={idx}
              className="border rounded-xl p-6 hover:shadow-md transition-all flex flex-col justify-between h-full"
            >
              <div className="flex flex-col items-center text-center">
                <Icon className="text-purple-600 text-3xl mb-4" />
                <h3 className="text-lg font-semibold text-purple-700 mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-500">{category.description}</p>
                <div className="mt-4 text-xs text-gray-400">
                  <p>{category.stores} Stores</p>
                  <p>{category.deals} Deals</p>
                </div>
              </div>
              <div className="mt-6 flex gap-2 justify-center">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700">
                  Browse Deals
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200">
                  View Stores
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
