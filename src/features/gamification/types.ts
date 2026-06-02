// src/features/gamification/types.ts
//
// Lane F — Gamification module. THE CONTRACT.
//
// Every engine (F1 streak, F2 xp, F3 daily-goal, F4 achievements), the store
// (F5), and the UI (F6) build ONLY against the types in this file. Nothing in
// here imports from outside the module — it is a leaf with zero runtime deps,
// so all six work-streams can compile against it in parallel without touching
// each other's files.
//
// Design rules (mirror docs/offline-lite-v1.md philosophy):
//   - Engines are PURE reducers: (state, event) -> result. No I/O, no Date.now()
//     inside them — callers pass `today: IsoDate` / `now: number` so behaviour
//     is deterministic and trivially testable.
//   - Persistence hides behind `GamificationStore`. The shipping impl is
//     IndexedDB (client-first); a server-backed impl can satisfy the same
//     interface later WITHOUT changing any engine or component. Supabase-swap
//     ready, but NO new tables/migrations today.
//   - Default OFF behind FEATURE_GAMIFICATION. See ./flag.ts.

/** Bump when the persisted shape changes in a non-additive way. */
export const GAMIFICATION_SCHEMA_VERSION = 1;

/**
 * A calendar day in the learner's LOCAL timezone, formatted `YYYY-MM-DD`.
 * Streaks and daily goals are reckoned per local day, never per UTC instant —
 * a learner in Hanoi who studies at 11pm and again at 1am has a 2-day streak.
 * Use `toIsoDate(new Date())` at the call site; engines never read the clock.
 */
export type IsoDate = string;

// ───────────────────────────── XP (F2) ──────────────────────────────

export interface XpState {
  /** Lifetime XP earned. Monotonic; never decreases. */
  totalXp: number;
  /** Cached level derived from `totalXp` (so reads don't recompute). */
  level: number;
}

export type XpReason =
  | "lesson_complete"
  | "room_complete"
  | "practice"
  | "streak_bonus"
  | "goal_complete"
  | "achievement"
  | "manual";

export interface XpAward {
  state: XpState;
  /** True iff this award pushed the learner into a higher level. */
  leveledUp: boolean;
  /** Level after the award (== state.level). */
  newLevel: number;
  /** Levels gained on this single award (usually 0 or 1, ≥1 possible). */
  levelsGained: number;
}

export interface XpLevelProgress {
  level: number;
  /** XP accumulated inside the current level. */
  intoLevel: number;
  /** XP span from this level's floor to the next level's floor. */
  neededForNext: number;
  /** intoLevel / neededForNext, clamped 0..1. */
  ratio: number;
}

export interface XpEngine {
  /** Add XP, recompute level, report whether the learner leveled up. Pure. */
  award(state: XpState, amount: number, reason: XpReason): XpAward;
  /** Level reached at a given lifetime XP. Monotonic non-decreasing. */
  levelForXp(totalXp: number): number;
  /** Cumulative XP floor required to BE at `level`. xpForLevel(1) === 0. */
  xpForLevel(level: number): number;
  /** Progress within the current level for progress bars. */
  progress(totalXp: number): XpLevelProgress;
}

// ─────────────────────────── Streak (F1) ────────────────────────────

export interface StreakState {
  current: number;
  longest: number;
  /** Last day the learner was active. Null = never active. */
  lastActiveDate: IsoDate | null;
  /** Unused freezes the learner holds. */
  freezesAvailable: number;
  /** Days a freeze was spent to bridge a gap (audit + dedupe). */
  freezeUsedDates: IsoDate[];
}

export interface StreakConfig {
  /**
   * How many consecutive missed days a single freeze can bridge. With
   * graceDays=1, missing exactly one day spends one freeze and keeps the
   * streak; missing two breaks it.
   */
  graceDays: number;
  /** Cap on freezesAvailable. */
  maxFreezes: number;
}

export interface StreakUpdateResult {
  state: StreakState;
  /** Any field changed. */
  changed: boolean;
  /** current went up by 1 on this call. */
  incremented: boolean;
  /** A freeze was spent to preserve the streak across a gap. */
  freezeConsumed: boolean;
  /** The streak reset to 1 because the gap was too large to bridge. */
  broken: boolean;
}

export interface StreakStatus {
  /** Streak is alive as of `today` (active today or yesterday). */
  active: boolean;
  /** Will break at the next local-day rollover unless the learner acts. */
  atRisk: boolean;
  /** Whole local days since lastActiveDate (0 if active today). */
  daysSinceActive: number;
}

