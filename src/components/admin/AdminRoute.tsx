cat << 'EOF' > src/components/admin/AdminRoute.tsx
/**
 * AdminRoute — v84.0
 * Mercy Blade Blue Launch
 *
 * Purpose:
 * - Route guard for /admin
 * - Blocks access when no Supabase auth session exists
 * - Redirects unauthenticated users to /login
 *
 * Status:
 * - Phase I stable
 * - No role enforcement yet (admin role comes later)
 * - Runtime-only logic, no build-time side effects
 *
 * Last verified:
 * - validate-rooms: PASS
 * - vite build: PASS
 * - /admin loads without runtime error
 */

import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Props = { children: ReactNode };

export function AdminRoute({ children }: Props) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsAuthed(!!data.session);
      setLoading(false);
    }

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (mounted) setIsAuthed(!!session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
EOF
