import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { useStore } from '@/store/StoreContext';
import { tr } from '@/data/translations';
import { formatPrice } from '@/utils/shop';
import { StarRating } from '@/components/StarRating';
import { CATEGORIES } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { lang, addToCart, toggleWishlist, isInWishlist, showToast } = useStore();
  const wished = isInWishlist(product.id);
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0].name,
    });
    showToast(tr('addedToCart', lang));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast(wished ? tr('removedFromWishlist', lang) : tr('addedToWishlist', lang));
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-cream-card shadow-card transition-all duration-300 hover:shadow-card-hover animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
        <img
          src={product.image}
          alt={product.name[lang]}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {tr('new', lang)}
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-full bg-error px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              -{discountPct}%
            </span>
          )}
          {product.isTrending && (
            <span className="rounded-full bg-sand px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {tr('trending_', lang)}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label={tr('addToWishlist', lang)}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-all hover:bg-white hover:scale-110"
        >
          <Heart
            size={16}
            className={wished ? 'fill-error text-error' : 'text-ink'}
          />
        </button>

        {/* Quick add */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent"
          >
            <ShoppingBag size={15} />
            {tr('addToCart', lang)}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-[11px] uppercase tracking-wider text-ink-muted">
          {CATEGORIES.find((c) => c.key === product.category)?.[lang] ?? product.category}
        </p>
        <h3 className="mb-1.5 line-clamp-2 flex-1 font-serif text-[15px] font-medium leading-snug text-ink">
          {product.name[lang]}
        </h3>
        <div className="mb-2">
          <StarRating rating={product.rating} reviews={product.reviews} showCount size={13} lang={lang} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans text-base font-semibold text-ink">
            {formatPrice(product.price, lang)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-ink-muted line-through">
              {formatPrice(product.oldPrice!, lang)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
