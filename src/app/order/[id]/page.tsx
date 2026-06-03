'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { FiPackage, FiTruck, FiMapPin, FiCheckCircle, FiClock, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { getImageUrl, handleImageError } from '@/utils/imageUtils';

interface Order {
  id: number;
  order_number: string;
  status: string;
  user_name: string;
  user_email: string;
  shipping_address: string;
  shipping_city: string;
  total_amount: number;
  created_at: string;
  estimated_delivery: string;
  delivered_at: string | null;
}

interface OrderItem {
  id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  image_url: string;
  subtotal: number;
}

interface TrackingEvent {
  id: number;
  status: string;
  location: string;
  description: string;
  timestamp: string;
}

interface OrderTrackingPageProps {
  params: {
    id: string;
  };
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [tracking, setTracking] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    fetchOrderData();
  }, [params.id]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);

      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', parseInt(params.id))
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', parseInt(params.id));

      if (!itemsError) {
        setItems(itemsData || []);
      }

      // Fetch tracking
      const { data: trackingData, error: trackingError } = await supabase
        .from('order_tracking')
        .select('*')
        .eq('order_id', parseInt(params.id))
        .order('timestamp', { ascending: false });

      if (!trackingError) {
        setTracking(trackingData || []);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  if (loading) {
    return (
      <main className="min-h-screen bg-woolmatt-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="h-12 w-12 border-4 border-woolmatt-light border-t-woolmatt-primary rounded-full mx-auto"></div>
          </div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-woolmatt-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-woolmatt-dark mb-4">Order Not Found</h1>
          <Link href="/">
            <button className="px-6 py-3 bg-woolmatt-primary text-white rounded-lg hover:bg-blue-900 transition font-bold">
              Back to Home
            </button>
          </Link>
        </div>
      </main>
    );
  }

  const statusSteps = [
    { status: 'confirmed', label: 'Order Confirmed', icon: FiCheckCircle },
    { status: 'processing', label: 'Processing', icon: FiPackage },
    { status: 'dispatched', label: 'Dispatched', icon: FiTruck },
    { status: 'in_transit', label: 'In Transit', icon: FiMapPin },
    { status: 'delivered', label: 'Delivered', icon: FiCheckCircle },
  ];

  const currentStatusIndex = statusSteps.findIndex((s) => s.status === order.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'dispatched':
        return 'bg-purple-500';
      case 'in_transit':
        return 'bg-orange-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-woolmatt-light py-8"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link href="/">
          <button className="flex items-center gap-2 text-woolmatt-primary hover:text-blue-900 font-semibold mb-6">
            <FiArrowLeft size={20} />
            Back to Home
          </button>
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-card p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-woolmatt-dark mb-2">
                Order {order.order_number}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Order Total</p>
              <p className="text-3xl font-bold text-woolmatt-primary">
                KES {order.total_amount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-woolmatt-dark mb-3">Shipping Address</h3>
              <div className="text-gray-700 space-y-1">
                <p>{order.user_name}</p>
                <p>{order.shipping_address}</p>
                <p>{order.shipping_city}</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-woolmatt-dark mb-3">Order Status</h3>
              <div className={`inline-block px-4 py-2 rounded-full text-white font-semibold capitalize ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
              {order.estimated_delivery && (
                <p className="text-gray-600 mt-3 flex items-center gap-2">
                  <FiClock size={16} />
                  Estimated delivery:{' '}
                  {new Date(order.estimated_delivery).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-woolmatt-dark mb-8">Delivery Timeline</h2>

          {/* Visual Timeline */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const Icon = step.icon;

                return (
                  <div key={step.status} className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition ${
                        isCompleted ? getStatusColor(step.status) : 'bg-gray-300'
                      } ${isCurrent ? 'ring-4 ring-offset-2 ring-current' : ''}`}
                    >
                      <Icon size={24} className="text-white" />
                    </motion.div>
                    <p className="text-sm font-semibold text-center text-gray-700 max-w-[80px]">
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Connecting Line */}
            <div className="relative h-1 bg-gray-200 mb-8">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute h-full bg-gradient-to-r from-blue-500 to-green-500"
              />
            </div>
          </div>

          {/* Tracking Events */}
          <h3 className="font-bold text-woolmatt-dark mb-6">Tracking History</h3>
          <div className="space-y-4">
            {tracking.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(event.status)}`}>
                  <FiCheckCircle className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-woolmatt-dark capitalize">{event.status}</p>
                  <p className="text-gray-600">{event.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {event.location} • {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Order Items */}
<div className="bg-white rounded-lg shadow-card p-8">
  <h2 className="text-2xl font-bold text-woolmatt-dark mb-6">Order Items</h2>

  <div className="space-y-4">
    {items.map((item) => (
      <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
        <img
          src={getImageUrl(item.image_url)}
          alt={item.product_name}
          className="w-20 h-20 rounded-lg object-cover bg-woolmatt-light"
          onError={handleImageError}
        />
        <div className="flex-1">
          <h3 className="font-bold text-woolmatt-dark">{item.product_name}</h3>
          <p className="text-gray-600">
            KES {item.product_price.toLocaleString()} x {item.quantity}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-woolmatt-primary">
            KES {item.subtotal.toLocaleString()}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
      </div>
    </motion.main>
  );
}