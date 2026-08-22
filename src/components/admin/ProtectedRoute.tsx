import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAdmin } from '@/lib/api';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) {
        navigate('/admin/login', { replace: true });
        return;
      }
      const admin = await isAdmin();
      if (!admin) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setAuthorized(true);
    })();
  }, [navigate]);

  if (authorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream-dark border-t-accent" />
      </div>
    );
  }

  return <>{children}</>;
}
