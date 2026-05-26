import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { qk } from "@/lib/queries/keys";

/**
 * Shared react-query fetch for `supabase.auth.getUser()`.
 *
 * Why this exists: before this hook, ~10 components per page each called
 * `supabase.auth.getUser()` independently. Routing all React-tree callers
 * through this hook (or `useAuth().user`) collapses that to one network
 * round-trip per session.
 *
 * Prefer `useAuth().user` from <AuthProvider> when the caller does not
 * need the unverified-session case — it's synchronous and free. Use this
 * hook only when you need the raw user (e.g. unverified email cohorts).
 */
export function useAuthUserQuery() {
  return useQuery<User | null>({
    queryKey: qk.authUser(),
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        if (import.meta.env.DEV) {
          console.warn("[useAuthUserQuery] getUser failed:", error.message);
        }
        return null;
      }
      return data.user ?? null;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
