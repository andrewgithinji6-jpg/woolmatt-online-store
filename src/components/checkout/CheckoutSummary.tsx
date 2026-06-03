'use client';

import React from 'react';
import { FiShoppingBag, FiTruck, FiPercent } from 'react-icons/fi';
import { CartItem } from '@/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import Link from 'next/link';

interface CheckoutSummaryProps {
  items: CartItem[];
  onPlaceOrder: () => void;
  isLoading?: boolean;
  isProcessing?: boolean;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  items,
  onPlaceOrder,
  isLoading = false,
  isProcessing = false,
}) => {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.cartQuantity,
    0
  );

  const deliveryFee = subtotal > 5000 ? 0 : 200;
  const tax = Math.round(subtotal * 0.16);
  const grandTotal = subtotal + deliveryFee + tax;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-lg shadow-card p-6 sticky top-24 h-fit"
    >
      <h2 className="text-2xl font-bold text-woolmatt-dark mb-6 flex items-center gap-2">
        <FiShoppingBag size={24} />
        Order Summary
      </h2>

      {/* Items List */}
      <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-start text-sm">
            <div className="flex-1">
              <p className="font-semibold text-woolmatt-dark truncate">
                {item.name}
              </p>
              <p className="text-gray-600 text-xs">
                Qty: {item.cartQuantity} × KES {item.price.toLocaleString()}
              </p>
            </div>
            <p className="font-bold text-woolmatt-primary whitespace-nowrap ml-2">
              KES {(item.price * item.cartQuantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Calculations */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-700">
          <span className="flex items-center gap-2">
            <FiShoppingBag size={16} />
            Subtotal
          </span>
          <span className="font-semibold">KES {subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span className="flex items-center gap-2">
            <FiTruck size={16} />
            Delivery Fee
          </span>
          <span className="font-semibold">
            {deliveryFee === 0 ? (
              <span className="text-green-600">FREE ✓</span>
            ) : (
              `KES ${deliveryFee}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span className="flex items-center gap-2">
            <FiPercent size={16} />
            VAT (16%)
          </span>
          <span className="font-semibold">KES {tax.toLocaleString()}</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="bg-woolmatt-light rounded-lg p-4 mb-6 border-2 border-woolmatt-primary">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-woolmatt-dark">Total:</span>
          <span className="text-3xl font-bold text-woolmatt-primary">
            KES {grandTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        onClick={onPlaceOrder}
        disabled={isLoading || isProcessing}
        variant="primary"
        size="lg"
        className="w-full mb-3"
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </Button>

      {/* Continue Shopping Link */}
      <Link href="/products">
        <Button variant="outline" size="lg" className="w-full">
          Continue Shopping
        </Button>
      </Link>

      {/* Free Delivery Notice */}
      {deliveryFee > 0 && (
        <p className="text-xs text-gray-600 mt-4 text-center">
          🎁 Free delivery on orders over KES 5,000
        </p>
      )}

      {/* Security Notice */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        🔒 Your payment information is secure and encrypted
      </p>
    </motion.div>
  );
};