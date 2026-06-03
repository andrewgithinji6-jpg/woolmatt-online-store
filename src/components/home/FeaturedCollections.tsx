'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { featuredCollectionsImages } from '@/data/images';

export const FeaturedCollections: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="py-12 md:py-16"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-woolmatt-dark mb-2">
          Featured Collections
        </h2>
        <p className="text-gray-600">Shop our handpicked selections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredCollectionsImages.map((collection, index) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
          >
            <Link href="/products">
              <div className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-card hover:shadow-hover transition">
                {/* Image */}
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${collection.color} opacity-40 group-hover:opacity-30 transition`}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1 group-hover:translate-x-2 transition">
                    {collection.name}
                  </h3>
                  <p className="text-white/90 mb-4">{collection.description}</p>
                  <div className="flex items-center gap-2 text-sm font-bold group-hover:translate-x-2 transition">
                    Shop Now →
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};