'use client';

import React from 'react';
import { ProductCard } from './ProductCard';
import { motion } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  discount: number;
  image_url: string;
  rating: number;
  reviews: number;
  in_stock: boolean;
  category_id: number;
}

interface RelatedProductsProps {
  currentProductId: number;
  allProducts: Product[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  allProducts,
}) => {
  // Get 4 random related products (excluding current)
  const relatedProducts = allProducts
    .filter((p) => p.id !== currentProductId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

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