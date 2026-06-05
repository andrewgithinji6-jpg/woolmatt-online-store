'use client';

import React from 'react';
import { ProductCard } from './ProductCard';
import { motion } from 'framer-motion';
import { Product } from '@/types';

interface RelatedProductsProps {
  currentProductId: string;
  allProducts: Product[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  allProducts,
}) => {
  const relatedProducts = allProducts
    .filter((p) => p.id !== currentProductId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-12 border-t border-gray-200"
    >
      <h2 className="text-3xl font-bold text-woolmatt-dark mb-8">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </motion.section>
  );
};