import { Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { tr } from '@/data/translations';
import { COLORS, getProductById } from '@/data/products';
import { cartSubtotal, shippingCost, formatPrice, colorNameLabel } from '@/utils/shop';
import { EmptyState } from '@/components/SectionHeading';

export function CartPage() {
  const { lang, cart, updateCartQuantity, removeFromCart } = useStore();

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-center font-serif text-4xl font-bold text-ink">
          {tr('cartTitle', lang)}
        </h1>
        <EmptyState
          icon={<ShoppingBag size={32} />}
          title={tr('cartEmpty', lang)}
          description={tr('cartEmptyDesc', lang)}
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

  const subtotal = cartSubtotal(cart);
  const shipping = shippingCost(subtotal);
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-4xl font-bold text-ink">{tr('cartTitle', lang)}</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="space-y-3">
          {cart.map((item) => {
            const p = getProductById(item.productId);
            if (!p) return null;
            const colorHex = COLORS[item.color]?.hex ?? '#ccc';
            return (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-4 rounded-2xl border border-cream-dark bg-cream-card p-3 sm:p-4 animate-fade-up"
              >
                <Link to={`/product/${p.id}`} className="shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                  <img src={p.image} alt={p.name[lang]} className="h-28 w-24 object-cover sm:h-32 sm:w-28" />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/product/${p.id}`}>
                        <h3 className="font-serif text-base font-semibold text-ink hover:text-accent sm:text-lg">
                          {p.name[lang]}
                        </h3>
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                        <span>{tr('size', lang)}: {item.size}</span>
                        <span className="flex items-center gap-1">
                          {tr('color', lang)}:
                          <span className="h-3 w-3 rounded-full border border-cream-dark" style={{ backgroundColor: colorHex }} />
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId, item.size, item.color)}
                      aria-label={tr('remove', lang)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition hover:bg-error/10 hover:text-error"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-full border border-cream-dark">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-cream-dark"
                        aria-label="-"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold text-ink">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-cream-dark"
                        aria-label="+"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-sans text-base font-bold text-ink">
                      {formatPrice(p.price * item.quantity, lang)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-ink transition hover:text-accent"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {tr('continueShopping', lang)}
          </Link>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-cream-dark bg-cream-card p-6">
            <h2 className="font-serif text-xl font-semibold text-ink">{tr('orderSummary', lang)}</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between text-ink-soft">
                <span>{tr('subtotal', lang)}</span>
                <span className="font-medium text-ink">{formatPrice(subtotal, lang)}</span>
              </div>
              <div className="flex items-center justify-between text-ink-soft">
                <span>{tr('shipping', lang)}</span>
                <span className="font-medium text-ink">
                  {shipping === 0 ? tr('free', lang) : formatPrice(shipping, lang)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="rounded-lg bg-cream-dark px-3 py-2 text-xs text-ink-muted">
                  {tr('freeShipping', lang)}
                </p>
              )}
              <div className="border-t border-cream-dark pt-3" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink">{tr('total', lang)}</span>
                <span className="font-sans text-xl font-bold text-ink">{formatPrice(total, lang)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-semibold text-white transition hover:bg-accent"
            >
              {tr('checkout', lang)}
              <ArrowLeft size={16} className="rtl:rotate-180" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
