import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

// This guard prevents mounting admin queries. Database RLS remains the security boundary.
export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, session, loading } = useAuth();
  const token = session?.access_token;
  const userId = user?.id;
  const [access, setAccess] = useState<{ token: string; userId: string; allowed: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setAccess(null);
    if (!loading && userId && token) {
      const check = async () => {
        try {
          const { data, error } = await supabase.rpc('is_admin');
          if (!cancelled) setAccess({ token, userId, allowed: !error && data === true });
        } catch {
          if (!cancelled) setAccess({ token, userId, allowed: false });
        }
      };
      void check();
    }
    return () => { cancelled = true; };
  }, [loading, userId, token]);

  if (loading) return <p role="status">Vérification de l’accès…</p>;
  if (!user || !token) return <Navigate to="/login" replace />;
  if (!access || access.token !== token || access.userId !== user.id) {
    return <p role="status">Vérification de l’accès…</p>;
  }
  if (!access.allowed) {
    return <div className="min-h-screen flex items-center justify-center"><p role="alert">Accès refusé. Cette page est réservée aux administrateurs.</p></div>;
  }
  return <>{children}</>;
}
