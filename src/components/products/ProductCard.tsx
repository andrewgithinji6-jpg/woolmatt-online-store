'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { Button } from '@/components/common/Button';
import { useCartStore } from '@/store/cartStore';
import { getImageUrl, handleImageError } from '@/utils/imageUtils';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  discount: number;
  image_url: string;
  rating: number;
  reviews: number;
  in_stock: boolean;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const discountPercentage = product.discount || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, quantity);
    setQuantity(1);
  };

  const imageUrl = getImageUrl(product.image_url);

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group bg-white rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer h-full">
        {/* Image Container */}
        <div className="relative h-48 bg-woolmatt-light overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={handleImageError}
          />

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 right-3 bg-woolmatt-secondary text-white px-3 py-1 rounded-full text-sm font-bold">
              -{discountPercentage}%
            </div>
          )}

          {/* Stock Status */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                Out of Stock
              </span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:bg-woolmatt-light transition"
          >
            <FiHeart
              size={20}
              className={
                isFavorite
                  ? 'fill-woolmatt-secondary text-woolmatt-secondary'
                  : 'text-gray-400'
              }
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
            Product
          </p>

          {/* Product Name */}
          <h3 className="font-bold text-gray-800 text-base mb-2 line-clamp-2 group-hover:text-woolmatt-primary">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400">
              {'⭐'.repeat(Math.floor(product.rating))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-bold text-woolmatt-primary">
              KES {product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <span className="text-sm text-gray-400 line-through">
                KES {product.original_price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.in_stock && (
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setQuantity(Math.max(1, quantity - 1));
                }}
                className="px-3 py-1 bg-woolmatt-light rounded hover:bg-gray-300"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setQuantity(quantity + 1);
                }}
                className="px-3 py-1 bg-woolmatt-light rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            variant="primary"
            size="md"
            className="w-full"
          >
            <FiShoppingCart size={18} />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};