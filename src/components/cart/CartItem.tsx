'use client';

import React from 'react';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCartStore, CartItem as CartItemType } from '@/store/cartStore';
import { getImageUrl, handleImageError } from '@/utils/imageUtils';
import Link from 'next/link';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();
  const fullImageUrl = getImageUrl(item.image);

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200 last:border-0">
      <Link href={`/product/${item.id}`}>
        <div className="w-20 h-20 bg-woolmatt-light rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={fullImageUrl}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition cursor-pointer"
            onError={handleImageError}
          />
        </div>
      </Link>

      <div className="flex-1">
        <Link href={`/product/${item.id}`}>
          <h3 className="font-bold text-woolmatt-dark hover:text-woolmatt-primary transition">
            {item.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mt-1">KES {item.price.toLocaleString()} each</p>
        {!item.inStock && (
          <p className="text-xs text-red-600 font-semibold mt-1">Out of Stock</p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
            className="p-1 hover:bg-woolmatt-light rounded transition"
            disabled={!item.inStock}
          >
            <FiMinus size={16} />
          </button>
          <span className="w-8 text-center font-semibold">{item.cartQuantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
            className="p-1 hover:bg-woolmatt-light rounded transition"
            disabled={!item.inStock}
          >
            <FiPlus size={16} />
          </button>
        </div>
      </div>

      <div className="text-right flex flex-col justify-between">
        <p className="text-lg font-bold text-woolmatt-primary">
          KES {(item.price * item.cartQuantity).toLocaleString()}
        </p>
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition self-end"
          title="Remove from cart"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};