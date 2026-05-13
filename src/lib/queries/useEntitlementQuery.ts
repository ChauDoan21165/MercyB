import { useQuery } from "@tanstack/react-query";
import {
  FAIL_CLOSED_ENTITLEMENT,
  fetchCurrentEntitlement,
  type BackendEntitlement,
} from "@/lib/authService";
import { qk } from "@/lib/queries/keys";

/**
 * Shared react-query fetch for the `me-entitlement` Supabase Edge
 * Function.
 *
 * Why this exists: ~28 components/hooks across the app called
 * `useEntitlements()` (and through it, `fetchCurrentEntitlement`)
 * independently per render. Each call invoked the `me-entitlement`
 * function, producing 14+ duplicate network round-trips per page load.
 * Routing every caller through a single react-query key (keyed on the
 * user id) collapses them into one shared in-flight request and one
 * cache entry under the QueryClient's `staleTime` window.
 *
 * Anonymous users: when `userId` is null/empty the query is disabled —
 * no network call is made and `data` is `undefined`. The wrapper hook
 * (`useEntitlements`) treats that as "no entitlement" without calling
 * the edge function.
 */
export function useEntitlementQuery(userId: string | null) {
  return useQuery<BackendEntitlement>({
    queryKey: qk.entitlement(userId ?? ""),
    enabled: Boolean(userId),
    queryFn: async () => {
      const result = await fetchCurrentEntitlement();
      return result ?? FAIL_CLOSED_ENTITLEMENT;
    },
  });
}
