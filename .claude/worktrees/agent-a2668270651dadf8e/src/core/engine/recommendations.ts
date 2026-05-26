/**
 * FILE: src/core/engine/recommendations.ts
 * PATH: src/core/engine/recommendations.ts
 * VERSION: recommendations.ts v1.0
 *
 * Purpose:
 * - Choose what the learner should do next.
 * - Works with simple curriculum shapes: modules/drills each tagged with skills.
 * - Deterministic selection (seeded) to keep UX stable.
 */

import type { SkillId, MasteryState } from "./mastery";

export interface DrillRef {
  drillId: string;
  title: string;
  kind: "read" | "listen" | "shadow" | "speak" | "write" | "quiz";
  skills: SkillId[];
  difficulty: 1 | 2 | 3 | 4 | 5; // relative within level
}

export interface ModuleRef {
  moduleId: string;
  title: string;
  drills: DrillRef[];
}

export interface RecommendInput {
  levelId: number;
  mastery: MasteryState;

  // Past completions to avoid repetition
  completedDrillIds: string[];

  // “Today focus” override
  focusSkill?: SkillId;

  // Stable seed: userId or roomId + day
  seed: string;

  modules: ModuleRef[];
}

export interface RecommendResult {
  recommendedModuleId: string;
  recommendedDrillId: string;
  reason: string;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function stableHash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function stablePick<T>(items: T[], seed: string): T {
  if (items.length === 0) throw new Error("stablePick: empty");
  if (items.length === 1) return items[0];
  const h = stableHash(seed);
  return items[h % items.length];
}

function weakestSkill(mastery: MasteryState, only?: SkillId[]): SkillId {
  const skills = only ?? (Object.keys(mastery) as SkillId[]);
  let best = skills[0];
  let bestV = mastery[best].value;
  for (const s of skills) {
    if (mastery[s].value < bestV) {
      best = s;
      bestV = mastery[s].value;
    }
  }
  return best;
}

function drillFitScore(drill: DrillRef, target: SkillId, mastery: MasteryState): number {
  // Prefer drills that include target, and also cover other weak skills
  const includesTarget = drill.skills.includes(target) ? 1 : 0;

  const weakness =
    drill.skills.reduce((sum, s) => sum + (1 - mastery[s].value), 0) /
    Math.max(1, drill.skills.length);

  // Slight preference for medium difficulty
  const diffPref = 1 - Math.abs(drill.difficulty - 3) / 4; // 0..1

  // Fit = target + weakness + difficulty preference
  return includesTarget * 2 + weakness * 1.2 + diffPref * 0.6;
}

export function recommendNext(input: RecommendInput): RecommendResult {
  const completed = new Set(input.completedDrillIds ?? []);

  const focus = input.focusSkill ?? weakestSkill(input.mastery);

  // Flatten all drills with module context
  const candidates: Array<{ moduleId: string; drill: DrillRef }> = [];
  for (const m of input.modules) {
    for (const d of m.drills) {
      if (!completed.has(d.drillId)) candidates.push({ moduleId: m.moduleId, drill: d });
    }
  }

  // If all completed, allow repeats but still pick intelligently
  const pool =
    candidates.length > 0
      ? candidates
      : input.modules.flatMap((m) =>
          m.drills.map((d) => ({ moduleId: m.moduleId, drill: d }))
        );

  // Score each candidate
  const scored = pool
    .map((c) => ({
      ...c,
      score: drillFitScore(c.drill, focus, input.mastery),
    }))
    .sort((a, b) => b.score - a.score);

  // Take top N then stable-pick for variety without randomness
  const topN = scored.slice(0, Math.max(3, Math.min(8, scored.length)));
  const picked = stablePick(topN, `${input.seed}:${input.levelId}:${focus}`);

  return {
    recommendedModuleId: picked.moduleId,
    recommendedDrillId: picked.drill.drillId,
    reason: `Focus on ${focus} (your weakest area today).`,
  };
}