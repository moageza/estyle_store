import type { CartItem, Lang, Product } from '@/types';
import { PRODUCTS, getProductById } from '@/data/products';
import { tr } from '@/data/translations';

export const formatPrice = (price: number, lang: Lang): string => {
  const formatted = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(price);
  return lang === 'ar' ? `${formatted} ${tr('currency', lang)}` : `${tr('currency', lang)} ${formatted}`;
};

export const cartSubtotal = (cart: CartItem[], products: Product[] = PRODUCTS): number =>
  cart.reduce((sum, item) => {
    const p = products.find((pr) => pr.id === item.productId);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

export const shippingCost = (subtotal: number): number => (subtotal >= 500 || subtotal === 0 ? 0 : 30);

export const cartTotal = (cart: CartItem[], products: Product[] = PRODUCTS): number =>
  cartSubtotal(cart, products) + shippingCost(cartSubtotal(cart, products));

export const getRelatedProducts = (
  product: Product,
  products: Product[] = PRODUCTS,
  limit = 4,
): Product[] =>
  products
    .filter(
      (p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender),
    )
    .slice(0, limit);

export const newArrivals = (products: Product[] = PRODUCTS): Product[] =>
  products.filter((p) => p.isNew);

export const trendingProducts = (products: Product[] = PRODUCTS): Product[] =>
  products.filter((p) => p.isTrending);

export const findProductById = (id: number, products: Product[] = PRODUCTS): Product | undefined =>
  products.find((p) => p.id === id) ?? getProductById(id);

export const colorNameLabel = (name: string, lang: Lang): string => {
  const key = `color${name.charAt(0).toUpperCase() + name.slice(1)}`;
  const entry = tr(key, lang);
  return entry === key ? name : entry;
};
