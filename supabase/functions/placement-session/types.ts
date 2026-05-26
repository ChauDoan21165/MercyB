// supabase/functions/placement-session/types.ts
//
// Placement Test v2 — shared type contracts (Phase 2, PR 1 of the series).
//
// Implements: design §2.3 (TypeScript interfaces) under the LOCKED
// server-authoritative decision (Q1). This module is SERVER-SIDE: it lives
// under supabase/functions/ deliberately so the answer key / IRT params
// never reach the browser bundle. Pure types only — zero logic, zero
// imports, zero Deno/URL specifiers (so it is type-checked by
// tsconfig.functions.json and importable by vitest via the mock-interview
// core.ts + DI Deps pattern).
//
// Sequence-doc item: PR 1 "types + config constants".
// No file imports this yet → zero behavior change / zero regression surface.

/** A scored item is one of these. `writing_sample` is post-test, unscored
 *  (locked decision #3) — it never enters θ. */
export type ItemType =
  | "reading"
  | "listening"
  | "grammar"
  | "vocabulary"
  | "writing_sample";

export type CefrBand = "pre_a1" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

/** Vietnamese L1-transfer categories. EXTEND the union; never renumber or
 *  remove a member (stored in placement_responses for calibration). */
export type L1TransferTag =
  | "article_use"
  | "plural_s"
  | "third_person_s"
  | "past_ed_regular"
  | "past_irregular"
  | "question_word_order"
  | "vowel_discrimination"
  | "false_friend"
  | "preposition_transfer";

export type SelfRating = "beginner" | "intermediate" | "advanced" | "not_sure";

export type SessionPhase =
  | "awaiting_self_rating"
  | "in_progress"
  | "terminating"
  | "complete"
  | "abandoned";

export type ThetaMethod = "mle" | "eap" | "seed";

export type TerminationReason = "precision" | "max_items" | "bank_exhausted";

/** A localized string pair. `meta.displayPreference` decides which side a
 *  given item shows; see the bilingual-leak rule (design §7.4). */
export interface Bilingual {
  en: string;
  vi: string;
}

export interface ItemOption {
  id: string;
  en: string;
  vi: string;
}

/**
 * The FULL item, as stored in the `placement_items` table (locked Q2).
 * This shape NEVER leaves the server — RLS denies all client reads and
 * the edge function only ever returns `PublicItem` (below). Answer-bearing
 * fields: `correctOptionId`, `transcript`, plus the IRT params and authoring
 * `meta` (exposing difficulty/discrimination would let a client infer the
 * answer / game exposure).
 */
export interface Item {
  id: string; // stable, e.g. "rd_b1_017"
  type: ItemType;
  cefr: CefrBand; // authoring-intent band (QA + reporting)
  /** IRT difficulty b_i on the θ logit scale (≈ [-3, 3]). Expert until pilot. */
  difficulty: number;
  /** IRT discrimination a_i (> 0). Expert until pilot. 0.5–2.5 typical. */
  discrimination: number;
  /** Pseudo-guessing c_i. v1 = 2PL → omitted/0. Reserved for future 3PL. */
  guessing?: number;
  skill: "reading" | "listening" | "grammar" | "vocabulary" | "writing";
  prompt: Bilingual;
  passage?: Bilingual; // reading only
  options?: ItemOption[]; // MC items
  correctOptionId?: string; // MC items — SERVER ONLY
  audio?: { key: string; replayLimit: number }; // listening only
  transcript?: Bilingual; // listening — WITHHELD in-test, SERVER ONLY
  isL1TransferDistractor?: boolean;
  l1Tags?: L1TransferTag[];
  /** Authoring metadata, never shown to the learner. SERVER ONLY. */
  meta: {
    author: string;
    cefrDescriptor: string;
    /** 'expert' until a pilot replaces it with 'empirical'. */
    paramSource: "expert" | "empirical";
    pilotN?: number;
    displayPreference: "vi_first" | "en_first";
  };
}

