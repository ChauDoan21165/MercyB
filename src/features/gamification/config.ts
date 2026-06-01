// src/features/gamification/config.ts
//
// The module's tuning surface. Every XP amount the gamification system can
// award lives here in ONE object so the retention economy can be re-balanced
// without hunting through engines/hooks. Engines stay pure and amount-agnostic
// (callers pass the number); this table is the canonical source for those
// numbers. `goal_complete` is currently the only internally-triggered award
// (fired by useGamification when a daily goal is crossed) — the rest are the
// recommended amounts for future call sites to use.

import type { XpReason } from "./types";

/** Default XP awarded per reason. Tune the retention economy here. */
export const GAMIFICATION_XP: Record<XpReason, number> = {
  lesson_complete: 50,
  room_complete: 30,
  practice: 10,
  streak_bonus: 15,
  goal_complete: 25, // placeholder confirmed by Chau 2026-06-01 — tune here
  achievement: 20,
  manual: 0, // manual awards always pass an explicit amount; default unused
};
