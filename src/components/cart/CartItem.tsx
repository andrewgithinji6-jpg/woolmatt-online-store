'use client';

import React from 'react';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { getImageUrl, handleImageError } from '@/utils/imageUtils';
import Link from 'next/link';

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  image_url: string;
  cartQuantity: number;
  in_stock: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  image_url,
  cartQuantity,
  in_stock,
}) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  const fullImageUrl = getImageUrl(image_url);

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200 last:border-0">
      {/* Product Image */}
      <Link href={`/product/${id}`}>
        <div className="w-20 h-20 bg-woolmatt-light rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={fullImageUrl}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition cursor-pointer"
            onError={handleImageError}
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1">
        <Link href={`/product/${id}`}>
          <h3 className="font-bold text-woolmatt-dark hover:text-woolmatt-primary transition">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-sm text-gray-600 mt-1">
          KES {price.toLocaleString()} each
        </p>

        {/* Stock Status */}
        {!in_stock && (
          <p className="text-xs text-red-600 font-semibold mt-1">
            Out of Stock
          </p>
        )}

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => updateQuantity(id, cartQuantity - 1)}
            className="p-1 hover:bg-woolmatt-light rounded transition"
            disabled={!in_stock}
          >
            <FiMinus size={16} />
          </button>
          <span className="w-8 text-center font-semibold">{cartQuantity}</span>
          <button
            onClick={() => updateQuantity(id, cartQuantity + 1)}
            className="p-1 hover:bg-woolmatt-light rounded transition"
            disabled={!in_stock}
          >
            <FiPlus size={16} />
          </button>
        </div>
      </div>

      {/* Total Price */}
      <div className="text-right flex flex-col justify-between">
        <p className="text-lg font-bold text-woolmatt-primary">
          KES {(price * cartQuantity).toLocaleString()}
        </p>

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition self-end"
          title="Remove from cart"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};