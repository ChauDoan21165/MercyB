// src/features/review/types.ts — Lane D — the SRS module contract.
//
// THIS FILE IS THE INTERFACE BOUNDARY between every slice (D1–D7). Changing a
// type here is a stop-the-world event: it ripples into every slice. Do not edit
// without lane-leader sign-off. Implementations live in the slice subdirs; this
// file holds only types + pure data shapes (no runtime logic, no imports).
//
// Conventions (see README):
//   - Time is ms-epoch everywhere (`nowMs`, `due`, `lastReview`, `reviewedAt`).
//   - Pure logic takes an explicit clock; never call Date.now() in schedulers
//     or session logic.
//   - ReviewItem.id is namespaced "<flow>:<kind>:<slug>" and stable across
//     content rebuilds.

// ── Flow identity ──────────────────────────────────────────────────────────

/** ISO-639-1 codes for the languages this module touches. */
export type LanguageCode = "vi" | "en" | "de" | "ja" | "ko" | "zh" | "es";

/** The 7 study flows. `<prompt>-<answer>`. */
export type ReviewFlowId =
  | "vi-en"
  | "vi-de"
  | "vi-ja"
  | "vi-ko"
  | "vi-zh"
  | "en-vi"
  | "en-es";

export interface ReviewFlow {
  id: ReviewFlowId;
  /** Front / prompt language (what the learner is shown first). */
  prompt: LanguageCode;
  /** Back / answer language (what they recall). */
  answer: LanguageCode;
  /** Vietnamese-facing deck label, e.g. "Việt → Anh". */
  label: string;
}

// ── Grading ────────────────────────────────────────────────────────────────

/** The four FSRS grades the learner can give a card. */
export type ReviewGrade = "again" | "hard" | "good" | "easy";

export const REVIEW_GRADES: readonly ReviewGrade[] = [
  "again",
  "hard",
  "good",
  "easy",
] as const;

// ── ReviewItem — a reviewable unit of content (D3 produces these) ───────────

export type ReviewItemKind = "vocab" | "sentence";

export interface ReviewItem {
  /** Stable, namespaced id: "<flow>:<kind>:<slug>". */
  id: string;
  flow: ReviewFlowId;
  kind: ReviewItemKind;
  /** Text shown on the card FRONT, in the flow's prompt language. */
  front: string;
  /** Text shown on the card BACK, in the flow's answer language. */
  back: string;
  /** Optional pronunciation hint: IPA / romaji / pinyin / romanization. */
  pronunciation?: string;
  /** Optional example sentence (answer language). */
  example?: string;
  /** Optional short note/gloss, always in Vietnamese when present. */
  noteVi?: string;
  /**
   * Optional canonical audio key (NOT a URL). Resolved read-only through the
   * existing audio pipeline at render time. Absent = no audio button.
   */
  audioKey?: string;
  /** Provenance string for debugging + dedup (e.g. "spanish/lessons-a1"). */
  source: string;
}

// ── Scheduling — Scheduler (D1) wraps ts-fsrs behind this ──────────────────

export type CardLearningState = "new" | "learning" | "review" | "relearning";

/**
 * The scheduling state of a single card. This is OUR shape, not ts-fsrs's —
 * D1 converts to/from `ts-fsrs.Card` internally so no other layer depends on
 * ts-fsrs types. All times are ms-epoch.
 */
export interface SchedulerCardState {
  /** ms-epoch when the card next becomes due. */
  due: number;
  /** FSRS stability (days). */
  stability: number;
  /** FSRS difficulty (1–10). */
  difficulty: number;
  /** Days elapsed since last review at the time it was scheduled. */
  elapsedDays: number;
  /** Scheduled interval in days. */
  scheduledDays: number;
  /** Total successful + failed reviews. */
  reps: number;
  /** Times the card lapsed (graded "again" from review). */
  lapses: number;
  state: CardLearningState;
  /** ms-epoch of the last review, or null if never reviewed. */
  lastReview: number | null;
}

export interface SchedulerReviewResult {
  /** Card state after applying the grade. */
  state: SchedulerCardState;
  /** Interval in days until the card is next due. */
  intervalDays: number;
  /** Log entry describing this review (D2 appends it). */
  log: ReviewLogEntry;
}

