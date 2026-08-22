import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, MapPin, User } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { tr } from '@/data/translations';
import { getProductById } from '@/data/products';
import { cartSubtotal, shippingCost, formatPrice } from '@/utils/shop';
import type { OrderInfo, PlacedOrder } from '@/types';
import { EmptyState } from '@/components/SectionHeading';
import { createOrder } from '@/lib/api';

export function CheckoutPage() {
  const { lang, cart, clearCart, setLastOrder } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState<OrderInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderInfo, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartSubtotal(cart);
  const shipping = shippingCost(subtotal);
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-center font-serif text-4xl font-bold text-ink">
          {tr('checkoutTitle', lang)}
        </h1>
        <EmptyState
          icon={<CreditCard size={32} />}
          title={tr('cartEmpty', lang)}
          description={tr('cartEmptyDesc', lang)}
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

  const validate = (): boolean => {
    const e: Partial<Record<keyof OrderInfo, string>> = {};
    if (!form.name.trim()) e.name = tr('required', lang);
    if (!form.phone.trim()) e.phone = tr('required', lang);
    else if (!/^[+\d\s-]{8,}$/.test(form.phone)) e.phone = tr('invalidPhone', lang);
    if (!form.email.trim()) e.email = tr('required', lang);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = tr('invalidEmail', lang);
    if (!form.address.trim()) e.address = tr('required', lang);
    if (!form.city.trim()) e.city = tr('required', lang);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof OrderInfo, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const orderId = `ES-${Date.now().toString().slice(-6)}`;
    const order: PlacedOrder = {
      id: orderId,
      items: cart,
      info: form,
      subtotal,
      shipping,
      total,
      date: new Date().toISOString(),
    };

    // Persist to Supabase (best-effort — don't block the UI if it fails)
    try {
      await createOrder({
        id: orderId,
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        customerAddress: form.address,
        customerCity: form.city,
        notes: form.notes,
        subtotal,
        shipping,
        total,
        items: cart,
      });
    } catch (err) {
      console.warn('Failed to persist order to Supabase:', err);
    }

    setLastOrder(order);
    clearCart();
    setSubmitting(false);
    navigate('/order-confirmation');
  };

  const inputClass = (field: keyof OrderInfo) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-accent ${
      errors[field] ? 'border-error' : 'border-cream-dark'
    }`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/cart"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition hover:text-ink"
      >
        <ArrowLeft size={16} className="rtl:rotate-180" />
        {tr('cartTitle', lang)}
      </Link>

      <h1 className="mb-8 font-serif text-4xl font-bold text-ink">{tr('checkoutTitle', lang)}</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <div className="space-y-6">
          {/* Contact */}
          <div className="rounded-2xl border border-cream-dark bg-cream-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <User size={18} className="text-accent" />
              <h2 className="font-serif text-lg font-semibold text-ink">{tr('contactInfo', lang)}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-soft">{tr('fullName', lang)}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={inputClass('name')}
                />
                {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-soft">{tr('phone', lang)}</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={inputClass('phone')}
                  dir="ltr"
                />
                {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-ink-soft">{tr('email', lang)}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={inputClass('email')}
                  dir="ltr"
                />
                {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="rounded-2xl border border-cream-dark bg-cream-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-accent" />
              <h2 className="font-serif text-lg font-semibold text-ink">{tr('shippingAddress', lang)}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-ink-soft">{tr('address', lang)}</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className={inputClass('address')}
                />
                {errors.address && <p className="mt-1 text-xs text-error">{errors.address}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-soft">{tr('city', lang)}</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={inputClass('city')}
                />
                {errors.city && <p className="mt-1 text-xs text-error">{errors.city}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-ink-soft">{tr('orderNotes', lang)}</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                  className={inputClass('notes')}
                />
              </div>
            </div>
          </div>

          {/* Payment note */}
          <div className="flex items-center gap-3 rounded-2xl border border-cream-dark bg-cream-dark p-4 text-sm text-ink-soft">
            <CreditCard size={18} className="text-accent" />
            {tr('paymentNote', lang)}
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-cream-dark bg-cream-card p-6">
            <h2 className="font-serif text-lg font-semibold text-ink">{tr('orderSummary', lang)}</h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pe-1">
              {cart.map((item) => {
                const p = getProductById(item.productId);
                if (!p) return null;
                return (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                    <div className="relative shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                      <img src={p.image} alt="" className="h-16 w-14 object-cover" />
                      <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-xs font-medium text-ink line-clamp-2">{p.name[lang]}</p>
                      <p className="mt-0.5 text-[11px] text-ink-muted">{item.size} · {item.color}</p>
                    </div>
                    <span className="self-center text-sm font-semibold text-ink">
                      {formatPrice(p.price * item.quantity, lang)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 space-y-2 border-t border-cream-dark pt-4 text-sm">
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
              <div className="flex items-center justify-between border-t border-cream-dark pt-3">
                <span className="font-semibold text-ink">{tr('total', lang)}</span>
                <span className="font-sans text-xl font-bold text-ink">{formatPrice(total, lang)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-semibold text-white transition hover:bg-accent disabled:opacity-60"
            >
              {submitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <>
                  <Check size={17} />
                  {tr('placeOrder', lang)}
                </>
              )}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}
