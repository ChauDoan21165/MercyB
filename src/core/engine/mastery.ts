/**
 * FILE: src/core/engine/mastery.ts
 * VERSION: mastery.ts v1.1
 *
 * Purpose:
 * - Track mastery per skill as an EMA (0..1).
 * - Compute gate readiness for a level.
 * - Deterministic, no dependencies.
 */

import type {
  SkillId,
  GateDefinition as GateCriteria,
} from "../types/curriculum";

export type { SkillId };

export interface SkillMastery {
  value: number; // 0..1
  updatedAtISO: string; // ISO
}

export type MasteryState = Record<SkillId, SkillMastery>;

export interface MasteryUpdateInput {
  skill: SkillId;
  score0to100: number; // 0..100
  accuracy0to1?: number; // 0..1
  atISO: string;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function to0to1(score0to100: number): number {
  return clamp(score0to100 / 100, 0, 1);
}

export const ALL_SKILLS: SkillId[] = [
  "listening",
  "reading",
  "speaking",
  "writing",
  "vocabulary",
  "grammar",
  "pronunciation",
];

function ensureSkill(state: Partial<MasteryState>, skill: SkillId): SkillMastery {
  const existing = state[skill];
  if (existing) return existing;
  return { value: 0.2, updatedAtISO: new Date(0).toISOString() };
}

/**
 * EMA update:
 * - alpha higher when accuracy is high and score is high (trust signal)
 * - alpha lower when uncertain
 */
export function updateMastery(
  prev: Partial<MasteryState>,
  input: MasteryUpdateInput
): MasteryState {
  const next: Partial<MasteryState> = { ...prev };

  const old = ensureSkill(prev, input.skill);
  const s = to0to1(input.score0to100);
  const acc =
    typeof input.accuracy0to1 === "number"
      ? clamp(input.accuracy0to1, 0, 1)
      : 0.7;

  // Trust: 0.08..0.22
  const alpha = clamp(0.08 + 0.14 * (0.5 * s + 0.5 * acc), 0.08, 0.22);

  const updated = clamp(old.value * (1 - alpha) + s * alpha, 0, 1);

  next[input.skill] = {
    value: updated,
    updatedAtISO: input.atISO,
  };

  // Ensure stable shape
  const full: MasteryState = {} as MasteryState;
  for (const k of ALL_SKILLS) {
    full[k] = ensureSkill(next, k);
  }
  return full;
}

export interface GateState {
  attemptsInLevel: number;
  lastLevelId: number;
}

export interface GateResult {
  ready: boolean;
  average: number; // 0..1
  missingSkills: SkillId[];
  reasons: string[];
}

export function computeGate(
  mastery: MasteryState,
  gate: GateCriteria,
  state: GateState
): GateResult {
  const avg =
    ALL_SKILLS.reduce((sum, s) => sum + (mastery[s]?.value ?? 0), 0) /
    Math.max(1, ALL_SKILLS.length);

  const missingSkills: SkillId[] = [];
  for (const [skill, min] of Object.entries(gate.minPerSkill)) {
    const sk = skill as SkillId;
    const threshold = min ?? 0;
    if ((mastery[sk]?.value ?? 0) < threshold) {
      missingSkills.push(sk);
    }
  }

  const reasons: string[] = [];
  if (state.attemptsInLevel < gate.minAttempts) {
    reasons.push(`Need ${gate.minAttempts - state.attemptsInLevel} more practice sessions.`);
  }
  if (avg < gate.minAverage) {
    reasons.push("Average mastery is below target.");
  }
  if (missingSkills.length > 0) {
    reasons.push("Some skills are below required level.");
  }

  const ready =
    state.attemptsInLevel >= gate.minAttempts &&
    avg >= gate.minAverage &&
    missingSkills.length === 0;

  return { ready, average: avg, missingSkills, reasons };
}

/**
 * UI helper:
 * Convert mastery objects -> { skill: number } for display + Mercy Host messages.
 */
export function masteryToValues(
  mastery: Partial<MasteryState> | null | undefined
): Record<string, number> {
  const out: Record<string, number> = {};
  if (!mastery) return out;
  for (const k of ALL_SKILLS) {
    out[k] = clamp(mastery[k]?.value ?? 0, 0, 1);
  }
  return out;
}