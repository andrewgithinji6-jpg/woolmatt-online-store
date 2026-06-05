'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';

interface ProductSpecsProps {
  inStock: boolean;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ inStock: _inStock }) => {
  const specs = [
    {
      icon: FiCheck,
      title: 'Quality Assured',
      description: 'All products are carefully selected',
    },
    {
      icon: FiTruck,
      title: 'Fast Delivery',
      description: 'Delivery within 24-48 hours in Nakuru',
    },
    {
      icon: FiRefreshCw,
      title: 'Easy Returns',
      description: '7-day return policy on all items',
    },
    {
      icon: FiShield,
      title: 'Secure Payment',
      description: 'Safe and secure payment methods',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {specs.map((spec, index) => {
        const Icon = spec.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="bg-woolmatt-light rounded-lg p-4 text-center"
          >
            <Icon className="w-8 h-8 mx-auto text-woolmatt-primary mb-3" />
            <p className="font-bold text-sm text-woolmatt-dark mb-1">
              {spec.title}
            </p>
            <p className="text-xs text-gray-600">{spec.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
};