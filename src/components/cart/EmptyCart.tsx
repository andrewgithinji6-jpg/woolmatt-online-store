'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { FiShoppingCart } from 'react-icons/fi';

export const EmptyCart: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-2xl font-bold text-woolmatt-dark mb-2">
        Your Cart is Empty
      </h2>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        Looks like you haven't added any items yet. Start shopping and find everything you need!
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={() => (window.location.href = '/')}
      >
        <FiShoppingCart size={20} />
        Start Shopping
      </Button>
    </div>
  );
};