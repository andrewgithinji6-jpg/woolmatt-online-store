'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/store/cartStore';
import { ProductReviews } from '@/components/products/ProductReviews';
import { RelatedProducts } from '@/components/products/RelatedProducts';
import { ProductSpecs } from '@/components/products/ProductSpecs';
import { Button } from '@/components/common/Button';
import { motion } from 'framer-motion';
import { FiHeart, FiShare2, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { getImageUrl } from '@/hooks/useProducts';
import { handleImageError } from '@/utils/imageUtils';
import { Product } from '@/types';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
  try {
    setLoading(true);

    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', parseInt(params.id))
      .single();

    if (productError) {
      console.error('Error fetching product:', productError);
      setProduct(null);
      return;
    }

    const { data: allProductsData, error: allError } = await supabase
      .from('products')
      .select('*');

    if (!allError && allProductsData) {
      const mappedAll: Product[] = allProductsData.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        description: p.description ?? '',
        price: p.price,
        originalPrice: p.original_price ?? undefined,
        image: p.image_url ?? '',
        category: String(p.category_id ?? ''),
        rating: p.rating ?? 0,
        reviews: p.reviews ?? 0,
        inStock: p.in_stock ?? true,
        discount: p.discount ?? undefined,
      }));
      setAllProducts(mappedAll);
    }

    const mapped: Product = {
      id: String(productData.id),
      name: productData.name,
      description: productData.description ?? '',
      price: productData.price,
      originalPrice: productData.original_price ?? undefined,
      image: productData.image_url ?? '',
      category: String(productData.category_id ?? ''),
      rating: productData.rating ?? 0,
      reviews: productData.reviews ?? 0,
      inStock: productData.in_stock ?? true,
      discount: productData.discount ?? undefined,
    };

    setProduct(mapped);
  } catch (error) {
    console.error('Error:', error);
    setProduct(null);
  } finally {
    setLoading(false);
  }
};

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-woolmatt-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="h-12 w-12 border-4 border-woolmatt-light border-t-woolmatt-primary rounded-full mx-auto"></div>
          </div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-woolmatt-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="h-12 w-12 border-4 border-woolmatt-light border-t-woolmatt-primary rounded-full mx-auto"></div>
          </div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-woolmatt-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-woolmatt-dark mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setQuantity(1);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discountPercentage = product.discount || 0;
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-woolmatt-primary">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-woolmatt-primary"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-woolmatt-primary font-semibold">
            {product.name}
          </span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.4 }}
>
  <div className="relative bg-woolmatt-light rounded-lg overflow-hidden aspect-square flex items-center justify-center">
    <img
      src={getImageUrl(product.image)}
      alt={product.name}
      className="w-full h-full object-cover"
      onError={handleImageError}
    />
  </div>
</motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col"
          >
            {/* Category & Stock */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-woolmatt-secondary uppercase">
                  Product
                </span>
                {product.inStock ? (
                  <span className="text-sm font-semibold text-green-600">
                    ✓ In Stock
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-red-600">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-woolmatt-dark mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-yellow-400 text-xl">
                {'⭐'.repeat(Math.floor(product.rating))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6 text-lg">
              {product.description}
            </p>

            {/* Price Section */}
            <div className="bg-woolmatt-light rounded-lg p-6 mb-6">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-4xl font-bold text-woolmatt-primary">
                  KES {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    KES {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {discountPercentage > 0 && (
                <div className="flex items-center gap-3">
                  <span className="bg-woolmatt-secondary text-white px-3 py-1 rounded-full text-sm font-bold">
                    Save {discountPercentage}%
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    You save KES {savings.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-woolmatt-dark mb-3">
                  Quantity
                </p>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-woolmatt-light transition"
                  >
                    <FiMinus size={18} />
                  </button>
                  <span className="px-6 font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-woolmatt-light transition"
                  >
                    <FiPlus size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                variant="primary"
                size="lg"
                className="flex-1"
              >
                <FiShoppingCart size={20} />
                {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
              </Button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="px-6 py-3 border-2 border-woolmatt-primary text-woolmatt-primary rounded-lg hover:bg-woolmatt-light transition font-semibold"
              >
                <FiHeart
                  size={20}
                  className={
                    isFavorite ? 'fill-woolmatt-secondary' : 'fill-none'
                  }
                />
              </button>
              <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-woolmatt-primary transition">
                <FiShare2 size={20} />
              </button>
            </div>

            {/* Product Specs */}
            <ProductSpecs inStock={product.inStock} />
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <ProductReviews
            rating={product.rating}
            totalReviews={product.reviews}
          />
        </div>

        {/* Related Products */}
        {allProducts.length > 0 && (
          <RelatedProducts
            currentProductId={product.id}
            allProducts={allProducts}
          />
        )}
      </div>
    </motion.main>
  );
}