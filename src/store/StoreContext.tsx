import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem, Lang, PlacedOrder, WishlistItem } from '@/types';

interface StoreContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  dir: 'rtl' | 'ltr';
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  updateCartQuantity: (productId: number, size: string, color: string, quantity: number) => void;
  removeFromCart: (productId: number, size: string, color: string) => void;
  clearCart: () => void;
  wishlist: WishlistItem[];
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => void;
  lastOrder: PlacedOrder | null;
  setLastOrder: (o: PlacedOrder | null) => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const CART_KEY = 'estyle_cart';
const WISH_KEY = 'estyle_wishlist';
const LANG_KEY = 'estyle_lang';
const ORDER_KEY = 'estyle_last_order';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => load<Lang>(LANG_KEY, 'ar'));
  const [cart, setCart] = useState<CartItem[]>(() => load<CartItem[]>(CART_KEY, []));
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() =>
    load<WishlistItem[]>(WISH_KEY, []),
  );
  const [lastOrder, setLastOrderState] = useState<PlacedOrder | null>(() =>
    load<PlacedOrder | null>(ORDER_KEY, null),
  );
  const [toast, setToast] = useState<string | null>(null);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem(LANG_KEY, JSON.stringify(lang));
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(ORDER_KEY, JSON.stringify(lastOrder));
  }, [lastOrder]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState((p) => (p === 'ar' ? 'en' : 'ar')), []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout((showToast as unknown as { _t?: number })._t);
    (showToast as unknown as { _t?: number })._t = window.setTimeout(
      () => setToast(null),
      2200,
    );
  }, []);

  const addToCart = useCallback(
    (item: CartItem) => {
      setCart((prev) => {
        const idx = prev.findIndex(
          (i) => i.productId === item.productId && i.size === item.size && i.color === item.color,
        );
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + item.quantity };
          return copy;
        }
        return [...prev, item];
      });
    },
    [],
  );

  const updateCartQuantity = useCallback(
    (productId: number, size: string, color: string, quantity: number) => {
      setCart((prev) =>
        prev
          .map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i,
          )
          .filter((i) => i.quantity > 0),
      );
    },
    [],
  );

  const removeFromCart = useCallback(
    (productId: number, size: string, color: string) => {
      setCart((prev) =>
        prev.filter(
          (i) => !(i.productId === productId && i.size === size && i.color === color),
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: number) => {
    setWishlist((prev) =>
      prev.some((i) => i.productId === productId)
        ? prev.filter((i) => i.productId !== productId)
        : [...prev, { productId }],
    );
  }, []);

  const isInWishlist = useCallback(
    (productId: number) => wishlist.some((i) => i.productId === productId),
    [wishlist],
  );

  const setLastOrder = useCallback((o: PlacedOrder | null) => setLastOrderState(o), []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  const value: StoreContextValue = {
    lang,
    setLang,
    toggleLang,
    dir,
    cart,
    cartCount,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    wishlist,
    isInWishlist,
    toggleWishlist,
    lastOrder,
    setLastOrder,
    toast,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
