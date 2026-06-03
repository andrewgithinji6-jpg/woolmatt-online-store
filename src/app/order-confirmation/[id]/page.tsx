'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiTruck, FiDollarSign } from 'react-icons/fi';
import Link from 'next/link';

interface OrderConfirmationPageProps {
  params: {
    id: string;
  };
}

export default function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);

    // Fetch order from localStorage
    const orders = JSON.parse(localStorage.getItem('woolmatt-orders') || '[]');
    const foundOrder = orders.find((o: any) => o.id === params.id);
    setOrder(foundOrder);
  }, [params.id]);

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-woolmatt-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="h-12 w-12 border-4 border-woolmatt-light border-t-woolmatt-primary rounded-full mx-auto"></div>
          </div>
          <p className="text-gray-600">Loading order confirmation...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-woolmatt-light flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-woolmatt-dark mb-4">
            Order Not Found
          </h1>
          <Link href="/">
            <button className="px-8 py-3 bg-woolmatt-primary text-white rounded-lg font-bold hover:bg-blue-900 transition">
              Back to Home
            </button>
          </Link>
        </div>
      </main>
    );
  }

  const grandTotal = order.subtotal + order.deliveryFee + order.tax;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-woolmatt-light py-8"
    >
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-6">
            <FiCheckCircle size={80} className="text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-woolmatt-dark mb-2">
            Order Confirmed! 🎉
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-lg shadow-card p-8 mb-8"
        >
          {/* Order ID and Date */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-lg font-bold text-woolmatt-dark">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="text-lg font-bold text-woolmatt-dark">
                  {new Date(order.createdAt).toLocaleDateString('en-KE')}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-woolmatt-dark mb-4 flex items-center gap-2">
              <FiTruck className="text-woolmatt-primary" />
              Delivery Information
            </h2>
            <div className="bg-woolmatt-light rounded-lg p-4 space-y-2">
              <p>
                <strong>Name:</strong> {order.address.firstName} {order.address.lastName}
              </p>
              <p>
                <strong>Address:</strong> {order.address.streetAddress}, {order.address.city}{' '}
                {order.address.postalCode}
              </p>
              <p>
                <strong>Phone:</strong> {order.address.phone}
              </p>
              <p>
                <strong>Email:</strong> {order.address.email}
              </p>
            </div>
          </div>

          {/* Items Ordered */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-woolmatt-dark mb-4 flex items-center gap-2">
              <FiPackage className="text-woolmatt-primary" />
              Items Ordered
            </h2>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-woolmatt-light rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-woolmatt-dark">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.cartQuantity} × KES {item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-bold text-woolmatt-primary">
                    KES {(item.price * item.cartQuantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-woolmatt-dark mb-4 flex items-center gap-2">
              <FiDollarSign className="text-woolmatt-primary" />
              Order Summary
            </h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>KES {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee:</span>
                <span>
                  {order.deliveryFee === 0 ? (
                    <span className="text-green-600">FREE ✓</span>
                  ) : (
                    `KES ${order.deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>VAT (16%):</span>
                <span>KES {order.tax.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-woolmatt-light rounded-lg p-4 flex justify-between items-center">
              <span className="text-lg font-bold text-woolmatt-dark">Total:</span>
              <span className="text-2xl font-bold text-woolmatt-primary">
                KES {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Payment Method:</strong> {order.paymentMethod.replace('-', ' ').toUpperCase()}
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products">
            <button className="w-full px-6 py-3 bg-woolmatt-primary text-white rounded-lg font-bold hover:bg-blue-900 transition">
              Continue Shopping
            </button>
          </Link>
          <Link href="/">
            <button className="w-full px-6 py-3 border-2 border-woolmatt-primary text-woolmatt-primary rounded-lg font-bold hover:bg-woolmatt-light transition">
              Back to Home
            </button>
          </Link>
        </div>

        {/* Support Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 text-center p-6 bg-white rounded-lg shadow-card"
        >
          <p className="text-gray-600 mb-2">
            A confirmation email has been sent to <strong>{order.address.email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Your order will be delivered within 24-48 hours. You will receive a tracking number via SMS.
          </p>
        </motion.div>
      </div>
    </motion.main>
  );
}