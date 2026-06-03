'use client';

import React from 'react';
import { products } from '@/data/products';
import { ProductGrid } from '@/components/products/ProductGrid';

export const FeaturedProducts: React.FC = () => {
  // Get products with discounts for featured section
  const featuredProducts = products.filter(p => p.discount).slice(0, 8);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-woolmatt-dark">
            🔥 Hot Deals
          </h2>
          <a href="#" className="text-woolmatt-secondary font-semibold hover:underline">
            View All →
          </a>
        </div>

        <ProductGrid products={featuredProducts} />
      </div>
    </section>
  );
};