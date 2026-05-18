// src/router/AnonymousOnboardingGate.tsx
//
// Anonymous entry gate for `/` ONLY (locked #14 — Chau-confirmed
// doctrine: the Duolingo-style picker fires for anonymous visitors as
// the entry point, BEFORE signup).
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
//   - anonymous + no stored pair      → redirect to the picker. The
//                                       picker writes the pair on finish
//                                       AND skip, so it cannot loop.
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
}: {
  children: React.ReactNode;
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
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
