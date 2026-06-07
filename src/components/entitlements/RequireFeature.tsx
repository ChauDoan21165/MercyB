// src/components/entitlements/RequireFeature.tsx
import React from "react";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useEntitlements } from "@/lib/useEntitlements";

export default function RequireFeature({
  flag,
  fallback = null,
  children,
}: {
  flag: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const access = useUserAccess();
  const { loading, hasFlag, ent } = useEntitlements();

  if (loading || access.isLoading) return <>{fallback}</>;
  if (!ent) return <>{fallback}</>;

  const normalized = String(flag || "").trim().toLowerCase();

  if (normalized === "premium" || normalized === "is_premium") {
    return access.hasPremium ? <>{children}</> : <>{fallback}</>;
  }

  const vipMatch = normalized.match(/^vip(\d+)$/);
  if (vipMatch) {
    const requiredRank = Number(vipMatch[1]);
    return (ent.vip_rank ?? 0) >= requiredRank
      ? <>{children}</>
      : <>{fallback}</>;
  }

  const ok = hasFlag(normalized, false);
  if (!ok) return <>{fallback}</>;

  return <>{children}</>;
}