/**
 * The ONLY item shape the client ever receives (locked Q1, design §4
 * Option B "PublicItem = Item WITHOUT correctOptionId / transcript /
 * answer fields").
 *
 * Hand-written (NOT `Omit<Item, ...>`) on purpose: a derived type would
 * silently leak any future answer-bearing field added to `Item`. This
 * explicit allow-list is the server-authoritative contract — adding a
 * field to `Item` does NOT add it here unless a human writes it here.
 * Renders an item; carries nothing that reveals the answer, the IRT
 * difficulty, or authoring intent.
 */
export interface PublicItem {
  id: string;
  type: ItemType;
  skill: Item["skill"];
  prompt: Bilingual;
  passage?: Bilingual;
  options?: ItemOption[]; // option ids + text only — NO correctOptionId
  audio?: { key: string; replayLimit: number }; // key resolves via useAudioUrl
  /** Per-item answer time budget (ms), server-issued (anti-cheat). */
  timeLimitMs?: number;
}

export interface Response {
  itemId: string;
  /** Dichotomous score. writing_sample → null (not IRT-scored, decision #3). */
  correct: boolean | null;
  selectedOptionId?: string;
  responseMs: number; // anti-cheat signal
  timedOut: boolean;
  l1RevealedUsed: boolean; // pressed an L1 crutch (cf. PR #656)
  audioPlays?: number; // listening only
  shownAt: string; // ISO — idempotency + resume anchor
  answeredAt: string; // ISO
}

export interface ThetaEstimate {
  theta: number; // θ̂
  se: number; // standard error = 1/√I(θ̂)
  method: ThetaMethod;
  iterations: number; // Newton–Raphson iters (0 for seed/eap-closed)
  converged: boolean;
}

export interface SessionState {
  sessionId: string;
  userId: string;
  bankVersion: string; // equating safety
  phase: SessionPhase;
  selfRating: SelfRating | null;
  priorMean: number; // θ prior from self-rating (μ₀)
  administered: Response[]; // append-only; index = item order
  servedItemIds: string[]; // exposure within session
  current: ThetaEstimate;
  currentItemId: string | null; // item awaiting a response (resume anchor)
  typeCounts: Record<ItemType, number>;
  startedAt: string;
  updatedAt: string;
}

export interface ItemBank {
  version: string;
  items: ReadonlyArray<Item>;
  byType: Readonly<Record<ItemType, ReadonlyArray<Item>>>;
  byId: Readonly<Record<string, Item>>;
}

export interface PerSkillScore {
  skill: ItemType;
  theta: number | null; // null if below min-items-for-subscore
  se: number | null;
  itemsSeen: number;
  reportable: boolean; // itemsSeen >= MIN_ITEMS_PER_SUBSCORE
}

export interface L1WeaknessEntry {
  tag: L1TransferTag;
  seen: number;
  correct: number;
  errorRate: number;
  severity: "low" | "moderate" | "high";
}

export interface ResultPayload {
  sessionId: string;
  bankVersion: string;
  overall: { cefr: CefrBand; theta: number; se: number };
  perSkill: PerSkillScore[];
  l1Weaknesses: L1WeaknessEntry[];
  recommendedRoomId: string; // via existing cefrToRoom.ts (unchanged contract)
  itemsAdministered: number;
  elapsedMs: number;
  terminationReason: TerminationReason;
  /** UI renders the VI copy; eligibleAt is an ISO timestamp. */
  retest: { eligibleAt: string; rationale: string };
  growth:
    | null
    | {
        fromCefr: CefrBand;
        toCefr: CefrBand;
        deltaTheta: number;
        sinceISO: string;
        narrativeKey: string;
      };
  createdAt: string;
}

/** One denormalized append to `profiles.placement_history` (design §3.1).
 *  Fast-read growth log; relational tables are the source of truth. */
export interface PlacementHistoryEntry {
  ts: string; // ISO
  bankVersion: string;
  theta: number | null; // null for the retroactive v1 backfill entry
  se: number | null;
  cefr: CefrBand;
  perSkill: Partial<Record<"reading" | "listening" | "grammar" | "vocabulary", number>>;
  l1Top: L1TransferTag[];
  sessionId: string;
  source?: "v1" | "v2"; // 'v1' only on the one-time legacy backfill row
}
