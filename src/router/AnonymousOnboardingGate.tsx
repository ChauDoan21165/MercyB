// src/router/AnonymousOnboardingGate.tsx
//
// Anonymous entry gate for `/` ONLY.
//
// DOCTRINE UPDATE (Chau-directed 2026-05-18, marketing landing audit
// strategic ask #1 — answered "yes, build the landing page"). This
// SUPERSEDES the earlier reading of locked #14 that "the picker IS the
// anonymous entry point". The picker is unchanged and still owns
// learning setup; it is now reached via the landing page's CTA and is
// still directly addressable at /onboarding. A first-time anonymous
// visitor now sees the marketing landing (the `firstTimeAnonymous`
// element) instead of being bounced straight into the survey — do not
// "restore" the old /onboarding redirect; this is the intended design.
//
// Scoped deliberately to the root route. Kids mode, deep links
// (/room/:id, /kids), /pricing, /auth callbacks, blog and SEO pages are
// NOT gated — CLAUDE.md #2 ("Kids mode is sacred. No login friction.")
// and the operating discipline ("Core path survives optional
// failures"). Wrapping only <Route path="/"> keeps this contained.
//
//   - signed-in                       → render Home. Home's own profile
//                                       gate (native_language IS NULL)
//                                       handles onboarding for logged-in
//                                       users — byte identical for the
//                                       95% (locked #14).
//   - anonymous + stored pair (return)→ render Home. Home reads the
//                                       localStorage pair for pair-aware
//                                       rendering.
//   - anonymous + no stored pair      → render `firstTimeAnonymous`
//                                       (the marketing landing). Falls
//                                       back to the legacy /onboarding
//                                       redirect when the prop is not
//                                       supplied, so any non-root reuse
//                                       keeps the old contract.
//
// Uses the same resolved-auth cache as RequireAuth (src/router/
// AppRouter.tsx) so a token-refresh isLoading flip — which fires on tab
// focus via the Supabase auth client — never bounces a returning user
// into the picker.

import React, { useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { hasAnonymousPair } from "@/lib/languagePair/anonymousPair";

export function AnonymousOnboardingGate({
  children,
  firstTimeAnonymous,
}: {
  children: React.ReactNode;
  /** What a first-time anonymous visitor (no user, no stored pair)
   *  sees. The `/` route passes the marketing landing. When omitted,
   *  the gate keeps its legacy behavior and redirects to /onboarding. */
  firstTimeAnonymous?: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  const hasResolvedRef = useRef(false);
  const lastUserRef = useRef<typeof user>(null);
  if (!isLoading) {
    hasResolvedRef.current = true;
    lastUserRef.current = user;
  }

  // Before auth ever resolves, render Home (it shows its own skeleton).
  // Never blank or bounce the common paths (signed-in / returning
  // anonymous) on a transient first-paint flip; only a true first-time
  // anonymous visitor briefly sees Home before the redirect settles.
  const effectiveUser =
    hasResolvedRef.current && isLoading ? lastUserRef.current : user;

  if (hasResolvedRef.current && !effectiveUser && !hasAnonymousPair()) {
    return firstTimeAnonymous !== undefined ? (
      <>{firstTimeAnonymous}</>
    ) : (
      <Navigate to="/onboarding" replace />
    );
  }

  return <>{children}</>;
}
