'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HeroBanner } from '@/components/home/HeroBanner';
import { QuickCategories } from '@/components/home/QuickCategories';
import { FlashDeals } from '@/components/home/FlashDeals';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { BestSellers } from '@/components/home/BestSellers';
import { PromoBanner } from '@/components/home/PromoBanner';
import { Newsletter } from '@/components/home/Newsletter';

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16">
        <HeroBanner />
        <QuickCategories />
        <PromoBanner />
        <FlashDeals />
        <FeaturedCollections />
        <BestSellers />
        <Newsletter />
      </div>
    </motion.main>
  );
}