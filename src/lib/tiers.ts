// src/lib/tiers.ts
// MB-BLUE-97.1 — 2025-12-28 (+0700)
// Tier Spine (AUTHORITATIVE)

export type TierId =
  | "free"
  | "vip1"
  | "vip2"
  | "vip3"
  | "vip3_ext"
  | "vip4"
  | "vip5"
  | "vip6"
  | "vip7"
  | "vip8"
  | "vip9";

export type TierColumn = "english" | "core" | "living";

export interface TierDef {
  id: TierId;
  label: string;
  description: string;
  column: TierColumn;
  order: number;
}

export const CORE_TIERS: TierDef[] = [
  { id: "free", label: "Free", description: "Life foundations", column: "core", order: 0 },
  { id: "vip1", label: "VIP 1", description: "Stability & habits", column: "core", order: 1 },
  { id: "vip2", label: "VIP 2", description: "Self-regulation", column: "core", order: 2 },
  { id: "vip3", label: "VIP 3", description: "Depth & meaning", column: "core", order: 3 },
  { id: "vip3_ext", label: "VIP 3 II", description: "Sexuality, finance, shadow", column: "core", order: 4 },
  { id: "vip4", label: "VIP 4", description: "Career choosing", column: "core", order: 5 },
  { id: "vip5", label: "VIP 5", description: "Advanced English writing", column: "core", order: 6 },
  { id: "vip6", label: "VIP 6", description: "Psychology", column: "core", order: 7 },
  { id: "vip7", label: "VIP 7", description: "Reserved", column: "core", order: 8 },
  { id: "vip8", label: "VIP 8", description: "Reserved", column: "core", order: 9 },
  { id: "vip9", label: "VIP 9", description: "Strategy mindset", column: "core", order: 10 },
];
