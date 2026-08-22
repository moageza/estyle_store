import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { tr } from '@/data/translations';
import { useSEO } from '@/lib/useSEO';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { COLORS } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/SectionHeading';

type SortKey = 'newest' | 'priceLow' | 'priceHigh' | 'popular';

const ALL_SIZES = Array.from(new Set(PRODUCTS.flatMap((p) => p.sizes))).sort();

export function ShopPage() {
  const { lang } = useStore();

  useSEO({
    title: lang === 'ar' ? 'المتجر' : 'Shop',
    description: lang === 'ar'
      ? 'تسوّق أحدث صيحات الموضة: تيشيرتات، قمصان، هوديز، جينز، فساتين، أحذية، حقائب وإكسسوار'
      : 'Shop the latest fashion trends: t-shirts, shirts, hoodies, jeans, dresses, shoes, bags and accessories',
    url: 'https://temporary-zippy-bronze-gjqgmcq.vercel.app/shop',
  });

  const [params, setParams] = useSearchParams();

  const [search, setSearch] = useState(params.get('q') ?? '');
  const [category, setCategory] = useState<string>(params.get('category') ?? 'all');
  const [gender, setGender] = useState<string>(params.get('gender') ?? 'all');
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sort, setSort] = useState<SortKey>((params.get('sort') as SortKey) ?? 'newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // sync URL params -> state on mount and when params change
  useEffect(() => {
    setSearch(params.get('q') ?? '');
    setCategory(params.get('category') ?? 'all');
    setGender(params.get('gender') ?? 'all');
    setSort((params.get('sort') as SortKey) ?? 'newest');
  }, [params]);

  const toggleSize = (s: string) =>
    setSizes((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  const toggleColor = (c: string) =>
    setColors((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  const clearFilters = () => {
    setCategory('all');
    setGender('all');
    setSizes([]);
    setColors([]);
    setMaxPrice(1000);
    setSearch('');
    setSort('newest');
    setParams({});
  };

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.ar.toLowerCase().includes(q) ||
          p.name.en.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.includes(q),
      );
    }
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (gender !== 'all')
      list = list.filter((p) => p.gender === gender || p.gender === 'unisex');
    if (sizes.length) list = list.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    if (colors.length)
      list = list.filter((p) => p.colors.some((c) => colors.includes(c.name)));
    list = list.filter((p) => p.price <= maxPrice);

    switch (sort) {
      case 'priceLow':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        list.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'newest':
      default:
        list.sort((a, b) => Number(b.isNew ?? 0) - Number(a.isNew ?? 0) || b.id - a.id);
    }
    return list;
  }, [search, category, gender, sizes, colors, maxPrice, sort]);

  const FilterContent = () => (
    <div className="space-y-7">
      {/* Category */}
      <div>
        <h4 className="mb-3 font-sans text-sm font-semibold text-ink">{tr('category', lang)}</h4>
        <div className="space-y-1.5">
          <button
            onClick={() => setCategory('all')}
            className={`block w-full rounded-lg px-3 py-2 text-start text-sm transition ${
              category === 'all' ? 'bg-ink text-cream' : 'text-ink-soft hover:bg-cream-dark'
            }`}
          >
            {tr('allCategories', lang)}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`block w-full rounded-lg px-3 py-2 text-start text-sm transition ${
                category === cat.key ? 'bg-ink text-cream' : 'text-ink-soft hover:bg-cream-dark'
              }`}
            >
              {cat[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <h4 className="mb-3 font-sans text-sm font-semibold text-ink">
          {lang === 'ar' ? 'النوع' : 'Gender'}
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: lang === 'ar' ? 'الكل' : 'All' },
            { key: 'men', label: tr('catMen', lang) },
            { key: 'women', label: tr('catWomen', lang) },
          ].map((g) => (
            <button
              key={g.key}
              onClick={() => setGender(g.key)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                gender === g.key
                  ? 'border-ink bg-ink text-cream'
                  : 'border-cream-dark text-ink-soft hover:border-ink'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h4 className="mb-3 font-sans text-sm font-semibold text-ink">{tr('size', lang)}</h4>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-xs font-medium transition ${
                sizes.includes(s)
                  ? 'border-ink bg-ink text-cream'
                  : 'border-cream-dark text-ink-soft hover:border-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className="mb-3 font-sans text-sm font-semibold text-ink">{tr('color', lang)}</h4>
        <div className="flex flex-wrap gap-2.5">
          {Object.values(COLORS).map((c) => (
            <button
              key={c.name}
              onClick={() => toggleColor(c.name)}
              aria-label={c.name}
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                colors.includes(c.name) ? 'border-accent scale-110' : 'border-cream-dark'
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {colors.includes(c.name) && (
                <span
                  className="text-[10px] font-bold"
                  style={{
                    color: ['white', 'beige', 'yellow', 'silver', 'gold'].includes(c.name)
                      ? '#1a1a1a'
                      : '#fff',
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="mb-3 font-sans text-sm font-semibold text-ink">{tr('priceRange', lang)}</h4>
        <input
          type="range"
          min={100}
          max={1000}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-accent"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-ink-muted">
          <span>100</span>
          <span className="font-semibold text-ink">
            {maxPrice} {tr('currency', lang)}
          </span>
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="w-full rounded-xl border border-cream-dark py-2.5 text-sm font-medium text-ink-soft transition hover:border-ink hover:text-ink"
      >
        {tr('clearFilters', lang)}
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">{tr('shopTitle', lang)}</h1>
        <p className="mt-2 text-ink-muted">{tr('shopSubtitle', lang)}</p>
      </div>

      {/* Search + sort */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search size={18} className="absolute top-1/2 start-3 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tr('search', lang)}
            className="w-full rounded-full border border-cream-dark bg-white py-3 pe-4 ps-10 text-sm text-ink outline-none transition focus:border-accent"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 rounded-full border border-cream-dark px-4 py-2.5 text-sm font-medium text-ink lg:hidden"
          >
            <SlidersHorizontal size={16} />
            {tr('filters', lang)}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-cream-dark bg-white px-4 py-2.5 text-sm font-medium text-ink outline-none transition focus:border-accent"
          >
            <option value="newest">{tr('sortNewest', lang)}</option>
            <option value="priceLow">{tr('sortPriceLow', lang)}</option>
            <option value="priceHigh">{tr('sortPriceHigh', lang)}</option>
            <option value="popular">{tr('sortPopular', lang)}</option>
          </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-2xl border border-cream-dark bg-cream-card p-5">
            <h3 className="mb-5 font-serif text-lg font-semibold text-ink">{tr('filters', lang)}</h3>
            <FilterContent />
          </div>
        </aside>

        {/* Products */}
        <div>
          <p className="mb-4 text-sm text-ink-muted">
            {filtered.length} {tr('results', lang)}
          </p>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search size={32} />}
              title={tr('noResults', lang)}
              description={tr('clearFilters', lang)}
              action={
                <button
                  onClick={clearFilters}
                  className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
                >
                  {tr('clearFilters', lang)}
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 end-0 flex w-80 max-w-[85%] flex-col bg-cream shadow-soft animate-fade-in">
            <div className="flex h-16 items-center justify-between border-b border-cream-dark px-4">
              <h3 className="font-serif text-lg font-semibold text-ink">{tr('filters', lang)}</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-dark"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterContent />
            </div>
            <div className="border-t border-cream-dark p-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-xl bg-ink py-3 text-sm font-semibold text-white"
              >
                {tr('apply', lang)} ({filtered.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
