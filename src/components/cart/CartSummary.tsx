'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { useCartStore } from '@/store/cartStore';
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';

export const CartSummary: React.FC = () => {
  const { getTotalPrice, getTotalItems, items } = useCartStore();
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const deliveryFee = totalPrice > 5000 ? 0 : 200; // Free delivery over 5000
  const tax = Math.round(totalPrice * 0.16); // 16% VAT
  const grandTotal = totalPrice + deliveryFee + tax;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-woolmatt-light rounded-lg p-6 sticky top-24">
      <h3 className="text-xl font-bold text-woolmatt-dark mb-6">Order Summary</h3>

      {/* Summary Items */}
      <div className="space-y-3 mb-6 pb-6 border-b border-gray-300">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal ({totalItems} items)</span>
          <span className="font-semibold">KES {totalPrice.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Delivery Fee</span>
          <span className="font-semibold">
            {deliveryFee === 0 ? (
              <span className="text-green-600">FREE ✓</span>
            ) : (
              `KES ${deliveryFee}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>VAT (16%)</span>
          <span className="font-semibold">KES {tax.toLocaleString()}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-bold text-woolmatt-dark">Total:</span>
        <span className="text-2xl font-bold text-woolmatt-primary">
          KES {grandTotal.toLocaleString()}
        </span>
      </div>

      <Link href="/checkout">
  <Button variant="primary" size="lg" className="w-full mb-3">
    <FiArrowRight size={20} />
    Proceed to Checkout
  </Button>
</Link>

      {/* Continue Shopping */}
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => (window.location.href = '/')}
      >
        <FiShoppingBag size={20} />
        Continue Shopping
      </Button>

      {/* Free Delivery Notice */}
      {deliveryFee > 0 && (
        <p className="text-xs text-gray-600 mt-4 text-center">
          🎁 Free delivery on orders over KES 5,000
        </p>
      )}
    </div>
  );
};