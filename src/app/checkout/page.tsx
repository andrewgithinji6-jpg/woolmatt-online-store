'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'card' | 'mpesa' | 'paypal';
}

export default function CheckoutPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'review' | 'confirmation'>(
    'shipping'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
  });

  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
  }, []);

  if (!isMounted) return null;

  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <main className="min-h-screen bg-woolmatt-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-woolmatt-dark mb-4">
            Your cart is empty
          </h1>
          <Link href="/products">
            <button className="px-6 py-3 bg-woolmatt-primary text-white rounded-lg hover:bg-blue-900 transition font-bold">
              Continue Shopping
            </button>
          </Link>
        </div>
      </main>
    );
  }

  // Calculate totals
  const subtotal = items.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  const deliveryFee = subtotal > 5000 ? 0 : 200;
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + deliveryFee + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateShipping = () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode
    ) {
      setError('Please fill in all shipping details');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleShippingSubmit = () => {
    if (validateShipping()) {
      setCurrentStep('payment');
    }
  };

  const handlePaymentSubmit = async () => {
    setCurrentStep('review');
  };

  const handleConfirmOrder = async () => {
  try {
    setLoading(true);
    setError(null);

    console.log('Starting order creation...');

    // Generate order number
    const newOrderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    console.log('Order number:', newOrderNumber);
    console.log('Creating order with data:', {
      order_number: newOrderNumber,
      user_email: formData.email,
      user_name: formData.fullName,
      user_phone: formData.phone,
      shipping_address: formData.address,
      shipping_city: formData.city,
      shipping_postal_code: formData.postalCode,
      payment_method: formData.paymentMethod,
      payment_status: 'completed',
      status: 'confirmed',
      subtotal: subtotal,
      delivery_fee: deliveryFee,
      tax: tax,
      total_amount: total,
      estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_number: newOrderNumber,
          user_email: formData.email,
          user_name: formData.fullName,
          user_phone: formData.phone,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_postal_code: formData.postalCode,
          payment_method: formData.paymentMethod,
          payment_status: 'completed',
          status: 'confirmed',
          subtotal: Math.round(subtotal * 100) / 100,
          delivery_fee: Math.round(deliveryFee * 100) / 100,
          tax: Math.round(tax * 100) / 100,
          total_amount: Math.round(total * 100) / 100,
          estimated_delivery: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw orderError;
    }

    console.log('Order created successfully:', order);

    // Create order items
    console.log('Creating order items...');
    const orderItems = items.map((item) => ({
  order_id: order.id,
  product_id: item.id,
  product_name: item.name,
  product_price: Math.round(item.price * 100) / 100,
  quantity: item.cartQuantity,
  image_url: item.image,          // ← image_url → image
  subtotal: Math.round(item.price * item.cartQuantity * 100) / 100,
}));

    console.log('Order items:', orderItems);

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      throw itemsError;
    }

    console.log('Order items created successfully');

    // Create initial tracking record
    console.log('Creating tracking record...');
    const { error: trackingError } = await supabase
      .from('order_tracking')
      .insert([
        {
          order_id: order.id,
          status: 'confirmed',
          location: formData.city,
          description: 'Your order has been confirmed',
        },
      ]);

    if (trackingError) {
      console.error('Tracking record creation error:', trackingError);
      throw trackingError;
    }

    console.log('Tracking record created successfully');

    // Clear cart and show confirmation
    clearCart();
    setOrderNumber(newOrderNumber);
    setOrderId(order.id.toString());
    setCurrentStep('confirmation');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
    console.error('Full error object:', err);
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-woolmatt-light py-8"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-woolmatt-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-woolmatt-primary">
            Cart
          </Link>
          <span>/</span>
          <span className="text-woolmatt-primary font-semibold">Checkout</span>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {['shipping', 'payment', 'review', 'confirmation'].map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition ${
                    step === currentStep
                      ? 'bg-woolmatt-primary scale-110'
                      : ['shipping', 'payment', 'review'].includes(step) &&
                          ['shipping', 'payment', 'review', 'confirmation'].indexOf(step) <
                            ['shipping', 'payment', 'review', 'confirmation'].indexOf(currentStep)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                  }`}
                >
                  {['shipping', 'payment', 'review', 'confirmation'].indexOf(step) <
                  ['shipping', 'payment', 'review', 'confirmation'].indexOf(currentStep) ? (
                    <FiCheck size={20} />
                  ) : (
                    index + 1
                  )}
                </motion.div>

                {index < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition ${
                      ['shipping', 'payment', 'review', 'confirmation'].indexOf(step) <
                      ['shipping', 'payment', 'review', 'confirmation'].indexOf(currentStep)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xs text-gray-600">
            <span>Shipping</span>
            <span>Payment</span>
            <span>Review</span>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
              >
                <FiAlertCircle className="text-red-600" size={24} />
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}

            {/* Shipping Step */}
            {currentStep === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white rounded-lg shadow-card p-8 mb-6">
                  <h2 className="text-2xl font-bold text-woolmatt-dark mb-6">
                    Shipping Information
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-woolmatt-dark mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-woolmatt-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-woolmatt-dark mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-woolmatt-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-woolmatt-dark mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+254 712 345 678"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-woolmatt-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-woolmatt-dark mb-2">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="00100"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-woolmatt-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-woolmatt-dark mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street, Apt 4B"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-woolmatt-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-woolmatt-dark mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Nairobi"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-woolmatt-primary"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Link href="/cart">
                      <button className="px-6 py-3 border-2 border-woolmatt-primary text-woolmatt-primary rounded-lg hover:bg-woolmatt-light transition font-semibold flex items-center gap-2">
                        <FiArrowLeft size={20} />
                        Back to Cart
                      </button>
                    </Link>
                    <button
                      onClick={handleShippingSubmit}
                      className="px-8 py-3 bg-woolmatt-primary text-white rounded-lg hover:bg-blue-900 transition font-bold ml-auto"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white rounded-lg shadow-card p-8 mb-6">
                  <h2 className="text-2xl font-bold text-woolmatt-dark mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    {[
                      { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                      { id: 'mpesa', label: 'M-Pesa', icon: '📱' },
                      { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                          formData.paymentMethod === method.id
                            ? 'border-woolmatt-primary bg-blue-50'
                            : 'border-gray-300 hover:border-woolmatt-primary'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-woolmatt-primary"
                        />
                        <span className="text-2xl mx-3">{method.icon}</span>
                        <span className="font-semibold text-woolmatt-dark">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        💳 Card payment integration coming soon. For now, you can proceed with M-Pesa or PayPal.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="px-6 py-3 border-2 border-woolmatt-primary text-woolmatt-primary rounded-lg hover:bg-woolmatt-light transition font-semibold flex items-center gap-2"
                    >
                      <FiArrowLeft size={20} />
                      Back
                    </button>
                    <button
                      onClick={handlePaymentSubmit}
                      className="px-8 py-3 bg-woolmatt-primary text-white rounded-lg hover:bg-blue-900 transition font-bold ml-auto"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Review Step */}
            {currentStep === 'review' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white rounded-lg shadow-card p-8 mb-6">
                  <h2 className="text-2xl font-bold text-woolmatt-dark mb-6">
                    Review Your Order
                  </h2>

                  {/* Shipping Summary */}
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <h3 className="font-bold text-woolmatt-dark mb-4">Shipping Address</h3>
                    <div className="text-gray-700 space-y-1">
                      <p>{formData.fullName}</p>
                      <p>{formData.address}</p>
                      <p>
                        {formData.city} {formData.postalCode}
                      </p>
                      <p>{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <h3 className="font-bold text-woolmatt-dark mb-4">Payment Method</h3>
                    <p className="text-gray-700 capitalize">
                      {formData.paymentMethod === 'card'
                        ? 'Credit/Debit Card'
                        : formData.paymentMethod === 'mpesa'
                          ? 'M-Pesa'
                          : 'PayPal'}
                    </p>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 border-woolmatt-primary text-woolmatt-primary rounded-lg hover:bg-woolmatt-light transition font-semibold flex items-center gap-2"
                    >
                      <FiArrowLeft size={20} />
                      Back
                    </button>
                    <button
                      onClick={handleConfirmOrder}
                      disabled={loading}
                      className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold ml-auto disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Confirm & Place Order'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Confirmation Step */}
            {currentStep === 'confirmation' && orderNumber && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="bg-white rounded-lg shadow-card p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                      <FiCheck size={40} className="text-green-600" />
                    </div>
                  </motion.div>

                  <h2 className="text-3xl font-bold text-woolmatt-dark mb-2">
                    Order Confirmed! 🎉
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your order has been successfully placed.
                  </p>

                  <div className="bg-woolmatt-light rounded-lg p-6 mb-6">
                    <p className="text-sm text-gray-600 mb-1">Order Number</p>
                    <p className="text-2xl font-bold text-woolmatt-primary">{orderNumber}</p>
                  </div>

                  <p className="text-gray-600 mb-8">
                    A confirmation email has been sent to <strong>{formData.email}</strong>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={`/order/${orderId}`} className="flex-1">
                      <button className="w-full px-6 py-3 bg-woolmatt-primary text-white rounded-lg hover:bg-blue-900 transition font-bold">
                        Track Order
                      </button>
                    </Link>
                    <Link href="/" className="flex-1">
                      <button className="w-full px-6 py-3 border-2 border-woolmatt-primary text-woolmatt-primary rounded-lg hover:bg-woolmatt-light transition font-bold">
                        Continue Shopping
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-24 h-fit">
              <h3 className="text-xl font-bold text-woolmatt-dark mb-6">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} <span className="text-gray-500">x{item.cartQuantity}</span>
                    </span>
                    <span className="font-semibold">
                      KES {(item.price * item.cartQuantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">VAT (16%)</span>
                  <span>KES {tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-woolmatt-dark">Total</span>
                  <span className="text-2xl font-bold text-woolmatt-primary">
                    KES {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {deliveryFee > 0 && (
                <p className="text-xs text-gray-600 mt-4 text-center">
                  🎁 Free delivery on orders over KES 5,000
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}