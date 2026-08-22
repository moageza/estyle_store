import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { tr } from '@/data/translations';
import { useSEO } from '@/lib/useSEO';
import { CATEGORIES, getProductById } from '@/data/products';
import { formatPrice, getRelatedProducts, colorNameLabel } from '@/utils/shop';
import type { ColorName } from '@/types';
import { StarRating } from '@/components/StarRating';
import { ProductCard } from '@/components/ProductCard';
import { SectionHeading } from '@/components/SectionHeading';
import { VirtualTryOn } from '@/components/VirtualTryOn';
import { ReviewsList } from '@/components/ReviewsList';
import { ReviewForm } from '@/components/ReviewForm';

export function ProductPage() {
  const { id } = useParams();
  const { lang, addToCart, toggleWishlist, isInWishlist, showToast } = useStore();
  const navigate = useNavigate();
  const product = id ? getProductById(Number(id)) : undefined;

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<ColorName | null>(null);
  const [qty, setQty] = useState(1);

  // Dynamic SEO for this product
  useSEO({
    title: product?.name[lang] ?? '',
    description: product?.description[lang],
    image: product?.image,
    url: `https://temporary-zippy-bronze-gjqgmcq.vercel.app/product/${id}`,
    type: 'product',
  });

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-ink">404</h1>
        <p className="mt-2 text-ink-muted">{lang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}</p>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
          {tr('continueShopping', lang)}
        </Link>
      </div>
    );
  }

  const wished = isInWishlist(product.id);
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const gallery = product.gallery.length > 0 ? product.gallery : [product.image];
  const related = getRelatedProducts(product);
  const catLabel = CATEGORIES.find((c) => c.key === product.category)?.[lang];

  const handleAddToCart = () => {
    if (!size) {
      showToast(tr('selectSizeFirst', lang));
      return;
    }
    if (!color) {
      showToast(tr('selectColorFirst', lang));
      return;
    }
    addToCart({ productId: product.id, quantity: qty, size, color });
    showToast(tr('addedToCart', lang));
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    showToast(wished ? tr('removedFromWishlist', lang) : tr('addedToWishlist', lang));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-muted">
        <Link to="/" className="hover:text-ink">{tr('navHome', lang)}</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-ink">{tr('navShop', lang)}</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-ink">{catLabel}</Link>
        <span>/</span>
        <span className="text-ink">{product.name[lang]}</span>
      </nav>

      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition hover:text-ink"
      >
        <ArrowLeft size={16} className="rtl:rotate-180" />
        {lang === 'ar' ? 'رجوع' : 'Back'}
      </button>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-3xl bg-cream-dark">
            <img
              src={gallery[activeImg]}
              alt={product.name[lang]}
              className="aspect-[4/5] w-full object-cover animate-fade-in"
              key={activeImg}
            />
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`overflow-hidden rounded-xl border-2 transition ${
                    activeImg === i ? 'border-accent' : 'border-transparent'
                  }`}
                >
                  <img src={g} alt="" className="h-20 w-16 object-cover sm:h-24 sm:w-20" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">{catLabel}</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
            {product.name[lang]}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={product.rating} size={16} showCount reviews={product.reviews} lang={lang} />
            <span className="text-sm text-ink-muted">
              {product.reviews} {tr('reviews', lang)}
            </span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="font-sans text-3xl font-bold text-ink">
              {formatPrice(product.price, lang)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-ink-muted line-through">
                  {formatPrice(product.oldPrice!, lang)}
                </span>
                <span className="rounded-full bg-error/10 px-2.5 py-1 text-xs font-bold text-error">
                  -{Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-ink-soft">{product.description[lang]}</p>

          {/* Colors */}
          <div className="mt-7">
            <div className="mb-2.5 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-ink">{tr('color', lang)}</h4>
              {color && <span className="text-xs text-ink-muted">{colorNameLabel(color, lang)}</span>}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                    color === c.name ? 'border-accent scale-110' : 'border-cream-dark'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {color === c.name && (
                    <Check
                      size={16}
                      style={{
                        color: ['white', 'beige', 'yellow', 'silver', 'gold'].includes(c.name)
                          ? '#1a1a1a'
                          : '#fff',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-6">
            <div className="mb-2.5 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-ink">{tr('size', lang)}</h4>
              <button className="text-xs text-accent hover:underline">
                {tr('footerSizes', lang)}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-sm font-medium transition ${
                    size === s
                      ? 'border-ink bg-ink text-cream'
                      : 'border-cream-dark text-ink-soft hover:border-ink'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + actions */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center rounded-full border border-cream-dark">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-cream-dark"
                aria-label="-"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-sm font-semibold text-ink">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-cream-dark"
                aria-label="+"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent"
            >
              <ShoppingBag size={17} />
              {tr('addToCart', lang)}
            </button>
            <button
              onClick={handleWishlist}
              aria-label={tr('addToWishlist', lang)}
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
                wished
                  ? 'border-error bg-error/10 text-error'
                  : 'border-cream-dark text-ink hover:border-ink'
              }`}
            >
              <Heart size={20} className={wished ? 'fill-error' : ''} />
            </button>
          </div>

          {/* Trust */}
          <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-cream-dark bg-cream-card p-4">
            {[
              { icon: Truck, label: tr('freeShipping', lang) },
              { icon: ShieldCheck, label: tr('securePay', lang) },
              { icon: RotateCcw, label: tr('easyReturns', lang) },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5 text-center">
                <item.icon size={20} className="text-accent" />
                <span className="text-[11px] leading-tight text-ink-soft">{item.label}</span>
              </div>
            ))}
          </div>

          {/* AI Virtual Try-On */}
          <div className="mt-6">
            <VirtualTryOn
              productName={product.name[lang]}
              productImage={product.image}
              productDescription={product.description[lang]}
            />
          </div>

          {/* Tags */}
          <div className="mt-5 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cream-dark px-3 py-1 text-[11px] font-medium text-ink-soft"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20">
        <ReviewsList productId={product.id} />
        <div className="mt-6">
          <ReviewForm productId={product.id} />
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeading title={tr('relatedProducts', lang)} />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
