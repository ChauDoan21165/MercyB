// src/components/exam-prep/toefl/PremiumGate.tsx
//
// TOEFL premium gate — follows the same pattern as IELTS PremiumGate.
// Renders children for premium users; shows an upgrade CTA for free users.
//
// TODO(TOEFL): Wire to real premium check when TOEFL gating policy is
//   finalised. Currently pass-through (same as early IELTS days before
//   the premium flag was wired).

import React from "react";
import { TOEFL_COPY } from "./TOEFLCopy";

// TODO(TOEFL): Replace with real premium check hook when ready.
//   const { isPremium } = usePremiumAccess();
const TOEFL_IS_PREMIUM_GATED = false; // Set to true when Chau enables TOEFL paywall

export function TOEFLPremiumGate({ children }: { children: React.ReactNode }) {
  // TODO(TOEFL): Wire real premium check:
  //   if (!isPremium && TOEFL_IS_PREMIUM_GATED) { ... show upgrade CTA ... }

  // Pass-through for now — show content to all auth'd users.
  // The route-level RequireAuth already gates unauthenticated users.
  if (TOEFL_IS_PREMIUM_GATED) {
    return (
      <div className="rounded-xl border border-primary/15 bg-white/80 p-6 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          {TOEFL_COPY.premiumOnlyTitle.vi}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {TOEFL_COPY.premiumOnlyBody.vi}
        </p>
        <a
          href="/pricing"
          className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"
        >
          {TOEFL_COPY.upgradeCta.vi}
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
