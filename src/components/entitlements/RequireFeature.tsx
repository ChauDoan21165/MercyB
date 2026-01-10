// src/components/entitlements/RequireFeature.tsx
import React from "react";
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
  const { loading, hasFlag, ent } = useEntitlements();

  if (loading) return <>{fallback}</>;
  if (!ent) return <>{fallback}</>; // not signed in or no row yet

  const ok = hasFlag(flag, false);
  if (!ok) return <>{fallback}</>;

  return <>{children}</>;
}
