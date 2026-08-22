import { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import { submitReview } from '@/lib/api';
import { useStore } from '@/store/StoreContext';

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { lang } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError(lang === 'ar' ? 'يرجى اختيار تقييم' : 'Please select a rating');
      return;
    }
    if (!name.trim()) {
      setError(lang === 'ar' ? 'يرجى إدخال اسمك' : 'Please enter your name');
      return;
    }
    if (!comment.trim()) {
      setError(lang === 'ar' ? 'يرجى كتابة تعليقك' : 'Please write your review');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await submitReview({
        productId,
        customerName: name.trim(),
        customerEmail: email.trim() || undefined,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
      });
      setSubmitted(true);
      onReviewSubmitted?.();
    } catch (err) {
      console.error('Review submission failed:', err);
      setError(
        lang === 'ar'
          ? 'حدث خطأ أثناء إرسال التقييم. يرجى المحاولة مرة أخرى.'
          : 'Failed to submit review. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setRating(0);
    setName('');
    setEmail('');
    setTitle('');
    setComment('');
    setSubmitted(false);
    setError(null);
    setIsOpen(false);
  };

  const t = {
    writeReview: lang === 'ar' ? 'اكتب تقييمك' : 'Write a Review',
    yourRating: lang === 'ar' ? 'تقييمك' : 'Your Rating',
    name: lang === 'ar' ? 'الاسم' : 'Name',
    nameRequired: lang === 'ar' ? 'الاسم مطلوب' : 'Name is required',
    email: lang === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)',
    reviewTitle: lang === 'ar' ? 'عنوان التقييم (اختياري)' : 'Review Title (optional)',
    yourReview: lang === 'ar' ? 'تقييمك' : 'Your Review',
    reviewHint: lang === 'ar'
      ? 'أخبر الآخرين بتجربتك مع هذا المنتج...'
      : 'Tell others about your experience with this product...',
    submit: lang === 'ar' ? 'إرسال التقييم' : 'Submit Review',
    submitting: lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...',
    successTitle: lang === 'ar' ? 'شكراً لتقييمك!' : 'Thank you for your review!',
    successDesc: lang === 'ar'
      ? 'تقييمك سيتم مراجعته وينشر قريباً.'
      : 'Your review will be published after moderation.',
    writeAnother: lang === 'ar' ? 'تقييم آخر' : 'Write Another',
    close: lang === 'ar' ? 'إغلاق' : 'Close',
  };

  return (
    <>
      {/* Trigger Button */}
      {!isOpen && !submitted && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-cream-dark bg-cream-dark/30 px-6 py-3.5 text-sm font-semibold text-ink-soft transition hover:border-accent hover:bg-accent/5 hover:text-accent"
        >
          <Star size={18} />
          {t.writeReview}
        </button>
      )}

      {/* Success State */}
      {submitted && (
        <div className="rounded-2xl border border-success/30 bg-success/5 p-6 text-center animate-fade-up">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <CheckCircle size={24} className="text-success" />
          </div>
          <h3 className="text-lg font-semibold text-ink">{t.successTitle}</h3>
          <p className="mt-1 text-sm text-ink-muted">{t.successDesc}</p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={handleReset}
              className="rounded-full border border-cream-dark px-4 py-2 text-sm text-ink-soft hover:border-ink hover:text-ink"
            >
              {t.writeAnother}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white hover:bg-accent"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      {isOpen && !submitted && (
        <div className="rounded-2xl border border-cream-dark bg-white p-6 animate-fade-up">
          <h3 className="mb-4 font-serif text-lg font-semibold text-ink">{t.writeReview}</h3>

          {error && (
            <div className="mb-4 rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">{t.yourRating}</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={`transition ${
                        star <= (hoveredStar || rating)
                          ? 'fill-sand text-sand'
                          : 'text-cream-dark'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-ink-muted">
                    {rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">{t.name} *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                placeholder={lang === 'ar' ? 'اسمك' : 'Your name'}
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">{t.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                dir="ltr"
                placeholder="email@example.com"
              />
            </div>

            {/* Title */}
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">{t.reviewTitle}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                placeholder={lang === 'ar' ? 'ملخص سريع' : 'Summary of your experience'}
              />
            </div>

            {/* Comment */}
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">{t.yourReview} *</label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-cream-dark px-4 py-2.5 text-sm outline-none focus:border-accent"
                placeholder={t.reviewHint}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-cream-dark px-5 py-2.5 text-sm font-medium text-ink-soft hover:border-ink hover:text-ink"
              >
                {t.close}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent disabled:opacity-60"
              >
                {submitting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Send size={14} />
                )}
                {submitting ? t.submitting : t.submit}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
