'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiGift, FiTruck, FiShield } from 'react-icons/fi';

const promos = [
  {
    icon: FiTruck,
    title: 'Free Delivery',
    description: 'On orders over KES 5,000',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FiGift,
    title: 'Special Offers',
    description: 'Weekly discounts and deals',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FiShield,
    title: 'Secure Payment',
    description: 'Safe & encrypted transactions',
    color: 'from-green-500 to-emerald-500',
  },
];

export const PromoBanner: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {promos.map((promo, index) => {
        const Icon = promo.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className={`bg-gradient-to-br ${promo.color} rounded-2xl p-8 text-white shadow-card hover:shadow-hover transition`}
          >
            <Icon size={48} className="mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
            <p className="text-white/80">{promo.description}</p>
          </motion.div>
        );
      })}
    </motion.section>
  );
};