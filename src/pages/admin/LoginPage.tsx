import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { signIn } from '@/lib/api';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream">
            <Sparkles size={24} />
          </span>
          <h1 className="mt-4 font-serif text-2xl font-bold text-ink">eStyle Admin</h1>
          <p className="mt-1 text-sm text-ink-muted">Sign in to manage your store</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-cream-dark bg-white p-6 shadow-card"
        >
          {error && (
            <div className="mb-4 rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-ink-soft">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
              dir="ltr"
              placeholder="admin@estyle.com"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-xs font-medium text-ink-soft">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 pe-12 text-sm text-ink outline-none transition focus:border-accent"
                dir="ltr"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-semibold text-white transition hover:bg-accent disabled:opacity-60"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
