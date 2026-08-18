import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviews?: number;
  size?: number;
  showCount?: boolean;
  lang?: 'ar' | 'en';
}

export function StarRating({ rating, reviews, size = 14, showCount, lang = 'ar' }: StarRatingProps) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFull = i < full;
          const isHalf = i === full && hasHalf;
          return (
            <span key={i} className="relative" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-sand" strokeWidth={1.5} />
              {(isFull || isHalf) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: isHalf ? size / 2 : size }}
                >
                  <Star
                    size={size}
                    className="text-sand fill-sand"
                    strokeWidth={1.5}
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showCount && reviews !== undefined && (
        <span className="text-xs text-ink-muted">
          {rating.toFixed(1)} ({reviews})
        </span>
      )}
      {showCount && reviews === undefined && (
        <span className="text-xs text-ink-muted">{rating.toFixed(1)}</span>
      )}
      <span className="sr-only">{lang === 'ar' ? `${rating} من ٥` : `${rating} of 5`}</span>
    </div>
  );
}
