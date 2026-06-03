'use client';

import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { useFilterStore } from '@/store/filterStore';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    sort: true,
  });

  const {
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    resetFilters,
  } = useFilterStore();

  // Fetch categories from Supabase
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (!error && data) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (value: number, position: 'min' | 'max') => {
    if (position === 'min') {
      setPriceRange([Math.min(value, priceRange[1]), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], Math.max(value, priceRange[0])]);
    }
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Sort By */}
      <div>
        <button
          onClick={() => toggleSection('sort')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-bold text-woolmatt-dark">Sort By</h3>
          <motion.div
            animate={{ rotate: expandedSections.sort ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronDown size={20} />
          </motion.div>
        </button>

        <AnimatePresence>
          {expandedSections.sort && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              {['relevance', 'price-low', 'price-high', 'rating', 'newest'].map(
                (option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value={option}
                      checked={sortBy === option}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value as
                            | 'relevance'
                            | 'price-low'
                            | 'price-high'
                            | 'rating'
                            | 'newest'
                        )
                      }
                      className="w-4 h-4 accent-woolmatt-primary"
                    />
                    <span className="text-gray-700 capitalize text-sm">
                      {option.replace('-', ' ')}
                    </span>
                  </label>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Filter */}
      <div>
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-bold text-woolmatt-dark">Category</h3>
          <motion.div
            animate={{ rotate: expandedSections.category ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronDown size={20} />
          </motion.div>
        </button>

        <AnimatePresence>
          {expandedSections.category && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className={`block w-full text-left px-3 py-2 rounded transition text-sm ${
                  selectedCategory === null
                    ? 'bg-woolmatt-primary text-white'
                    : 'hover:bg-woolmatt-light'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`block w-full text-left px-3 py-2 rounded transition text-sm ${
                    selectedCategory === category.name
                      ? 'bg-woolmatt-primary text-white'
                      : 'hover:bg-woolmatt-light'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range Filter */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-bold text-woolmatt-dark">Price Range</h3>
          <motion.div
            animate={{ rotate: expandedSections.price ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronDown size={20} />
          </motion.div>
        </button>

        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div>
                <label className="text-sm text-gray-600 block mb-2">
                  Min: KES {priceRange[0].toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value), 'min')}
                  className="w-full accent-woolmatt-primary cursor-pointer"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-2">
                  Max: KES {priceRange[1].toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value), 'max')}
                  className="w-full accent-woolmatt-primary cursor-pointer"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rating Filter */}
      <div>
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-bold text-woolmatt-dark">Rating</h3>
          <motion.div
            animate={{ rotate: expandedSections.rating ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronDown size={20} />
          </motion.div>
        </button>

        <AnimatePresence>
          {expandedSections.rating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === rating}
                    onChange={() => setMinRating(rating)}
                    className="w-4 h-4 accent-woolmatt-primary cursor-pointer"
                  />
                  <span className="flex text-yellow-400 text-sm">
                    {'⭐'.repeat(rating)}
                  </span>
                  <span className="text-gray-700 text-sm">& up</span>
                </label>
              ))}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === 0}
                  onChange={() => setMinRating(0)}
                  className="w-4 h-4 accent-woolmatt-primary cursor-pointer"
                />
                <span className="text-gray-700 text-sm">All Ratings</span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reset Filters */}
      <button
        onClick={resetFilters}
        className="w-full py-3 bg-woolmatt-light text-woolmatt-primary font-bold rounded-lg hover:bg-gray-300 transition"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay - Only show when filter is open on mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Responsive positioning */}
      <motion.div
        initial={isOpen ? { x: '-100%' } : { x: 0 }}
        animate={isOpen ? { x: 0 } : { x: '-100%' }}
        transition={{ duration: 0.3 }}
        className="fixed md:relative md:translate-x-0 left-0 top-0 h-screen md:h-auto w-64 md:w-full bg-white shadow-lg md:shadow-none overflow-y-auto z-50 md:z-0 p-6 md:p-0"
      >
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 hover:bg-woolmatt-light rounded"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold text-woolmatt-dark mb-6 md:mb-4 pt-10 md:pt-0">
          Filters
        </h2>
        {sidebarContent}
      </motion.div>
    </>
  );
};