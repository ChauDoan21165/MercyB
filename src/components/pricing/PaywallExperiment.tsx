// src/components/pricing/PaywallExperiment.tsx
//
// Container that decides which paywall variant to render. Picks a
// deterministic variant on mount, logs the exposure (best-effort,
// consent-gated), and falls back to the existing `Pricing` screen
// when the experiment is disabled or returns the implicit "control"
// bucket.
//
// The container is intentionally thin: variant components are
// self-contained and own their own copy + layout. We forward an
// `onSelectPlan(key)` callback that wires into the existing checkout
// path so commerce behavior is unchanged across variants.

import { useEffect, useMemo, useState } from "react";

import {
  PAYWALL_EXPERIMENT,
  getOrMintAnonId,
  getVariant,
  markExposure,
  type Identity,
  type PaywallVariantKey,
} from "@/lib/experiments/paywallExperiment";
import BenefitsVariant from "./variants/BenefitsVariant";
import SavingsVariant from "./variants/SavingsVariant";
import SocialProofVariant from "./variants/SocialProofVariant";
import StoryVariant from "./variants/StoryVariant";
import UrgencyVariant from "./variants/UrgencyVariant";

export type PaywallExperimentProps = {
  /** Logged-in user id, or null when anonymous. */
  userId: string | null;
  /** Trial-expiration ISO timestamp for the urgency variant; null when not on trial. */
  trialExpiresAt?: string | null;
  /** Wired into the existing checkout path in `Pricing.tsx`. */
  onSelectPlan: (key: "month" | "year") => void;
  /** Render this when the experiment is disabled / control bucket. */
  controlFallback: React.ReactNode;
};

export default function PaywallExperiment({
  userId,
  trialExpiresAt,
  onSelectPlan,
  controlFallback,
}: PaywallExperimentProps) {
  const identity = useMemo<Identity | null>(() => {
    if (userId) return { kind: "user", userId };
    const anonId = getOrMintAnonId();
    if (!anonId) return null;
    return { kind: "anon", anonId };
  }, [userId]);

  const variant: PaywallVariantKey = useMemo(() => {
    if (!identity) return "control";
    return getVariant(identity, PAYWALL_EXPERIMENT);
  }, [identity]);

  useEffect(() => {
    if (!identity) return;
    if (variant === "control") return;
    void markExposure(identity, variant, PAYWALL_EXPERIMENT);
  }, [identity, variant]);

  switch (variant) {
    case "urgency":
      return (
        <UrgencyVariant
          trialExpiresAt={trialExpiresAt}
          onSelectPlan={onSelectPlan}
        />
      );
    case "benefits":
      return <BenefitsVariant onSelectPlan={onSelectPlan} />;
    case "social-proof":
      return <SocialProofVariant onSelectPlan={onSelectPlan} />;
    case "savings":
      return <SavingsVariant onSelectPlan={onSelectPlan} />;
    case "story":
      return <StoryVariant onSelectPlan={onSelectPlan} />;
    case "control":
    default:
      return <>{controlFallback}</>;
  }
}
