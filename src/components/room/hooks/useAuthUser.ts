import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export function useAuthUser(supabase: any) {
  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getUser()
      .then(({ data }: any) => {
        if (!mounted) return;
        setAuthUser(data?.user ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        setAuthUser(null);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setAuthUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [supabase]);

  return authUser;
}
