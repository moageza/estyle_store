import { createContext, useContext, type ReactNode } from 'react';
import { useProducts } from '@/lib/useProducts';
import type { Product } from '@/types';

interface ProductsContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const value = useProducts();
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProductsContext(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProductsContext must be used within ProductsProvider');
  return ctx;
}
