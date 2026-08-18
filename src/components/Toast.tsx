import { useStore } from '@/store/StoreContext';

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 animate-fade-up">
      <div className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white shadow-soft">
        {toast}
      </div>
    </div>
  );
}
