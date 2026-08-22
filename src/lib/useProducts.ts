import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types';
import { PRODUCTS } from '@/data/products';
import { fetchProducts } from '@/lib/api';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dbProducts = await fetchProducts();
      if (dbProducts.length > 0) {
        setProducts(dbProducts);
      } else {
        // DB is empty — fall back to hardcoded data
        setProducts(PRODUCTS);
      }
    } catch (err) {
      console.warn('Supabase fetch failed, using hardcoded products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
      setProducts(PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { products, loading, error, refetch: load };
}
