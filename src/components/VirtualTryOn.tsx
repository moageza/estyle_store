import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { generateTryOn } from '@/lib/virtualTryOn';
import { useStore } from '@/store/StoreContext';
import { tr } from '@/data/translations';

interface VirtualTryOnProps {
  productName: string;
  productImage: string;
  productDescription?: string;
}

export function VirtualTryOn({ productName, productImage, productDescription }: VirtualTryOnProps) {
  const { lang } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(lang === 'ar' ? 'يرجى اختيار صورة فقط' : 'Please select an image only');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPersonImage(ev.target?.result as string);
      setError(null);
      setResultImage(null);
    };
    reader.readAsDataURL(file);
  }, [lang]);

  const handleTryOn = async () => {
    if (!personImage) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateTryOn(
        personImage,
        productImage,
        productDescription,
      );
      setResultImage(result);
    } catch (err) {
      console.error('Try-on failed:', err);
      setError(
        lang === 'ar'
          ? 'حدث خطأ أثناء المعالجة. يرجى المحاولة مرة أخرى.'
          : 'Processing failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPersonImage(null);
    setResultImage(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const tryOnLabel = lang === 'ar' ? 'جرّب الملابس بالذكاء الاصطناعي' : 'AI Virtual Try-On';
  const uploadLabel = lang === 'ar' ? 'ارفع صورتك الشخصية' : 'Upload your photo';
  const uploadHint = lang === 'ar'
    ? 'ارفع صورة واضحة لجسمك الكامل من الأمام للحصول على أفضل نتيجة'
    : 'Upload a clear full-body photo from the front for best results';
  const generateLabel = lang === 'ar' ? 'اعرض النتيجة' : 'See Result';
  const resetLabel = lang === 'ar' ? 'صورة جديدة' : 'New Photo';
  const loadingLabel = lang === 'ar' ? 'جاري المعالجة بالذكاء الاصطناعي...' : 'AI is generating your try-on...';
  const loadingHint = lang === 'ar'
    ? 'قد يستغرق ذلك 15-30 ثانية'
    : 'This may take 15-30 seconds';
  const resultLabel = lang === 'ar' ? 'هكذا ستبدو!' : 'This is how you look!';
  const tryAnother = lang === 'ar' ? 'جرّب صورة أخرى' : 'Try Another Photo';

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2.5 rounded-full border-2 border-dashed border-accent/40 bg-accent/5 px-6 py-3.5 text-sm font-semibold text-accent transition-all hover:border-accent hover:bg-accent/10 hover:shadow-soft"
      >
        <Sparkles size={18} className="text-accent" />
        {tryOnLabel}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-soft animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cream-dark px-6 py-4">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-accent" />
                <h3 className="font-serif text-lg font-semibold text-ink">{tryOnLabel}</h3>
              </div>
              <button
                onClick={() => { setIsOpen(false); handleReset(); }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-cream-dark hover:text-ink"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {!resultImage ? (
                /* Upload & Preview Stage */
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Person photo upload */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-ink">{uploadLabel}</p>
                    <div
                      onClick={() => !personImage && fileInputRef.current?.click()}
                      className={`relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
                        personImage
                          ? 'border-accent bg-accent/5'
                          : 'border-cream-dark bg-cream-dark/50 hover:border-accent hover:bg-accent/5'
                      }`}
                    >
                      {personImage ? (
                        <>
                          <img
                            src={personImage}
                            alt="Your photo"
                            className="h-full w-full object-cover"
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); handleReset(); }}
                            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3 px-4 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark">
                            <Camera size={28} className="text-ink-muted" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-ink">
                              <Upload size={14} className="me-1 inline" />
                              {uploadLabel}
                            </p>
                            <p className="mt-1 text-xs text-ink-muted">{uploadHint}</p>
                          </div>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Product preview + Generate button */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-ink">
                      {lang === 'ar' ? 'المنتج المختار' : 'Selected Product'}
                    </p>
                    <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-cream-dark">
                      <img
                        src={productImage}
                        alt={productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-2 text-center text-sm text-ink-soft">{productName}</p>

                    <button
                      onClick={handleTryOn}
                      disabled={!personImage || loading}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {loadingLabel}
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          {generateLabel}
                        </>
                      )}
                    </button>
                    {loading && (
                      <p className="mt-2 text-center text-xs text-ink-muted">{loadingHint}</p>
                    )}
                  </div>
                </div>
              ) : (
                /* Result Stage */
                <div>
                  <p className="mb-4 text-center text-sm font-semibold text-accent">{resultLabel}</p>
                  <div className="mx-auto max-w-md overflow-hidden rounded-2xl bg-cream-dark">
                    <img
                      src={resultImage}
                      alt="Try-on result"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-6 flex justify-center gap-3">
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 rounded-full border border-cream-dark px-5 py-2.5 text-sm font-medium text-ink-soft transition hover:border-ink hover:text-ink"
                    >
                      <Camera size={16} />
                      {tryAnother}
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent"
                    >
                      {lang === 'ar' ? 'إغلاق' : 'Close'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
