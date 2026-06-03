'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  discount: number;
  category_id: number;
  rating: number;
  reviews: number;
  in_stock: boolean;
  image_url: string;
  created_at: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        setProducts(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}

// Export the utility functions
export { getImageUrl, handleImageError, PLACEHOLDER_SVG } from '@/utils/imageUtils';