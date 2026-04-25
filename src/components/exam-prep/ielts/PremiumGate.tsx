// src/components/exam-prep/ielts/PremiumGate.tsx
//
// Wraps a premium-only IELTS surface. Free users see an upsell card;
// premium users see the children. We deliberately render an in-page
// gate (instead of redirecting) so deep-linked users still see what
// they're paying for and get a clear upgrade affordance.

import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEntitlements } from "@/lib/useEntitlements";
import { IELTS_COPY } from "./ieltsCopy";

interface PremiumGateProps {
  children: React.ReactNode;
}

export function PremiumGate({ children }: PremiumGateProps) {
  const { ent, loading } = useEntitlements();

  if (loading) {
    return null;
  }

  const isPremium = ent?.is_premium === true;
  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
      <div className="flex items-start gap-3">
        <Lock size={20} className="mt-0.5 text-primary" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">
            {IELTS_COPY.premiumOnlyTitle.vi}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {IELTS_COPY.premiumOnlyBody.vi}
          </p>
          <Button asChild className="mt-3" size="sm">
            <Link to="/pricing">{IELTS_COPY.upgradeCta.vi}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