export interface StreakEngine {
  /** Record activity for `today`. Idempotent within the same day. Pure. */
  recordActivity(
    state: StreakState,
    today: IsoDate,
    config?: StreakConfig,
  ): StreakUpdateResult;
  /** Read-only health check for display; does not mutate. */
  status(
    state: StreakState,
    today: IsoDate,
    config?: StreakConfig,
  ): StreakStatus;
  /** Grant a freeze, respecting `config.maxFreezes`. Pure. */
  grantFreeze(state: StreakState, config?: StreakConfig): StreakState;
}

// ───────────────────────── Daily goal (F3) ──────────────────────────

export type DailyGoalMetric = "minutes" | "xp" | "lessons" | "rooms";

export interface DailyGoalConfig {
  metric: DailyGoalMetric;
  /** Target count of `metric` per day. Must be > 0. */
  target: number;
}

export interface DailyGoalDayRecord {
  progress: number;
  target: number;
  metric: DailyGoalMetric;
  completed: boolean;
}

export interface DailyGoalState {
  config: DailyGoalConfig;
  /** Local day that `progress` belongs to. Null before first activity. */
  date: IsoDate | null;
  progress: number;
  completedToday: boolean;
  /** Past days keyed by IsoDate. Caller may prune; engine appends. */
  history: Record<IsoDate, DailyGoalDayRecord>;
}

export interface DailyGoalUpdateResult {
  state: DailyGoalState;
  /** Crossed the target on THIS call (fire goal_complete XP once). */
  completedNow: boolean;
}

export interface DailyGoalEngine {
  /** Add progress for `today`, auto-rolling over a stale day first. Pure. */
  addProgress(
    state: DailyGoalState,
    amount: number,
    today: IsoDate,
  ): DailyGoalUpdateResult;
  /** Change the configured goal (keeps today's progress). Pure. */
  setGoal(state: DailyGoalState, config: DailyGoalConfig): DailyGoalState;
  /** Archive a stale day into history and reset progress. Pure. */
  rollover(state: DailyGoalState, today: IsoDate): DailyGoalState;
  /** progress / target for today, clamped 0..1. */
  ratio(state: DailyGoalState): number;
}

// ──────────────────────── Achievements (F4) ─────────────────────────

export type AchievementId = string;
export type AchievementCategory =
  | "streak"
  | "xp"
  | "goal"
  | "milestone"
  | "special";

export interface AchievementDefinition {
  id: AchievementId;
  category: AchievementCategory;
  /** VI-first user-facing title. */
  title: string;
  /** VI-first user-facing description. */
  description: string;
  /** Optional emoji/icon key for the UI. */
  icon?: string;
  /** Pure predicate over the whole state. */
  isUnlocked(state: GamificationState): boolean;
  /** Optional 0..1 progress toward unlock (for locked-card hints). */
  progress?(state: GamificationState): number;
}

export interface UnlockedAchievement {
  id: AchievementId;
  unlockedAt: number;
}

export interface AchievementState {
  unlocked: Record<AchievementId, UnlockedAchievement>;
}

export interface AchievementEvaluation {
  state: AchievementState;
  /** Definitions that flipped from locked to unlocked on this evaluation. */
  newlyUnlocked: AchievementDefinition[];
}

export interface AchievementEngine {
  /**
   * Evaluate all `defs` against `fullState`, recording any new unlocks at
   * `now`. Idempotent: already-unlocked achievements are never re-reported.
   * Pure. `defs` defaults to the module's built-in catalog.
   */
  evaluate(
    achState: AchievementState,
    fullState: GamificationState,
    now: number,
    defs?: AchievementDefinition[],
  ): AchievementEvaluation;
  isUnlocked(achState: AchievementState, id: AchievementId): boolean;
}

// ─────────────────────── Aggregate + store ──────────────────────────

export interface GamificationState {
  schemaVersion: number;
  xp: XpState;
  streak: StreakState;
  dailyGoal: DailyGoalState;
  achievements: AchievementState;
}

/**
 * Persistence boundary. The shipping implementation is IndexedDB-backed
 * (F5). A server-backed implementation can satisfy the same interface
 * later with zero engine/UI changes — that is the whole point of routing
 * every read/write through this seam.
 */
export interface GamificationStore {
  /** Load state, returning a fresh default if nothing is persisted. */
  load(): Promise<GamificationState>;
  /** Persist the full state. */
  save(state: GamificationState): Promise<void>;
  /** Wipe persisted state (logout / reset). */
  clear(): Promise<void>;
  /** False in SSR / tests with no backing store available. */
  isAvailable(): boolean;
}
