import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Truck, ShieldCheck, RotateCcw, Shirt } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { tr } from '@/data/translations';
import { ProductCard } from '@/components/ProductCard';
import { SectionHeading } from '@/components/SectionHeading';
import { AdvisorPanel } from '@/components/AdvisorPanel';
import { newArrivals, trendingProducts } from '@/utils/shop';
const HERO_IMG =
  'https://images.pexels.com/photos/20194705/pexels-photo-20194705.jpeg?auto=compress&cs=tinysrgb&w=1600';

const HERO_IMG_2 =
  'https://images.pexels.com/photos/7935409/pexels-photo-7935409.jpeg?auto=compress&cs=tinysrgb&w=900';

const CATEGORY_CARDS: {
  key: string;
  labelKey: string;
  img: string;
}[] = [
  {
    key: 'men',
    labelKey: 'catMen',
    img: 'https://images.pexels.com/photos/15288745/pexels-photo-15288745.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    key: 'women',
    labelKey: 'catWomen',
    img: 'https://images.pexels.com/photos/20483777/pexels-photo-20483777.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    key: 'sneakers',
    labelKey: 'catShoes',
    img: 'https://images.pexels.com/photos/12628400/pexels-photo-12628400.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    key: 'accessories',
    labelKey: 'catAccessories',
    img: 'https://images.pexels.com/photos/22032446/pexels-photo-22032446.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

export function HomePage() {
  const { lang } = useStore();
  const newItems = newArrivals();
  const trending = trendingProducts();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-20 lg:px-8">
          <div className="order-2 lg:order-1 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream-dark px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              <Sparkles size={14} />
              {lang === 'ar' ? 'مجموعة ٢٠٢٦' : 'Collection 2026'}
            </span>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
              {tr('heroTitle', lang)}
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
              {tr('heroSubtitle', lang)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-accent"
              >
                {tr('heroShopNow', lang)}
                <ArrowLeft size={17} className="rtl:rotate-180" />
              </Link>
              <Link
                to="/advisor"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream-card px-7 py-3.5 text-sm font-semibold text-ink transition hover:border-ink"
              >
                <Sparkles size={16} />
                {tr('heroDiscover', lang)}
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-8">
              {[
                { num: '500+', label: lang === 'ar' ? 'منتج' : 'Products' },
                { num: '50K+', label: lang === 'ar' ? 'عميل سعيد' : 'Happy Customers' },
                { num: '4.8', label: lang === 'ar' ? 'متوسط التقييم' : 'Avg. Rating' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-2xl font-bold text-ink">{s.num}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
              <div className="row-span-2 overflow-hidden rounded-3xl">
                <img
                  src={HERO_IMG}
                  alt="eStyle fashion"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-3xl">
                <img
                  src={HERO_IMG_2}
                  alt="eStyle fashion"
                  className="aspect-square w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-3xl bg-ink p-6 text-cream">
                <Shirt size={28} className="text-sand" />
                <p className="mt-4 font-serif text-lg leading-snug">
                  {lang === 'ar' ? 'ستايل يعكس شخصيتك' : 'Style that reflects you'}
                </p>
                <Link
                  to="/advisor"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sand"
                >
                  {tr('navAdvisor', lang)}
                  <ArrowLeft size={13} className="rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-cream-dark bg-cream-card">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: Truck, title: tr('freeShipping', lang) },
            { icon: ShieldCheck, title: tr('securePay', lang) },
            { icon: RotateCcw, title: tr('easyReturns', lang) },
          ].map((item) => (
            <div key={item.title} className="flex items-center justify-center gap-3 text-center">
              <item.icon size={22} className="text-accent" />
              <span className="text-sm font-medium text-ink-soft">{item.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20 lg:px-8">
        <SectionHeading
          title={tr('categoriesTitle', lang)}
          subtitle={tr('categoriesSubtitle', lang)}
          link="/shop"
          linkLabel={tr('shopAll', lang)}
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {CATEGORY_CARDS.map((cat, i) => (
            <Link
              key={cat.key}
              to={
                cat.key === 'men' || cat.key === 'women'
                  ? `/shop?gender=${cat.key}`
                  : `/shop?category=${cat.key}`
              }
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-dark animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img
                src={cat.img}
                alt={tr(cat.labelKey, lang)}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-serif text-xl font-semibold text-white sm:text-2xl">
                  {tr(cat.labelKey, lang)}
                </h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-white/90 transition group-hover:gap-2">
                  {tr('shopAll', lang)} <ArrowLeft size={12} className="rtl:rotate-180" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          title={tr('newArrivals', lang)}
          subtitle={tr('newArrivalsSub', lang)}
          link="/shop"
          linkLabel={tr('viewAll', lang)}
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {newItems.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* AI Style Advisor CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-cream sm:px-12 lg:px-16 lg:py-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sand/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sand">
              <Sparkles size={14} />
              AI
            </span>
            <h2 className="mt-5 max-w-xl font-serif text-3xl font-bold sm:text-4xl">
              {tr('advisorTitle', lang)}
            </h2>
            <p className="mt-3 max-w-lg text-cream/70">{tr('advisorSubtitle', lang)}</p>
            <div className="mt-8">
              <AdvisorPanel compact />
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <SectionHeading
          title={tr('trending', lang)}
          subtitle={tr('trendingSub', lang)}
          link="/shop?sort=popular"
          linkLabel={tr('viewAll', lang)}
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {trending.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Editorial banner */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              img: 'https://images.pexels.com/photos/11911863/pexels-photo-11911863.jpeg?auto=compress&cs=tinysrgb&w=1000',
              title: lang === 'ar' ? 'مجموعة الرجال' : "Men's Collection",
              text: lang === 'ar' ? 'إطلالات عصرية لكل يوم' : 'Modern looks for every day',
              to: '/shop?gender=men',
            },
            {
              img: 'https://images.pexels.com/photos/8386651/pexels-photo-8386651.jpeg?auto=compress&cs=tinysrgb&w=1000',
              title: lang === 'ar' ? 'مجموعة النساء' : "Women's Collection",
              text: lang === 'ar' ? 'أناقة ورقي في كل قطعة' : 'Elegance in every piece',
              to: '/shop?gender=women',
            },
            {
              img: 'https://images.pexels.com/photos/1488470/pexels-photo-1488470.jpeg?auto=compress&cs=tinysrgb&w=1000',
              title: lang === 'ar' ? 'الإكسسوارات' : 'Accessories',
              text: lang === 'ar' ? 'تفاصيل تصنع الفرق' : 'Details that make the difference',
              to: '/shop?category=accessories',
            },
          ].map((b, i) => (
            <Link
              key={b.title}
              to={b.to}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img
                src={b.img}
                alt={b.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-serif text-2xl font-semibold text-white">{b.title}</h3>
                <p className="mt-1 text-sm text-white/80">{b.text}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sand">
                  {tr('shopAll', lang)} <ArrowLeft size={13} className="rtl:rotate-180" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
