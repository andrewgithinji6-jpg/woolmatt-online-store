'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { products } from '@/data/products';
import { useFilterStore } from '@/store/filterStore';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const SearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof products>([]);
  const [localQuery, setLocalQuery] = useState('');
  const { setSearchQuery } = useFilterStore();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setLocalQuery(query);
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
    setIsOpen(true);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = () => {
    setIsOpen(false);
    setLocalQuery('');
    setSuggestions([]);
  };

  return (
    <div ref={searchRef} className="w-full">
      <div className="flex items-center bg-white border-2 border-woolmatt-light rounded-lg px-3 py-2 focus-within:border-woolmatt-primary transition">
        <FiSearch className="text-gray-400 flex-shrink-0" size={20} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={localQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => localQuery.length > 0 && setIsOpen(true)}
          className="w-full bg-transparent py-2 px-3 outline-none text-gray-800 text-sm sm:text-base"
        />
        {localQuery && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
            aria-label="Clear search"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto w-full"
        >
          {suggestions.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div
                onClick={handleSuggestionClick}
                className="flex items-center gap-3 p-3 hover:bg-woolmatt-light transition cursor-pointer border-b last:border-b-0"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-woolmatt-dark truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-500">{product.category}</p>
                    <p className="text-xs font-bold text-woolmatt-primary">
                      KES {product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      )}

      {/* No results message */}
      {isOpen && localQuery && suggestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50 text-center"
        >
          <p className="text-gray-600 text-sm">
            No products found for "{localQuery}"
          </p>
        </motion.div>
      )}
    </div>
  );
};