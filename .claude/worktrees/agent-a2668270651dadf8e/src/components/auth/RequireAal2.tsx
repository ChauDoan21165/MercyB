/**
 * Path: src/components/auth/RequireAal2.tsx
 *
 * Route guard that forces aal=2 for users who have a verified MFA
 * factor enrolled. The companion to migration 20260529 — that
 * migration enforces the same rule at the database layer via RLS;
 * this component enforces it at the UX layer so users see a clear
 * "enter your code" page rather than blank/error pages from RLS-
 * blocked queries.
 *
 * Behavior:
 *   1. While the assurance level is loading: render nothing (avoid
 *      flashing the protected content for one paint).
 *   2. If the user is at aal=2 OR has no verified factor: render
 *      children — they're either fully authenticated or they don't
 *      have MFA at all.
 *   3. If the user is at aal=1 with a verified factor: redirect to
 *      /auth/challenge?next=<original-path>. After they enter their
 *      TOTP code the challenge page bounces them back here, the
 *      guard re-checks, and renders children.
 *
 * Compose with RequireAuth, e.g.:
 *   <RequireAuth>
 *     <RequireAal2>
 *       <SecuritySettingsPage />
 *     </RequireAal2>
 *   </RequireAuth>
 */

import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import { needsAal2Upgrade } from "@/lib/security/mfaClient";

type Status = "loading" | "ok" | "challenge_required";

export default function RequireAal2({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      // Not signed in. RequireAuth (composed above us) handles the
      // redirect to /signin. Don't fight it; just render nothing.
      setStatus("ok");
      return;
    }
    let alive = true;
    setStatus("loading");
    (async () => {
      try {
        const required = await needsAal2Upgrade();
        if (!alive) return;
        setStatus(required ? "challenge_required" : "ok");
      } catch {
        // needsAal2Upgrade swallows errors and returns false; if we
        // somehow get here, fall through to the permissive branch so
        // an SDK hiccup doesn't lock legit users out of their account.
        // The RLS gate from migration 20260529 still blocks the
        // sensitive reads even if this client check is permissive.
        if (alive) setStatus("ok");
      }
    })();
    return () => {
      alive = false;
    };
    // Re-check whenever the user identity changes — covers sign-in,
    // sign-out, and the post-challenge redirect that moves the
    // session from aal=1 to aal=2.
  }, [authLoading, user?.id, location.pathname]);

  if (authLoading || status === "loading") {
    // Match RequireAuth's posture: render nothing during the auth-
    // resolving window so the protected page doesn't paint and then
    // get yanked.
    return null;
  }

  if (status === "challenge_required") {
    const next = encodeURIComponent(
      `${location.pathname}${location.search}${location.hash}`,
    );
    return <Navigate to={`/auth/challenge?next=${next}`} replace />;
  }

  return <>{children}</>;
}
