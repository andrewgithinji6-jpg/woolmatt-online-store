'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useFilterStore } from '@/store/filterStore';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const cartItems = useCartStore((state) => state.getTotalItems());
  const { setSearchQuery } = useFilterStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      // Navigate to products page with search
      window.location.href = '/products';
    }
  };

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/woolmatt-logo.png"
                alt="Woolmatt Supermarket Logo"
                width={50}
                height={50}
                priority
                className="object-contain"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-woolmatt-primary">Woolmatt</h1>
                <p className="text-xs text-gray-500">Supermarket</p>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <Link href="/cart" className="relative p-2 hover:bg-woolmatt-light rounded-lg transition">
                <FiShoppingCart size={24} className="text-woolmatt-primary" />
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition flex-shrink-0">
            <Image
              src="/images/woolmatt-logo.png"
              alt="Woolmatt Supermarket Logo"
              width={50}
              height={50}
              priority
              className="object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-woolmatt-primary">Woolmatt</h1>
              <p className="text-xs text-gray-500">Supermarket</p>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 mx-8">
            <div className="w-full flex items-center bg-woolmatt-light rounded-lg px-4 focus-within:ring-2 focus-within:ring-woolmatt-primary transition">
              <FiSearch className="text-gray-400 flex-shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent py-2 px-3 outline-none"
              />
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 hover:bg-woolmatt-light rounded-lg transition">
              <FiShoppingCart size={24} className="text-woolmatt-primary" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-woolmatt-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {cartItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-woolmatt-light rounded-lg transition"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearchSubmit} className="md:hidden mt-3">
          <div className="w-full flex items-center bg-woolmatt-light rounded-lg px-4 focus-within:ring-2 focus-within:ring-woolmatt-primary transition">
            <FiSearch className="text-gray-400 flex-shrink-0" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent py-2 px-3 outline-none text-sm"
            />
          </div>
        </form>
      </div>
    </header>
  );
};