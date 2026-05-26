// src/lib/queries/keys.ts
//
// Typed query-key factory for @tanstack/react-query. Centralizing keys
// here prevents two callers from spelling the same query slightly
// differently and ending up with separate cache entries. Every key
// in the app should flow through `qk` — feature code never assembles
// raw arrays inline.
//
// Keys-only — no fetching logic lives here. Feature hooks import these
// keys and pass them to useQuery/useMutation alongside their own
// queryFn implementations.

export const qk = {
  /** A user's full profile row from public.profiles, keyed by auth user id. */
  profile: (userId: string) => ["profile", userId] as const,
  /** Lookup by an arbitrary profile id (e.g. legacy non-auth ids). */
  profileById: (id: string) => ["profile", "byId", id] as const,
  /** The entitlement object returned by the me-entitlement edge function. */
  entitlement: (userId: string) => ["entitlement", userId] as const,
  /** The active gift subscription for a given user, if any. */
  giftSubscription: (userId: string) => ["giftSubscription", userId] as const,
  /**
   * Feature-flag value for a specific key. userId is part of the key so
   * per-user overrides don't collide with the anonymous default.
   */
  featureFlag: (key: string, userId: string | null) =>
    ["featureFlag", key, userId] as const,
  /** The current Supabase auth user (the result of supabase.auth.getUser()). */
  authUser: () => ["auth", "user"] as const,
} as const;
