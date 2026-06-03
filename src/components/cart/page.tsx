'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { motion } from 'framer-motion';

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setIsMounted(true);
    // Scroll to top when cart page loads
    window.scrollTo(0, 0);
  }, []);

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-woolmatt-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="h-12 w-12 border-4 border-woolmatt-light border-t-woolmatt-primary rounded-full mx-auto"></div>
          </div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-woolmatt-light"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-woolmatt-dark mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {items.length === 0
              ? 'Your cart is empty'
              : `${items.length} item${items.length !== 1 ? 's' : ''} in your cart`}
          </p>
        </div>

        {/* Main Content */}
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-card overflow-hidden">
                {/* Header */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-4 bg-woolmatt-light border-b border-gray-200 font-bold text-gray-700">
                  <div className="col-span-3">Product</div>
                  <div className="col-span-3">Price</div>
                  <div className="col-span-3">Quantity</div>
                  <div className="col-span-2">Total</div>
                  <div className="col-span-1">Action</div>
                </div>

                {/* Cart Items List */}
                <div>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Promotional Banner */}
              <div className="mt-6 bg-gradient-to-r from-woolmatt-primary to-blue-700 text-white rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">💝 Special Offer</h3>
                <p>Free delivery on all orders over KES 5,000!</p>
              </div>
            </div>

            {/* Cart Summary Sidebar */}
            <div>
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </motion.main>
  );
}