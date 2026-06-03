'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ImageGalleryProps {
  mainImage: string;
  productName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  mainImage,
  productName,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of images - in real app, this would come from product data
  const images = [mainImage, mainImage, mainImage, mainImage];

  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={currentImageIndex}
        className="relative bg-woolmatt-light rounded-lg overflow-hidden aspect-square flex items-center justify-center"
      >
        <img
          src={images[currentImageIndex]}
          alt={productName}
          className="w-full h-full object-cover"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
              aria-label="Previous image"
            >
              <FiChevronLeft size={24} className="text-woolmatt-primary" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
              aria-label="Next image"
            >
              <FiChevronRight size={24} className="text-woolmatt-primary" />
            </button>
          </>
        )}
      </motion.div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                index === currentImageIndex
                  ? 'border-woolmatt-primary'
                  : 'border-gray-300 hover:border-woolmatt-primary'
              }`}
            >
              <img src={image} alt={`${productName} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};