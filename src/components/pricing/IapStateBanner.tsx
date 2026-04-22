// src/components/pricing/IapStateBanner.tsx
//
// Small bilingual status banner used by the iOS IAP flow. Matches the
// visual language of the other Pricing.tsx status panels (amber =
// warning/info, emerald = success, rose = error). Kept as a tiny shared
// component so IapPlanCard stays focused on flow logic.

import React from "react";

export type IapBannerKind = "success" | "error" | "info" | "pending";

interface IapStateBannerProps {
  kind: IapBannerKind;
  en: string;
  vi: string;
}

const palette: Record<IapBannerKind, { border: string; bg: string; title: string; sub: string }> = {
  success: {
    border: "rgba(13,148,136,0.22)",
    bg: "rgba(240,253,250,0.96)",
    title: "#115e59",
    sub: "#5eead4",
  },
  error: {
    border: "rgba(239,68,68,0.20)",
    bg: "rgba(254,242,242,0.95)",
    title: "#991b1b",
    sub: "#b91c1c",
  },
  info: {
    border: "rgba(59,130,246,0.20)",
    bg: "rgba(239,246,255,0.96)",
    title: "#1e3a8a",
    sub: "#2563eb",
  },
  pending: {
    border: "rgba(245,158,11,0.25)",
    bg: "rgba(255,251,235,0.95)",
    title: "#92400e",
    sub: "#b45309",
  },
};

export default function IapStateBanner({ kind, en, vi }: IapStateBannerProps) {
  const colors = palette[kind];
  return (
    <div
      style={{
        marginBottom: 12,
        padding: "12px 14px",
        borderRadius: 14,
        border: `1px solid ${colors.border}`,
        background: colors.bg,
      }}
      role={kind === "error" ? "alert" : "status"}
    >
      <div style={{ fontWeight: 700, color: colors.title }}>{en}</div>
      <div style={{ fontSize: 12, color: colors.sub, marginTop: 2 }}>{vi}</div>
    </div>
  );
}
