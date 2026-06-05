'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

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

        if (fetchError) throw fetchError;

        const mapped: Product[] = (data || []).map((p: any) => ({
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

        setProducts(mapped);
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

export { getImageUrl, handleImageError, PLACEHOLDER_SVG } from '@/utils/imageUtils';