import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, Sparkles, X } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { tr } from '@/data/translations';

export function Header() {
  const { lang, toggleLang, cartCount, wishlist } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/', label: tr('navHome', lang) },
    { to: '/shop', label: tr('navShop', lang) },
    { to: '/advisor', label: tr('navAdvisor', lang) },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink py-2 text-center text-[11px] font-medium tracking-wide text-cream">
        {lang === 'ar'
          ? 'شحن مجاني للطلبات فوق ٥٠٠ ر.س • إرجاع سهل خلال ١٤ يوم'
          : 'Free shipping over 500 SAR • Easy 14-day returns'}
      </div>

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-cream/95 shadow-soft backdrop-blur-md'
            : 'bg-cream/80 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream-dark lg:hidden"
            aria-label="Menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream">
              <Sparkles size={18} />
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight text-ink">
              eStyle
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 ${
                    isActive
                      ? 'text-ink after:w-full'
                      : 'text-ink-soft hover:text-ink after:w-0 hover:after:w-full'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream-dark"
              aria-label={tr('search', lang)}
            >
              <Search size={20} />
            </button>

            <button
              onClick={toggleLang}
              className="hidden h-10 items-center rounded-full px-3 text-sm font-semibold text-ink transition-colors hover:bg-cream-dark sm:flex"
            >
              {lang === 'ar' ? 'EN' : 'ع'}
            </button>

            <Link
              to="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream-dark"
              aria-label={tr('navWishlist', lang)}
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream-dark"
              aria-label={tr('navCart', lang)}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div className="border-t border-cream-dark bg-cream px-4 py-4 animate-fade-in sm:px-6 lg:px-8">
            <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl items-center gap-2">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted"
                />
                <input
                  autoFocus
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={tr('search', lang)}
                  className="w-full rounded-full border border-cream-dark bg-white py-3 pe-4 ps-10 text-sm text-ink outline-none transition focus:border-accent"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-accent"
              >
                {tr('search', lang).replace('...', '')}
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 flex w-72 max-w-[80%] flex-col bg-cream shadow-soft animate-fade-in">
            <div className="flex h-16 items-center justify-between border-b border-cream-dark px-4">
              <span className="font-serif text-xl font-bold text-ink">eStyle</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-dark"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                      isActive ? 'bg-ink text-cream' : 'text-ink hover:bg-cream-dark'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive ? 'bg-ink text-cream' : 'text-ink hover:bg-cream-dark'
                  }`
                }
              >
                {tr('navWishlist', lang)} ({wishlist.length})
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive ? 'bg-ink text-cream' : 'text-ink hover:bg-cream-dark'
                  }`
                }
              >
                {tr('navCart', lang)} ({cartCount})
              </NavLink>
            </nav>
            <div className="mt-auto border-t border-cream-dark p-4">
              <button
                onClick={toggleLang}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-cream-dark px-4 py-3 text-sm font-semibold text-ink"
              >
                {lang === 'ar' ? 'English' : 'العربية'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
