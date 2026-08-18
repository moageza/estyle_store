import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { tr } from '@/data/translations';
import { getProductById } from '@/data/products';
import { formatPrice } from '@/utils/shop';
import { EmptyState } from '@/components/SectionHeading';

export function WishlistPage() {
  const { lang, wishlist, toggleWishlist, addToCart, showToast } = useStore();

  const moveToCart = (productId: number) => {
    const p = getProductById(productId);
    if (!p) return;
    addToCart({
      productId,
      quantity: 1,
      size: p.sizes[0],
      color: p.colors[0].name,
    });
    toggleWishlist(productId);
    showToast(tr('addedToCart', lang));
  };

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-center font-serif text-4xl font-bold text-ink">
          {tr('wishlistTitle', lang)}
        </h1>
        <EmptyState
          icon={<Heart size={32} />}
          title={tr('wishlistEmpty', lang)}
          description={tr('wishlistEmptyDesc', lang)}
          action={
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent"
            >
              <ShoppingBag size={16} />
              {tr('continueShopping', lang)}
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-serif text-4xl font-bold text-ink">{tr('wishlistTitle', lang)}</h1>
      <p className="mb-8 text-sm text-ink-muted">
        {wishlist.length} {tr('cartItems', lang)}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {wishlist.map(({ productId }) => {
          const p = getProductById(productId);
          if (!p) return null;
          return (
            <div
              key={productId}
              className="flex gap-4 rounded-2xl border border-cream-dark bg-cream-card p-3 animate-fade-up"
            >
              <Link to={`/product/${p.id}`} className="shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                <img src={p.image} alt={p.name[lang]} className="h-28 w-24 object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link to={`/product/${p.id}`}>
                  <h3 className="font-serif text-base font-semibold text-ink hover:text-accent">
                    {p.name[lang]}
                  </h3>
                </Link>
                <p className="mt-0.5 text-xs text-ink-muted">{p.category}</p>
                <p className="mt-2 font-sans text-lg font-bold text-ink">{formatPrice(p.price, lang)}</p>
                <div className="mt-auto flex items-center gap-2">
                  <button
                    onClick={() => moveToCart(p.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent"
                  >
                    <ShoppingBag size={14} />
                    {tr('moveToCart', lang)}
                  </button>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    aria-label={tr('remove', lang)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-error/10 hover:text-error"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition hover:text-accent"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {tr('continueShopping', lang)}
        </Link>
      </div>
    </div>
  );
}
