import { Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { tr } from '@/data/translations';
import { getProductById } from '@/data/products';
import { formatPrice } from '@/utils/shop';
import { EmptyState } from '@/components/SectionHeading';

export function OrderConfirmationPage() {
  const { lang, lastOrder } = useStore();

  if (!lastOrder) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          icon={<Package size={32} />}
          title={lang === 'ar' ? 'لا يوجد طلب' : 'No order found'}
          description={lang === 'ar' ? 'لم يتم وضع أي طلب بعد' : 'No order has been placed yet'}
          action={
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent"
            >
              {tr('continueShopping', lang)}
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center animate-fade-up">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle size={44} className="text-success" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-ink">{tr('orderConfirmed', lang)}</h1>
        <p className="mt-3 text-ink-muted">{tr('orderThanks', lang)}</p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream-dark px-5 py-2.5">
          <span className="text-sm text-ink-soft">{tr('orderNumber', lang)}:</span>
          <span className="font-sans text-sm font-bold text-ink" dir="ltr">{lastOrder.id}</span>
        </div>
      </div>

      {/* Order details */}
      <div className="mt-10 rounded-2xl border border-cream-dark bg-cream-card p-6 animate-fade-up">
        <h2 className="mb-4 font-serif text-lg font-semibold text-ink">{tr('orderSummary', lang)}</h2>
        <div className="space-y-3">
          {lastOrder.items.map((item) => {
            const p = getProductById(item.productId);
            if (!p) return null;
            return (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-3">
                <div className="shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                  <img src={p.image} alt="" className="h-14 w-12 object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{p.name[lang]}</p>
                  <p className="text-xs text-ink-muted">
                    {item.size} · {item.color} · ×{item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold text-ink">
                  {formatPrice(p.price * item.quantity, lang)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-5 space-y-2 border-t border-cream-dark pt-4 text-sm">
          <div className="flex items-center justify-between text-ink-soft">
            <span>{tr('subtotal', lang)}</span>
            <span className="font-medium text-ink">{formatPrice(lastOrder.subtotal, lang)}</span>
          </div>
          <div className="flex items-center justify-between text-ink-soft">
            <span>{tr('shipping', lang)}</span>
            <span className="font-medium text-ink">
              {lastOrder.shipping === 0 ? tr('free', lang) : formatPrice(lastOrder.shipping, lang)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-cream-dark pt-3">
            <span className="font-semibold text-ink">{tr('total', lang)}</span>
            <span className="font-sans text-xl font-bold text-ink">{formatPrice(lastOrder.total, lang)}</span>
          </div>
        </div>
      </div>

      {/* Delivery info */}
      <div className="mt-4 rounded-2xl border border-cream-dark bg-cream-card p-6 animate-fade-up">
        <h2 className="mb-3 font-serif text-lg font-semibold text-ink">{tr('shippingAddress', lang)}</h2>
        <div className="text-sm text-ink-soft">
          <p className="font-medium text-ink">{lastOrder.info.name}</p>
          <p dir="ltr" className="mt-1">{lastOrder.info.phone}</p>
          <p dir="ltr">{lastOrder.info.email}</p>
          <p className="mt-1">{lastOrder.info.address}, {lastOrder.info.city}</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-accent"
        >
          {tr('backHome', lang)}
        </Link>
      </div>
    </div>
  );
}
