'use client';

import React from 'react';
import { FiCreditCard } from 'react-icons/fi';
import { motion } from 'framer-motion';

export type PaymentMethodType = 'mpesa' | 'card' | 'bank-transfer';

interface PaymentMethodProps {
  selected: PaymentMethodType;
  onChange: (method: PaymentMethodType) => void;
}

const paymentMethods = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    description: 'Pay via M-Pesa on delivery',
    icon: '📱',
  },
  {
    id: 'card',
    name: 'Debit/Credit Card',
    description: 'Visa, Mastercard, or other cards',
    icon: '💳',
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    description: 'Direct bank transfer',
    icon: '🏦',
  },
];

export const PaymentMethod: React.FC<PaymentMethodProps> = ({ selected, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-lg shadow-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <FiCreditCard size={24} className="text-woolmatt-primary" />
        <h2 className="text-2xl font-bold text-woolmatt-dark">Payment Method</h2>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <motion.label
            key={method.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
              selected === method.id
                ? 'border-woolmatt-primary bg-woolmatt-light'
                : 'border-gray-300 hover:border-woolmatt-primary'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selected === method.id}
              onChange={() => onChange(method.id as PaymentMethodType)}
              className="w-4 h-4 accent-woolmatt-primary cursor-pointer"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{method.icon}</span>
                <p className="font-bold text-woolmatt-dark">{method.name}</p>
              </div>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
          </motion.label>
        ))}
      </div>

      {/* M-Pesa Info */}
      {selected === 'mpesa' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <p className="text-sm text-green-800">
            <strong>M-Pesa Payment:</strong> You will receive an M-Pesa prompt on your phone to complete the payment. Your order will be confirmed after payment.
          </p>
        </motion.div>
      )}

      {/* Card Info */}
      {selected === 'card' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p className="text-sm text-blue-800">
            <strong>Card Payment:</strong> You will be redirected to our secure payment gateway to enter your card details.
          </p>
        </motion.div>
      )}

      {/* Bank Transfer Info */}
      {selected === 'bank-transfer' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg"
        >
          <p className="text-sm text-purple-800">
            <strong>Bank Transfer:</strong> We will send you bank details after order confirmation.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};