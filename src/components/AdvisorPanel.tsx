import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Wand2, ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { tr } from '@/data/translations';
import { recommendOutfits, type ScoredProduct } from '@/utils/advisor';
import { ProductCard } from '@/components/ProductCard';

const EXAMPLES_AR = [
  'إطلالة كاجوال للصيف',
  'فستان أسود لحفلة',
  'ملابس دافئة للشتاء',
  'إطلالة رسمية للعمل',
  'إطلالة رياضية للجيم',
];
const EXAMPLES_EN = [
  'A casual outfit for summer',
  'A black dress for a party',
  'Warm clothes for winter',
  'A formal outfit for work',
  'A sporty outfit for the gym',
];

export function AdvisorPanel({ compact = false }: { compact?: boolean }) {
  const { lang, addToCart, showToast } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ScoredProduct[]>([]);
  const [searched, setSearched] = useState(false);

  const examples = lang === 'ar' ? EXAMPLES_AR : EXAMPLES_EN;

  const handleGenerate = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    const recs = recommendOutfits(query, 4);
    setResults(recs);
    setSearched(true);
  };

  const handleExample = (ex: string) => {
    setQuery(ex);
    const recs = recommendOutfits(ex, 4);
    setResults(recs);
    setSearched(true);
  };

  const addAllToCart = () => {
    results.forEach((r) => {
      addToCart({
        productId: r.product.id,
        quantity: 1,
        size: r.product.sizes[0],
        color: r.product.colors[0].name,
      });
    });
    showToast(tr('addedToCart', lang));
  };

  return (
    <div className={compact ? '' : 'mx-auto max-w-4xl'}>
      <form onSubmit={handleGenerate} className="relative">
        <div className="relative flex flex-col gap-3 rounded-3xl border border-cream-dark bg-white p-3 shadow-soft sm:flex-row sm:items-center sm:p-2.5">
          <div className="relative flex flex-1 items-center">
            <Sparkles size={18} className="absolute start-4 text-sand" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr('advisorPlaceholder', lang)}
              className="w-full rounded-2xl bg-transparent py-3 pe-4 ps-11 text-sm text-ink outline-none sm:py-4"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-2xl bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent sm:py-4"
          >
            <Wand2 size={17} />
            {tr('advisorGenerate', lang)}
          </button>
        </div>
      </form>

      {/* Examples */}
      {!searched && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-ink-muted">{tr('advisorTry', lang)}</span>
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => handleExample(ex)}
              className="rounded-full border border-cream-dark bg-cream-card px-3.5 py-1.5 text-xs text-ink-soft transition hover:border-accent hover:text-accent"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {searched && (
        <div className="mt-10 animate-fade-up">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-ink">{tr('advisorSuggestions', lang)}</h3>
            {results.length > 0 && (
              <button
                onClick={addAllToCart}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
              >
                <ShoppingBag size={16} />
                {tr('advisorAddAll', lang)}
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-cream-dark bg-cream-card p-12 text-center">
              <p className="text-ink-muted">{tr('noResults', lang)}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {results.map((r, i) => (
                <div key={r.product.id} className="relative">
                  <ProductCard product={r.product} index={i} />
                  <div className="absolute -top-2 z-10 rounded-full bg-sand px-2.5 py-1 text-[10px] font-bold text-white shadow-sm" style={{ insetInlineStart: '0.5rem' }}>
                    {Math.round(r.score)}% {tr('advisorMatch', lang)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!compact && (
            <div className="mt-8 text-center">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition hover:text-accent"
              >
                {tr('continueShopping', lang)}
                <ArrowLeft size={16} className="rtl:rotate-180" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
