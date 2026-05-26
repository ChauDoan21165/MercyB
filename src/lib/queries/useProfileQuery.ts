// src/lib/queries/useProfileQuery.ts
//
// Shared react-query fetch for a row from `public.profiles`, keyed by
// auth user id.
//
// Why this exists: before this hook, 25+ components reached for
// `supabase.from("profiles").select(...).eq("id", uid)` directly on
// render. A single page load (Home, AccountPage, MercyGuide, etc.)
// produced ~33 duplicate profile reads. Routing all React-tree readers
// through this hook collapses those to one network round-trip per
// session-userId — every additional caller is a cache hit.
//
// The query fetches the full row (`select("*")`) so that different
// components subscribed to different columns all share the same cache
// entry under `qk.profile(userId)`. If a caller only needs one field
// it destructures from the returned row — no per-caller cache
// fragmentation.
//
// KEEP DIRECT (do not migrate to this hook):
//   - Writes (update / upsert / insert) — no cache layer for those
//   - Admin bulk reads (.in() or all-rows) — intentionally separate
//   - Non-React contexts (utility modules, edge functions, boot code)
//     can't call hooks; use supabase directly or queryClient.fetchQuery
//   - Lookups by non-id columns (email, username) — different key shape

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { qk } from "@/lib/queries/keys";

export type ProfileRow = Record<string, unknown> & { id?: string | null };

export function useProfileQuery(userId: string | null | undefined) {
  return useQuery<ProfileRow | null>({
    queryKey: qk.profile(userId ?? ""),
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId as string)
        .maybeSingle();
      if (error) {
        if (import.meta.env.DEV) {
          console.warn("[useProfileQuery] read failed:", error.message);
        }
        throw error;
      }
      return (data as ProfileRow | null) ?? null;
    },
  });
}
