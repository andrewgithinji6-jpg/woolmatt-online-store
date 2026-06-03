'use client';

import React from 'react';
import Link from 'next/link';
import { categories } from '@/data/products';
import { useFilterStore } from '@/store/filterStore';

export const Navigation: React.FC = () => {
  const { setSelectedCategory } = useFilterStore();

  return (
    <nav className="bg-woolmatt-primary text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-8 py-3 whitespace-nowrap">
            <Link href="/products" onClick={() => setSelectedCategory(null)}>
              <button className="hover:text-woolmatt-secondary transition font-semibold">
                🛍️ All Products
              </button>
            </Link>
            {categories.map((category) => (
              <Link key={category.id} href="/products">
                <button
                  onClick={() => setSelectedCategory(category.name)}
                  className="hover:text-woolmatt-secondary transition font-semibold"
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};