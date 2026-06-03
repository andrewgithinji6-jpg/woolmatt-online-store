'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useFilterStore } from '@/store/filterStore';
import { categories } from '@/data/products';

export const QuickCategories: React.FC = () => {
  const { setSelectedCategory } = useFilterStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="py-8 md:py-12"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-woolmatt-dark mb-2">
          Shop by Category
        </h2>
        <p className="text-gray-600">Browse our most popular categories</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/products">
              <div
                onClick={() => setSelectedCategory(category.name)}
                className="bg-white rounded-xl shadow-card hover:shadow-hover p-6 text-center cursor-pointer transition group"
              >
                {/* Icon Background */}
                <div className="bg-woolmatt-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-woolmatt-primary transition">
                  <span className="text-3xl group-hover:scale-125 transition">
                    {category.icon}
                  </span>
                </div>

                {/* Category Name */}
                <h3 className="font-bold text-woolmatt-dark group-hover:text-woolmatt-primary transition text-sm">
                  {category.name}
                </h3>

                {/* Item Count */}
                <p className="text-xs text-gray-500 mt-2">
                  {Math.floor(Math.random() * 50) + 20} items
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};