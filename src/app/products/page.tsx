'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { useFilterStore } from '@/store/filterStore';
import { ProductGrid } from '@/components/products/ProductGrid';
import { FilterSidebar } from '@/components/search/FilterSidebar';
import { SearchBar } from '@/components/search/SearchBar';
import { motion } from 'framer-motion';
import { Product } from '@/types';  // ← use the global type

export default function ProductsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    searchQuery,
    selectedCategory,
    priceRange,
    minRating,
    sortBy,
    resetFilters,
  } = useFilterStore();

  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      setAllProducts([]);
    } else {
      const mapped: Product[] = (data || []).map((p: any) => ({
        id: String(p.id),
        name: p.name,
        description: p.description ?? '',
        price: p.price,
        originalPrice: p.original_price ?? undefined,
        image: p.image_url ?? '',
        category: String(p.category_id ?? ''),
        rating: p.rating ?? 0,
        reviews: p.reviews ?? 0,
        inStock: p.in_stock ?? true,
        discount: p.discount ?? undefined,
      }));
      setAllProducts(mapped);
    }
  } catch (err) {
    console.error('Error:', err);
    setAllProducts([]);
  } finally {
    setLoading(false);
  }
};

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      // Search filter
      const matchesSearch =
        searchQuery.length === 0 ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter - match by category_id instead of name
      const matchesCategory =
  !selectedCategory ||
  product.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
  product.name.toLowerCase().includes(selectedCategory.toLowerCase());

      // Price filter
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      // Rating filter
      const matchesRating = product.rating >= minRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.reverse();
        break;
      case 'relevance':
      default:
        break;
    }

    return filtered;
  }, [allProducts, searchQuery, selectedCategory, priceRange, minRating, sortBy]);

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-woolmatt-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="h-12 w-12 border-4 border-woolmatt-light border-t-woolmatt-primary rounded-full mx-auto"></div>
          </div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </main>
    );
  }

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery ||
    selectedCategory ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 50000 ||
    minRating !== 0 ||
    sortBy !== 'relevance';

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-woolmatt-light"
    >
      {/* Search Header */}
      <div className="bg-white shadow-md sticky top-16 z-40 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden p-2 hover:bg-woolmatt-light rounded-lg transition flex-shrink-0"
              aria-label="Toggle filters"
            >
              {isFilterOpen ? (
                <FiX size={24} className="text-woolmatt-primary" />
              ) : (
                <FiFilter size={24} className="text-woolmatt-primary" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Desktop Sidebar - Only show on md and above */}
          <div className="hidden md:block md:col-span-1">
            <div className="sticky top-32">
              <FilterSidebar isOpen={true} onClose={() => {}} />
            </div>
          </div>

          {/* Mobile Filter Sidebar - Only show on mobile */}
          {isFilterOpen && (
            <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
          )}

          {/* Products Grid */}
          <div className="md:col-span-3">
            {/* Results Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-woolmatt-dark">
                  Products
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {searchQuery && `Search: "${searchQuery}" - `}
                  Showing {filteredProducts.length} result
                  {filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Active Filters Badge */}
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    resetFilters();
                    setIsFilterOpen(false);
                  }}
                  className="px-4 py-2 bg-woolmatt-secondary text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition whitespace-nowrap"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Products Grid or Empty State */}
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-woolmatt-dark mb-2">
                  No Products Found
                </h2>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    resetFilters();
                    setIsFilterOpen(false);
                  }}
                  className="px-6 py-3 bg-woolmatt-primary text-white rounded-lg hover:bg-blue-900 transition font-semibold"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.main>
  );
}