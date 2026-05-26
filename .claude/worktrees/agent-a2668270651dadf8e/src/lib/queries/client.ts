// src/lib/queries/client.ts
//
// Single, shared QueryClient for the whole app. Defaults are tuned for
// MercyBlade's particular shape, NOT React Query's stock recommendations:
//
//   staleTime: 30s
//     Most of the data we cache (profile, entitlement, feature flags,
//     gift subscriptions) changes on the order of minutes, not seconds.
//     30s is short enough to feel live during active editing, long
//     enough to absorb the burst of remounts that happen during
//     route transitions.
//
//   gcTime: 5 min
//     Hold cached results in memory for a few extra minutes after the
//     last subscriber unmounts. Cheap, and avoids re-fetching when the
//     user navigates away and comes back.
//
//   refetchOnWindowFocus / refetchOnReconnect: false
//     Aggressive refetch-on-focus is the right default for an admin
//     dashboard, not a learner app. We don't want the chat / lesson UI
//     to thrash when the user tabs back.
//
//   refetchOnMount: false  *** important ***
//     28 components call useEntitlements() across the app. If every
//     remount triggered a re-fetch, the cache would be useless — every
//     route transition would hit the network N times. With this off,
//     a remount serves the cached value immediately and only refetches
//     if it's stale (older than staleTime).
//
//   retry: 1
//     One retry for transient network blips. More than that and slow
//     failures pile up and hurt time-to-error for the user.

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});
