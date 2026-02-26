// FILE: scoring.ts
// PATH: src/core/engine/scoring.ts
//
// Purpose:
// - Convert raw drill events into consistent metrics + score.
// - Deterministic, build-safe, no external deps.

export type ISODateString = string;

export type DrillKind = "read" | "listen" | "shadow" | "speak" | "write" | "quiz";

export interface DrillAttemptInput {
  drillId: string;
  kind: DrillKind;

  startedAtISO: ISODateString;
  endedAtISO: ISODateString;

  // For reading/writing metrics
  promptText?: string;
  userText?: string;

  // For quiz style
  correctCount?: number;
  totalCount?: number;

  // For speech/listening tasks where you grade later
  selfRating?: 1 | 2 | 3 | 4 | 5;

  // Optional: manual override score from teacher/host
  manualScore0to100?: number;
}

export interface DrillMetrics {
  durationSec: number;

  // accuracy is 0..1 when applicable
  accuracy?: number;

  // For text tasks
  wpm?: number;
  chars?: number;

  // 0..100
  score: number;

  // stable breakdown to power UI
  breakdown: {
    base: number;
    accuracyBonus: number;
    speedBonus: number;
    completionBonus: number;
    penalty: number;
    manualOverride?: number;
  };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function safeNumber(n: unknown, fallback = 0): number {
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}

function parseISOms(iso: string): number {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

function durationSec(startISO: string, endISO: string): number {
  const ms = Math.max(0, parseISOms(endISO) - parseISOms(startISO));
  return Math.round(ms / 1000);
}

function countWords(text: string): number {
  const s = text.trim();
  if (!s) return 0;
  return s.split(/\s+/g).filter(Boolean).length;
}

function computeWpm(text: string, seconds: number): number {
  if (seconds <= 0) return 0;
  const words = countWords(text);
  return Math.round((words / seconds) * 60);
}

/**
 * Lightweight accuracy for "write" drills:
 * - compares overlap of normalized tokens with prompt tokens
 * - does NOT do NLP; meant for MVP signals only
 */
function tokenOverlapAccuracy(prompt: string, user: string): number {
  const p = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/g)
    .filter(Boolean);

  const u = user
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/g)
    .filter(Boolean);

  if (p.length === 0) return u.length > 0 ? 1 : 0;

  const pSet = new Set(p);
  let hit = 0;
  for (const w of u) if (pSet.has(w)) hit++;

  // accuracy is "how much user text matches prompt vocabulary"
  return clamp(hit / Math.max(1, u.length), 0, 1);
}

/**
 * Main scoring:
 * - Base completion points + accuracy bonus + speed bonus
 * - Manual override wins
 */
export function scoreDrillAttempt(input: DrillAttemptInput): DrillMetrics {
  const sec = durationSec(input.startedAtISO, input.endedAtISO);
  const dur = Math.max(1, sec);

  // Manual override: strongest authority
  if (typeof input.manualScore0to100 === "number") {
    const m = clamp(Math.round(input.manualScore0to100), 0, 100);
    return {
      durationSec: dur,
      score: m,
      breakdown: {
        base: 0,
        accuracyBonus: 0,
        speedBonus: 0,
        completionBonus: 0,
        penalty: 0,
        manualOverride: m,
      },
    };
  }

  let accuracy: number | undefined = undefined;
  let wpm: number | undefined = undefined;
  let chars: number | undefined = undefined;

  // ---------- Derive accuracy ----------
  if (input.totalCount != null && input.correctCount != null) {
    const total = Math.max(0, safeNumber(input.totalCount, 0));
    const correct = clamp(safeNumber(input.correctCount, 0), 0, total);
    accuracy = total > 0 ? correct / total : 0;
  } else if (input.kind === "write" && input.promptText && input.userText != null) {
    accuracy = tokenOverlapAccuracy(input.promptText, input.userText);
  } else if (input.selfRating != null) {
    // map 1..5 -> 0.2..1.0
    accuracy = clamp(input.selfRating / 5, 0, 1);
  }

  // ---------- Derive speed ----------
  if ((input.kind === "read" || input.kind === "write") && input.userText) {
    wpm = computeWpm(input.userText, dur);
    chars = input.userText.length;
  }

  // ---------- Score composition ----------
  // base completion points
  const completionBonus = 20;

  // base varies by kind (simple MVP signal)
  const base =
    input.kind === "quiz"
      ? 40
      : input.kind === "write"
        ? 35
        : input.kind === "speak"
          ? 35
          : input.kind === "shadow"
            ? 30
            : 30;

  const acc = accuracy != null ? accuracy : 0.7; // default assumption if not measurable
  const accuracyBonus = Math.round(acc * 30); // up to +30

  // speed bonus is gentle: don’t reward rushing too much
  let speedBonus = 0;
  if (wpm != null && wpm > 0) {
    // target range 80..170 wpm for L1-L3; above that flatten
    const normalized = clamp((wpm - 80) / 90, 0, 1);
    speedBonus = Math.round(normalized * 10); // up to +10
  }

  // penalties: if extremely short attempt, reduce
  const tooShortPenalty = dur < 10 ? 25 : dur < 20 ? 10 : 0;

  let score = base + completionBonus + accuracyBonus + speedBonus - tooShortPenalty;
  score = clamp(Math.round(score), 0, 100);

  return {
    durationSec: dur,
    accuracy,
    wpm,
    chars,
    score,
    breakdown: {
      base,
      accuracyBonus,
      speedBonus,
      completionBonus,
      penalty: tooShortPenalty,
    },
  };
}

/**
 * Combine multiple drill metrics into a session score.
 * Weighting: later attempts matter slightly more.
 */
export function scoreSession(drills: DrillMetrics[]): { score: number; avgAccuracy?: number } {
  if (drills.length === 0) return { score: 0 };

  let totalWeight = 0;
  let weighted = 0;

  let accTotal = 0;
  let accCount = 0;

  for (let i = 0; i < drills.length; i++) {
    const w = 1 + i * 0.15; // gentle ramp
    totalWeight += w;
    weighted += drills[i].score * w;

    if (typeof drills[i].accuracy === "number") {
      accTotal += drills[i].accuracy;
      accCount++;
    }
  }

  const score = clamp(Math.round(weighted / totalWeight), 0, 100);
  const avgAccuracy = accCount > 0 ? accTotal / accCount : undefined;

  return { score, avgAccuracy };
}