'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiClock } from 'react-icons/fi';
import { ProductCard } from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import Link from 'next/link';

export const FlashDeals: React.FC = () => {
  const { products, loading } = useProducts();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Get products with discounts
  const flashProducts = products
    .filter((p) => p.discount && p.discount > 0)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 8);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      className="py-12 md:py-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl px-6 md:px-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-woolmatt-secondary rounded-full">
            <FiZap size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-woolmatt-dark">Flash Deals</h2>
            <p className="text-gray-600">Limited time offers - Grab them fast!</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-card"
        >
          <FiClock className="text-woolmatt-secondary" size={24} />
          <div className="flex gap-2 font-bold text-woolmatt-dark">
            <span className="bg-woolmatt-light px-3 py-1 rounded">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span className="bg-woolmatt-light px-3 py-1 rounded">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span className="bg-woolmatt-light px-3 py-1 rounded">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </motion.div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {flashProducts.length > 0 ? (
          flashProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">No flash deals available</p>
          </div>
        )}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <Link href="/products">
          <button className="px-8 py-3 bg-woolmatt-primary text-white rounded-lg font-bold hover:bg-blue-900 transition transform hover:scale-105">
            View All Deals
          </button>
        </Link>
      </div>
    </motion.section>
  );
};