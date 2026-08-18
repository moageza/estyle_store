import { Sparkles } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { tr } from '@/data/translations';
import { AdvisorPanel } from '@/components/AdvisorPanel';

export function AdvisorPage() {
  const { lang } = useStore();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-cream-dark px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
          <Sparkles size={14} />
          AI
        </span>
        <h1 className="mt-5 font-serif text-4xl font-bold text-ink sm:text-5xl">
          {tr('advisorTitle', lang)}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-ink-muted">{tr('advisorSubtitle', lang)}</p>
      </div>

      <div className="mt-12">
        <AdvisorPanel />
      </div>
    </div>
  );
}
