'use client';

import React from 'react';
import { categories } from '@/data/products';
import { motion } from 'framer-motion';

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-woolmatt-light">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-woolmatt-dark mb-12 text-center">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`p-6 rounded-lg text-white font-semibold text-lg hover:shadow-hover transition-all duration-300 bg-gradient-to-br ${category.color}`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};