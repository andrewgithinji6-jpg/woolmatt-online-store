'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { heroBannerImages } from '@/data/images';

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoplay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroBannerImages.length);
    setAutoplay(false);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroBannerImages.length) % heroBannerImages.length
    );
    setAutoplay(false);
  };

  return (
    <div
      className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-xl group"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={heroBannerImages[currentSlide].image}
            alt={heroBannerImages[currentSlide].title}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 max-w-lg">
              {heroBannerImages[currentSlide].title}
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-md">
              {heroBannerImages[currentSlide].subtitle}
            </p>
            <button className="px-8 py-3 bg-woolmatt-primary text-white rounded-lg font-bold hover:bg-blue-900 transition transform hover:scale-105">
              {heroBannerImages[currentSlide].cta}
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition transform hover:scale-110 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <FiChevronLeft size={28} className="text-woolmatt-primary" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition transform hover:scale-110 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <FiChevronRight size={28} className="text-woolmatt-primary" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroBannerImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition ${
              index === currentSlide
                ? 'bg-woolmatt-primary w-8'
                : 'bg-white/50 hover:bg-white/75 w-2'
            }`}
            whileHover={{ scale: 1.2 }}
            style={{ height: '8px' }}
          />
        ))}
      </div>
    </div>
  );
};