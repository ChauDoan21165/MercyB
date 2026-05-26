// src/server/host/tierPolicy.ts

export type TierPolicy = {
  depth: "short" | "medium" | "high";
  maxTurns: number;
  allowDeepPhonetics: boolean;
};

export function getTierPolicy(vipRank: number): TierPolicy {
  if (vipRank >= 3) {
    return {
      depth: "high",
      maxTurns: 6,
      allowDeepPhonetics: true,
    };
  }

  if (vipRank >= 2) {
    return {
      depth: "medium",
      maxTurns: 4,
      allowDeepPhonetics: true,
    };
  }

  return {
    depth: "short",
    maxTurns: 2,
    allowDeepPhonetics: false,
  };
}