import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Sparkles, Twitter, Facebook, Youtube } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { tr } from '@/data/translations';
import { CATEGORIES } from '@/data/products';

export function Footer() {
  const { lang } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const helpLinks = [
    { label: tr('footerAbout2', lang) },
    { label: tr('footerShipping', lang) },
    { label: tr('footerSizes', lang) },
    { label: tr('footerFaq', lang) },
  ];

  return (
    <footer className="mt-20 bg-ink text-cream">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-start">
            <div className="max-w-md">
              <h3 className="font-serif text-2xl font-semibold">{tr('footerNewsletter', lang)}</h3>
              <p className="mt-2 text-sm text-cream/70">{tr('footerNewsSub', lang)}</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tr('emailPlaceholder', lang)}
                className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-cream placeholder:text-cream/50 outline-none transition focus:border-sand"
              />
              <button
                type="submit"
                className="rounded-full bg-sand px-6 py-3 text-sm font-semibold text-ink transition hover:bg-sand-light"
              >
                {subscribed ? '✓' : tr('subscribe', lang)}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-ink">
                <Sparkles size={18} />
              </span>
              <span className="font-serif text-2xl font-bold">eStyle</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
              {tr('footerAbout', lang)}
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-cream/80 transition hover:border-sand hover:bg-sand hover:text-ink"
                  aria-label="social"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-sand">
              {tr('footerShop', lang)}
            </h4>
            <ul className="space-y-3 text-sm text-cream/70">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.key}>
                  <Link to={`/shop?category=${cat.key}`} className="transition hover:text-cream">
                    {cat[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-sand">
              {tr('footerHelp', lang)}
            </h4>
            <ul className="space-y-3 text-sm text-cream/70">
              {helpLinks.map((l) => (
                <li key={l.label}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="transition hover:text-cream">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-sand">
              {tr('footerContact', lang)}
            </h4>
            <ul className="space-y-3 text-sm text-cream/70">
              <li>support@estyle.com</li>
              <li dir="ltr">+966 55 123 4567</li>
              <li>Riyadh, Saudi Arabia</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-cream/60 md:flex-row">
          <p>© {new Date().getFullYear()} eStyle. {tr('footerRights', lang)}.</p>
          <div className="flex items-center gap-4">
            <span>VISA</span>
            <span>MASTERCARD</span>
            <span>MADA</span>
            <span>APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