export interface Scheduler {
  /** Fresh scheduling state for a brand-new, never-seen card. */
  newCard(nowMs: number): SchedulerCardState;
  /** Apply a grade at `nowMs`; returns the updated state, interval, and log. */
  review(
    state: SchedulerCardState,
    grade: ReviewGrade,
    nowMs: number,
    itemId: string,
    flow: ReviewFlowId,
  ): SchedulerReviewResult;
  /**
   * Preview the resulting interval (in days) for each grade WITHOUT mutating.
   * Used by the UI to label the grade buttons ("4 ngày", "10 ngày", …).
   */
  preview(state: SchedulerCardState, nowMs: number): Record<ReviewGrade, number>;
}

// ── Persistence — ReviewStore (D2) over IndexedDB ──────────────────────────

export interface StoredCard {
  itemId: string;
  flow: ReviewFlowId;
  state: SchedulerCardState;
  /** ms-epoch the card was first introduced into review. */
  introducedAt: number;
}

export interface ReviewLogEntry {
  itemId: string;
  flow: ReviewFlowId;
  grade: ReviewGrade;
  /** ms-epoch of the review. */
  reviewedAt: number;
  /** Resulting interval in days. */
  intervalDays: number;
  /** Card learning-state after the review. */
  resultingState: CardLearningState;
}

export interface DailyCount {
  /** YYYY-MM-DD in the learner's local timezone. */
  day: string;
  flow: ReviewFlowId;
  /** New cards introduced this day. */
  newCards: number;
  /** Reviews completed this day. */
  reviews: number;
}

export interface ReviewSettings {
  flow: ReviewFlowId;
  /** Max new cards to introduce per day. */
  dailyNewLimit: number;
  /** Max reviews per day; 0 = unlimited. */
  dailyReviewLimit: number;
}

/** Default settings for a flow with no stored override. */
export const DEFAULT_REVIEW_SETTINGS: Omit<ReviewSettings, "flow"> = {
  dailyNewLimit: 20,
  dailyReviewLimit: 0,
};

export interface ReviewStore {
  // Cards
  getCard(flow: ReviewFlowId, itemId: string): Promise<StoredCard | undefined>;
  getCards(flow: ReviewFlowId): Promise<StoredCard[]>;
  /** Cards whose `state.due` <= nowMs (i.e. due now), for a flow. */
  getDueCards(flow: ReviewFlowId, nowMs: number): Promise<StoredCard[]>;
  putCard(card: StoredCard): Promise<void>;

  // Review log
  appendLog(entry: ReviewLogEntry): Promise<void>;
  getLog(flow: ReviewFlowId, sinceMs?: number): Promise<ReviewLogEntry[]>;

  // Daily counts
  getDailyCount(flow: ReviewFlowId, day: string): Promise<DailyCount>;
  incrementDailyCount(
    flow: ReviewFlowId,
    day: string,
    delta: { newCards?: number; reviews?: number },
  ): Promise<void>;

  // Settings
  getSettings(flow: ReviewFlowId): Promise<ReviewSettings>;
  putSettings(settings: ReviewSettings): Promise<void>;

  /** Wipe all data — used by tests and an explicit user reset. */
  clear(): Promise<void>;
}

// ── Content — ContentAdapter (D3) ──────────────────────────────────────────

export interface ContentAdapter {
  /** Flows this adapter can produce items for. */
  supportedFlows(): ReviewFlowId[];
  /**
   * All reviewable items for a flow, pulled READ-ONLY from existing content.
   * Returns [] (never throws) for an unsupported or empty flow.
   */
  getItems(flow: ReviewFlowId): Promise<ReviewItem[]>;
}

// ── Session — queue + grading loop (D4) ────────────────────────────────────

export interface BuildQueueOptions {
  nowMs: number;
  /** Override the daily new-card limit; defaults to the flow's settings. */
  newLimit?: number;
}

/** A card placed in a session queue: its content + scheduling state. */
export interface SessionCard {
  item: ReviewItem;
  card: StoredCard;
  /** True if this card is being introduced for the first time this session. */
  isNew: boolean;
}

export interface ReviewSessionState {
  flow: ReviewFlowId;
  /** Ordered queue for this session (due cards first, then new, per builder). */
  queue: SessionCard[];
  /** Index of the current card. Equal to queue.length when complete. */
  index: number;
  /** Running tally of grades given this session. */
  grades: Record<ReviewGrade, number>;
  /** Count of new cards actually introduced this session. */
  newIntroduced: number;
}

export interface SessionSummary {
  flow: ReviewFlowId;
  /** Total cards reviewed this session. */
  reviewed: number;
  /** New cards introduced this session. */
  newIntroduced: number;
  /** Grade tally. */
  grades: Record<ReviewGrade, number>;
  /** ms-epoch of the next due card after this session, or null if none. */
  nextDueAt: number | null;
}
