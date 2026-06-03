'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';
import { ProductCard } from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import Link from 'next/link';

export const BestSellers: React.FC = () => {
  const { products, loading } = useProducts();

  // Get best sellers (products with highest reviews)
  const bestSellers = products
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 8);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="animate-spin">
            <div className="h-12 w-12 border-4 border-woolmatt-light border-t-woolmatt-primary rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="py-12 md:py-16"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-woolmatt-primary rounded-full">
            <FiTrendingUp size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-woolmatt-dark">Best Sellers</h2>
            <p className="text-gray-600">Our customers' favorite picks</p>
          </div>
        </div>

        <Link href="/products">
          <button className="hidden md:flex items-center gap-2 px-6 py-2 border-2 border-woolmatt-primary text-woolmatt-primary rounded-lg hover:bg-woolmatt-light transition font-bold">
            View All →
          </button>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {bestSellers.length > 0 ? (
          bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">No products available</p>
          </div>
        )}
      </div>

      {/* Mobile View All Button */}
      <div className="text-center md:hidden">
        <Link href="/products">
          <button className="px-8 py-3 bg-woolmatt-primary text-white rounded-lg font-bold hover:bg-blue-900 transition">
            View All Best Sellers
          </button>
        </Link>
      </div>
    </motion.section>
  );
};