import { useEffect, useState } from 'react';
import { Star, MessageSquare, CheckCircle } from 'lucide-react';
import { fetchProductReviews } from '@/lib/api';
import type { Review } from '@/lib/api';
import { useStore } from '@/store/StoreContext';

interface ReviewsListProps {
  productId: number;
}

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? 'fill-sand text-sand' : 'text-cream-dark'}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const { lang } = useStore();
  const date = new Date(review.created_at).toLocaleDateString(
    lang === 'ar' ? 'ar-SA' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );

  return (
    <div className="rounded-2xl border border-cream-dark bg-white p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <StarDisplay rating={review.rating} />
            {review.is_verified && (
              <span className="flex items-center gap-1 text-[11px] text-success">
                <CheckCircle size={12} />
                {lang === 'ar' ? 'مشترٍ موثّق' : 'Verified Purchase'}
              </span>
            )}
          </div>
          {review.title && (
            <h4 className="mt-2 text-sm font-semibold text-ink">{review.title}</h4>
          )}
        </div>
        <span className="text-xs text-ink-muted">{date}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{review.comment}</p>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cream-dark text-[11px] font-bold text-ink-muted">
          {review.customer_name.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs font-medium text-ink">{review.customer_name}</span>
      </div>
    </div>
  );
}

function RatingSummary({ reviews }: { reviews: Review[] }) {
  const { lang } = useStore();

  if (reviews.length === 0) return null;

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percent: Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100),
  }));

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
      {/* Average */}
      <div className="text-center">
        <p className="font-sans text-4xl font-bold text-ink">{avgRating.toFixed(1)}</p>
        <StarDisplay rating={Math.round(avgRating)} size={18} />
        <p className="mt-1 text-xs text-ink-muted">
          {reviews.length} {lang === 'ar' ? 'تقييم' : 'reviews'}
        </p>
      </div>

      {/* Distribution */}
      <div className="flex-1 space-y-1.5">
        {distribution.map((d) => (
          <div key={d.star} className="flex items-center gap-2">
            <span className="w-3 text-xs text-ink-muted">{d.star}</span>
            <Star size={12} className="fill-sand text-sand" />
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-dark">
              <div
                className="h-full rounded-full bg-sand transition-all"
                style={{ width: `${d.percent}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs text-ink-muted">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewsList({ productId }: ReviewsListProps) {
  const { lang } = useStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProductReviews(productId);
        setReviews(data);
      } catch {
        // Reviews table may not exist yet
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  const displayed = showAll ? reviews : reviews.slice(0, 5);

  return (
    <section className="mt-16">
      <h2 className="font-serif text-2xl font-bold text-ink">
        {lang === 'ar' ? 'تقييمات العملاء' : 'Customer Reviews'}
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cream-dark border-t-accent" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-cream-dark bg-cream-card py-12 text-center">
          <MessageSquare size={32} className="text-ink-muted" />
          <p className="mt-3 text-sm text-ink-muted">
            {lang === 'ar'
              ? 'لا توجد تقييمات بعد. كن أول من يقيّم هذا المنتج!'
              : 'No reviews yet. Be the first to review this product!'}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-2xl border border-cream-dark bg-cream-card p-6">
            <RatingSummary reviews={reviews} />
          </div>

          <div className="mt-6 space-y-4">
            {displayed.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {reviews.length > 5 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-6 text-sm font-medium text-accent hover:underline"
            >
              {lang === 'ar'
                ? `عرض جميع التقييمات (${reviews.length})`
                : `Show all reviews (${reviews.length})`}
            </button>
          )}
        </>
      )}
    </section>
  );
}
